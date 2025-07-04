import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_PASSWORD } from './config';
import { RoomManager } from './RoomManager';
import client from '@repo/db/client';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"], // Frontend URLs
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Authentication middleware for Socket.IO
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const decoded = jwt.verify(token, JWT_PASSWORD) as JwtPayload;
    if (!decoded.userId) {
      return next(new Error('Authentication error: Invalid token'));
    }

    // Get user details from database
    const user = await client.user.findUnique({
      where: { id: decoded.userId },
      include: {
        startupProfile: true,
        mentorProfile: true,
        investorProfile: true
      }
    });

    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }

    // Attach user data to socket
    socket.data.user = {
      id: user.id,
      username: user.username,
      userType: user.userType,
      role: user.role,
      isVerified: user.isVerified,
      startupProfile: user.startupProfile,
      mentorProfile: user.mentorProfile,
      investorProfile: user.investorProfile
    };

    next();
  } catch (error) {
    next(new Error('Authentication error: Invalid token'));
  }
});

const roomManager = RoomManager.getInstance();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.data.user.username} (${socket.data.user.userType})`);

  // Update user's last active timestamp
  client.user.update({
    where: { id: socket.data.user.id },
    data: { lastActive: new Date() }
  }).catch(console.error);

  // Handle joining spaces/rooms
  socket.on('join-space', async (data) => {
    try {
      const { spaceId } = data;

      // Validate space exists
      const space = await client.space.findUnique({
        where: { id: spaceId }
      });

      if (!space) {
        socket.emit('error', { message: 'Space not found' });
        return;
      }

      // Leave previous room if any
      if (socket.data.currentSpace) {
        socket.leave(socket.data.currentSpace);
        roomManager.removeUser(socket.data.user.id, socket.data.currentSpace);
      }

      // Join new space
      socket.join(spaceId);
      socket.data.currentSpace = spaceId;
      socket.data.x = Math.floor(Math.random() * space.width);
      socket.data.y = Math.floor(Math.random() * space.height);

      // Add to room manager
      roomManager.addUser(spaceId, {
        id: socket.data.user.id,
        username: socket.data.user.username,
        userType: socket.data.user.userType,
        x: socket.data.x,
        y: socket.data.y,
        socketId: socket.id
      });

      // Get other users in the space
      const otherUsers = roomManager.getUsersInRoom(spaceId)
        .filter(u => u.id !== socket.data.user.id);

      // Send space joined confirmation
      socket.emit('space-joined', {
        spawn: { x: socket.data.x, y: socket.data.y },
        users: otherUsers,
        space: {
          id: space.id,
          name: space.name,
          width: space.width,
          height: space.height
        }
      });

      // Notify other users
      socket.to(spaceId).emit('user-joined', {
        id: socket.data.user.id,
        username: socket.data.user.username,
        userType: socket.data.user.userType,
        x: socket.data.x,
        y: socket.data.y
      });

    } catch (error) {
      console.error('Join space error:', error);
      socket.emit('error', { message: 'Failed to join space' });
    }
  });

  // Handle movement
  socket.on('move', (data) => {
    try {
      const { x, y } = data;
      const currentX = socket.data.x || 0;
      const currentY = socket.data.y || 0;

      // Validate movement (only allow 1 step at a time)
      const xDisplacement = Math.abs(currentX - x);
      const yDisplacement = Math.abs(currentY - y);

      if ((xDisplacement === 1 && yDisplacement === 0) ||
          (xDisplacement === 0 && yDisplacement === 1)) {

        socket.data.x = x;
        socket.data.y = y;

        // Update in room manager
        if (socket.data.currentSpace) {
          roomManager.updateUserPosition(socket.data.user.id, socket.data.currentSpace, x, y);

          // Broadcast movement to other users in the space
          socket.to(socket.data.currentSpace).emit('user-moved', {
            userId: socket.data.user.id,
            x,
            y
          });
        }
      } else {
        // Reject invalid movement
        socket.emit('movement-rejected', {
          x: currentX,
          y: currentY
        });
      }
    } catch (error) {
      console.error('Movement error:', error);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.data.user.username}`);

    if (socket.data.currentSpace) {
      // Remove from room manager
      roomManager.removeUser(socket.data.user.id, socket.data.currentSpace);

      // Notify other users
      socket.to(socket.data.currentSpace).emit('user-left', {
        userId: socket.data.user.id
      });
    }
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running on port ${PORT}`);
});