/**
 * Socket.IO Service
 * Global socket connection for real-time user status and video calls
 */

import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5000';

export interface IncomingCallData {
    callerId: string;
    callerName: string;
    callerAvatar?: string;
    roomName: string;
}

export interface BookingUpdateData {
    type: string;
    booking_id: number;
    status: string;
    message: string;
    booking: any;
}

class SocketService {
    private socket: Socket | null = null;
    private userId: string | null = null;
    private onlineUsers: Set<string> = new Set();
    private onlineStatusCallbacks: Map<string, (isOnline: boolean) => void> = new Map();
    private incomingCallCallback: ((data: IncomingCallData) => void) | null = null;
    private callAcceptedCallback: ((data: { targetUserId: string; roomName: string }) => void) | null = null;
    private callDeclinedCallback: ((data: { targetUserId: string; reason: string }) => void) | null = null;
    private callFailedCallback: ((data: { targetUserId: string; reason: string }) => void) | null = null;
    private bookingUpdateCallback: ((data: BookingUpdateData) => void) | null = null;
    private newBookingCallback: ((data: any) => void) | null = null;

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

        // ============ VIDEO CALL EVENTS ============

        // Incoming call notification (for learner)
        this.socket.on('incoming_call', (data: IncomingCallData) => {
            console.log('[SocketService] Incoming call:', data);
            if (this.incomingCallCallback) {
                this.incomingCallCallback(data);
            }
        });

        // Call sent confirmation (for mentor)
        this.socket.on('call_sent', (data: { targetUserId: string; status: string }) => {
            console.log('[SocketService] Call sent:', data);
        });

        // Call failed (user offline)
        this.socket.on('call_failed', (data: { targetUserId: string; reason: string }) => {
            console.log('[SocketService] Call failed:', data);
            if (this.callFailedCallback) {
                this.callFailedCallback(data);
            }
        });

        // Call accepted by learner
        this.socket.on('call_accepted', (data: { targetUserId: string; roomName: string }) => {
            console.log('[SocketService] Call accepted:', data);
            if (this.callAcceptedCallback) {
                this.callAcceptedCallback(data);
            }
        });

        // Call declined by learner
        this.socket.on('call_declined', (data: { targetUserId: string; reason: string }) => {
            console.log('[SocketService] Call declined:', data);
            if (this.callDeclinedCallback) {
                this.callDeclinedCallback(data);
            }
        });

        // ============ BOOKING EVENTS ============

        // New booking notification (for mentor)
        this.socket.on('new_booking', (data: any) => {
            console.log('[SocketService] New booking:', data);
            if (this.newBookingCallback) {
                this.newBookingCallback(data);
            }
        });

        // Booking update notification (for learner)
        this.socket.on('booking_update', (data: BookingUpdateData) => {
            console.log('[SocketService] Booking update:', data);
            if (this.bookingUpdateCallback) {
                this.bookingUpdateCallback(data);
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

    // ============ VIDEO CALL METHODS ============

    // Initiate a call to another user
    callUser(callerId: string, callerName: string, callerAvatar: string, targetUserId: string, roomName: string): void {
        if (this.socket?.connected) {
            this.socket.emit('call_user', {
                callerId,
                callerName,
                callerAvatar,
                targetUserId,
                roomName
            });
            console.log('[SocketService] Calling user:', targetUserId);
        }
    }

    // Accept an incoming call
    acceptCall(callerId: string, targetUserId: string, roomName: string): void {
        if (this.socket?.connected) {
            this.socket.emit('call_accepted', {
                callerId,
                targetUserId,
                roomName
            });
            console.log('[SocketService] Accepted call from:', callerId);
        }
    }

    // Decline an incoming call
    declineCall(callerId: string, targetUserId: string, reason?: string): void {
        if (this.socket?.connected) {
            this.socket.emit('call_declined', {
                callerId,
                targetUserId,
                reason: reason || 'User declined the call'
            });
            console.log('[SocketService] Declined call from:', callerId);
        }
    }

    // Register callback for incoming calls
    onIncomingCall(callback: (data: IncomingCallData) => void): void {
        this.incomingCallCallback = callback;
    }

    // Register callback for call accepted
    onCallAccepted(callback: (data: { targetUserId: string; roomName: string }) => void): void {
        this.callAcceptedCallback = callback;
    }

    // Register callback for call declined
    onCallDeclined(callback: (data: { targetUserId: string; reason: string }) => void): void {
        this.callDeclinedCallback = callback;
    }

    // Register callback for call failed
    onCallFailed(callback: (data: { targetUserId: string; reason: string }) => void): void {
        this.callFailedCallback = callback;
    }

    // ============ BOOKING METHODS ============

    // Register callback for booking updates (for learner)
    onBookingUpdate(callback: (data: BookingUpdateData) => void): void {
        this.bookingUpdateCallback = callback;
    }

    // Register callback for new booking (for mentor)
    onNewBooking(callback: (data: any) => void): void {
        this.newBookingCallback = callback;
    }

    // Remove booking callbacks
    removeBookingCallbacks(): void {
        this.bookingUpdateCallback = null;
        this.newBookingCallback = null;
    }

    // Remove call callbacks
    removeCallCallbacks(): void {
        this.incomingCallCallback = null;
        this.callAcceptedCallback = null;
        this.callDeclinedCallback = null;
        this.callFailedCallback = null;
    }
}

// Singleton instance
export const socketService = new SocketService();
export default socketService;
