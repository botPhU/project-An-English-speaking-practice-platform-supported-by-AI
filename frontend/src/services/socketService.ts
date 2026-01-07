/**
 * Socket.IO Service
 * Global socket connection for real-time user status
 */

import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5000';

class SocketService {
    private socket: Socket | null = null;
    private userId: string | null = null;

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

        return this.socket;
    }

    disconnect(): void {
        if (this.userId) {
            this.socket?.emit('user_offline', { userId: this.userId });
        }
        this.socket?.disconnect();
        this.socket = null;
        this.userId = null;
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
