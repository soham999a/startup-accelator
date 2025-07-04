const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5174",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Mock data
let users = [];
let onlineUsers = new Map();
let startupProfiles = new Map();

// Mock user data
const mockUser = {
  id: 'user-1',
  username: 'testuser',
  email: 'test@example.com',
  userType: 'FOUNDER',
  firstName: 'John',
  lastName: 'Doe',
  bio: 'Passionate entrepreneur building the future',
  profileImage: null,
  isVerified: true,
  hasStartupProfile: false,
  joinedAt: new Date().toISOString()
};

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  res.json({
    success: true,
    user: mockUser,
    token: 'mock-jwt-token'
  });
});

app.post('/api/auth/register', (req, res) => {
  const newUser = {
    ...mockUser,
    id: 'user-' + Date.now(),
    username: req.body.username,
    email: req.body.email,
    userType: req.body.userType,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  };
  
  res.json({
    success: true,
    user: newUser,
    token: 'mock-jwt-token'
  });
});

// Profile endpoints
app.get('/api/profiles/me', (req, res) => {
  res.json({
    success: true,
    user: mockUser
  });
});

app.put('/api/profiles/me', (req, res) => {
  Object.assign(mockUser, req.body);
  res.json({
    success: true,
    user: mockUser
  });
});

app.post('/api/profiles/startup', (req, res) => {
  const profile = {
    id: 'startup-' + Date.now(),
    userId: mockUser.id,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
  startupProfiles.set(mockUser.id, profile);
  mockUser.hasStartupProfile = true;
  
  res.json({
    success: true,
    profile: profile
  });
});

app.get('/api/profiles/startup', (req, res) => {
  const profile = startupProfiles.get(mockUser.id);
  res.json({
    success: true,
    profile: profile || null
  });
});

// Socket.io for real-time features
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join-lobby', (userData) => {
    const user = {
      id: socket.id,
      socketId: socket.id,
      username: userData.username || 'Anonymous',
      userType: userData.userType || 'FOUNDER',
      firstName: userData.firstName,
      lastName: userData.lastName,
      profileImage: userData.profileImage,
      x: Math.floor(Math.random() * 15),
      y: Math.floor(Math.random() * 10)
    };
    
    onlineUsers.set(socket.id, user);
    
    // Send current user position
    socket.emit('user-position', { x: user.x, y: user.y });
    
    // Send list of online users to all clients
    io.emit('users-update', Array.from(onlineUsers.values()));
    
    console.log('User joined lobby:', user.username);
  });
  
  socket.on('move', (position) => {
    const user = onlineUsers.get(socket.id);
    if (user) {
      user.x = position.x;
      user.y = position.y;
      onlineUsers.set(socket.id, user);
      
      // Broadcast updated user list
      io.emit('users-update', Array.from(onlineUsers.values()));
    }
  });
  
  socket.on('disconnect', () => {
    onlineUsers.delete(socket.id);
    io.emit('users-update', Array.from(onlineUsers.values()));
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Mock server running on http://localhost:${PORT}`);
  console.log(`📡 Socket.io server ready for connections`);
});
