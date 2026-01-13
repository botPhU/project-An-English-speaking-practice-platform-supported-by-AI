/**
 * Socket.IO Service
 * Global socket connection for real-time user status
 */

import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5000';

class SocketService {
    private socket: Socket | null = null;
    private userId: string | null = null;
    private onlineUsers: Set<string> = new Set();
    private onlineStatusCallbacks: Map<string, (isOnline: boolean) => void> = new Map();

    connect(): Socket {
        if (this.socket?.connected) {
            return this.socket;
        }

        this.socket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        this.socket.on('connect', () => {
            console.log('[SocketService] Connected to server');
            // Re-emit user_online if we have a userId (reconnection case)
            if (this.userId) {
                this.emitUserOnline(this.userId);
            }
        });

        this.socket.on('disconnect', (reason) => {
            console.log('[SocketService] Disconnected:', reason);
        });

        this.socket.on('connect_error', (error) => {
            console.error('[SocketService] Connection error:', error);
        });

        // Listen for online/offline status updates
        this.socket.on('user_status_update', (data: { userId: string; isOnline: boolean }) => {
            if (data.isOnline) {
                this.onlineUsers.add(data.userId);
            } else {
                this.onlineUsers.delete(data.userId);
            }
            // Notify subscribers
            const callback = this.onlineStatusCallbacks.get(data.userId);
            if (callback) {
                callback(data.isOnline);
            }
        });

        return this.socket;
    }

    disconnect(): void {
        if (this.userId) {
            this.socket?.emit('user_offline', { userId: this.userId });
        }
        this.socket?.disconnect();
        this.socket = null;
        this.userId = null;
        this.onlineUsers.clear();
    }

    emitUserOnline(userId: string): void {
        this.userId = userId;
        if (this.socket?.connected) {
            this.socket.emit('user_online', { userId });
            console.log('[SocketService] Emitted user_online for:', userId);
        }
    }

    emitUserOffline(userId: string): void {
        if (this.socket?.connected) {
            this.socket.emit('user_offline', { userId });
            console.log('[SocketService] Emitted user_offline for:', userId);
        }
        this.userId = null;
    }

    // Check if a specific user is online
    checkUserOnline(userId: string): void {
        if (this.socket?.connected) {
            this.socket.emit('check_user_online', { userId });
        }
    }

    // Subscribe to a user's online status changes
    subscribeToUserStatus(userId: string, callback: (isOnline: boolean) => void): void {
        this.onlineStatusCallbacks.set(userId, callback);
        // Request current status
        this.checkUserOnline(userId);
    }

    // Unsubscribe from a user's online status changes
    unsubscribeFromUserStatus(userId: string): void {
        this.onlineStatusCallbacks.delete(userId);
    }

    isUserOnline(userId: string): boolean {
        return this.onlineUsers.has(userId);
    }

    getSocket(): Socket | null {
        return this.socket;
    }

    isConnected(): boolean {
        return this.socket?.connected ?? false;
    }
}

// Singleton instance
export const socketService = new SocketService();
export default socketService;
