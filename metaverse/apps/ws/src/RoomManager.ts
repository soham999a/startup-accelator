export interface RoomUser {
    id: string;
    username: string;
    userType: string;
    x: number;
    y: number;
    socketId: string;
}

export class RoomManager {
    rooms: Map<string, RoomUser[]> = new Map();
    static instance: RoomManager;

    private constructor() {
        this.rooms = new Map();
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new RoomManager();
        }
        return this.instance;
    }

    public removeUser(userId: string, spaceId: string) {
        if (!this.rooms.has(spaceId)) {
            return;
        }
        const users = this.rooms.get(spaceId) || [];
        this.rooms.set(spaceId, users.filter((u) => u.id !== userId));

        // Clean up empty rooms
        if (this.rooms.get(spaceId)?.length === 0) {
            this.rooms.delete(spaceId);
        }
    }

    public addUser(spaceId: string, user: RoomUser) {
        if (!this.rooms.has(spaceId)) {
            this.rooms.set(spaceId, [user]);
            return;
        }

        // Remove user if already exists (reconnection case)
        this.removeUser(user.id, spaceId);

        // Add user to room
        const users = this.rooms.get(spaceId) || [];
        this.rooms.set(spaceId, [...users, user]);
    }

    public updateUserPosition(userId: string, spaceId: string, x: number, y: number) {
        if (!this.rooms.has(spaceId)) {
            return;
        }

        const users = this.rooms.get(spaceId) || [];
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex !== -1) {
            users[userIndex].x = x;
            users[userIndex].y = y;
        }
    }

    public getUsersInRoom(spaceId: string): RoomUser[] {
        return this.rooms.get(spaceId) || [];
    }

    public getUserCount(spaceId: string): number {
        return this.rooms.get(spaceId)?.length || 0;
    }

    public getAllRooms(): Map<string, RoomUser[]> {
        return this.rooms;
    }

    public getRoomStats() {
        const stats: { [spaceId: string]: number } = {};
        this.rooms.forEach((users, spaceId) => {
            stats[spaceId] = users.length;
        });
        return stats;
    }
}