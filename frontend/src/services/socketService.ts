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

// Matchmaking interfaces
export interface MatchFoundData {
    matched: boolean;
    buddy: {
        id: number;
        full_name: string;
        avatar_url?: string;
    };
    room_name: string;
    topic?: string;
}

export interface PracticeInviteData {
    fromUserId: string;
    fromUserName: string;
    fromUserAvatar?: string;
    topic?: string;
}

export interface InviteAcceptedData {
    userId: string;
    userName?: string;
    userAvatar?: string;
    roomName: string;
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

    // Generic event listener - for custom events
    on(event: string, callback: (data: any) => void): void {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    // Remove event listener
    off(event: string, callback?: (data: any) => void): void {
        if (this.socket) {
            if (callback) {
                this.socket.off(event, callback);
            } else {
                this.socket.off(event);
            }
        }
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

    // ============ MATCHMAKING / STUDY BUDDY METHODS ============

    private matchFoundCallback: ((data: MatchFoundData) => void) | null = null;
    private practiceInviteCallback: ((data: PracticeInviteData) => void) | null = null;
    private inviteAcceptedCallback: ((data: InviteAcceptedData) => void) | null = null;
    private inviteDeclinedCallback: ((data: { userId: string; reason: string }) => void) | null = null;
    private sessionStartingCallback: ((data: { buddyId: string; roomName: string }) => void) | null = null;
    private sessionEndedCallback: ((data: { endedBy: string; roomName: string }) => void) | null = null;
    private matchmakingQueuedCallback: ((data: { matched: boolean; message: string; position: number }) => void) | null = null;

    // Initialize matchmaking event listeners
    initMatchmakingEvents(): void {
        if (!this.socket) return;

        this.socket.on('match_found', (data: MatchFoundData) => {
            console.log('[SocketService] Match found:', data);
            if (this.matchFoundCallback) {
                this.matchFoundCallback(data);
            }
        });

        this.socket.on('matchmaking_queued', (data: any) => {
            console.log('[SocketService] Matchmaking queued:', data);
            if (this.matchmakingQueuedCallback) {
                this.matchmakingQueuedCallback(data);
            }
        });

        this.socket.on('matchmaking_cancelled', (data: any) => {
            console.log('[SocketService] Matchmaking cancelled:', data);
        });

        this.socket.on('practice_invite_received', (data: PracticeInviteData) => {
            console.log('[SocketService] Practice invite received:', data);
            if (this.practiceInviteCallback) {
                this.practiceInviteCallback(data);
            }
        });

        this.socket.on('invite_sent', (data: any) => {
            console.log('[SocketService] Invite sent confirmation:', data);
        });

        this.socket.on('invite_failed', (data: any) => {
            console.log('[SocketService] Invite failed:', data);
        });

        this.socket.on('invite_accepted', (data: InviteAcceptedData) => {
            console.log('[SocketService] Invite accepted:', data);
            if (this.inviteAcceptedCallback) {
                this.inviteAcceptedCallback(data);
            }
        });

        this.socket.on('invite_declined', (data: { userId: string; reason: string }) => {
            console.log('[SocketService] Invite declined:', data);
            if (this.inviteDeclinedCallback) {
                this.inviteDeclinedCallback(data);
            }
        });

        this.socket.on('session_starting', (data: { buddyId: string; roomName: string }) => {
            console.log('[SocketService] Session starting:', data);
            if (this.sessionStartingCallback) {
                this.sessionStartingCallback(data);
            }
        });

        this.socket.on('session_ended', (data: { endedBy: string; roomName: string }) => {
            console.log('[SocketService] Session ended:', data);
            if (this.sessionEndedCallback) {
                this.sessionEndedCallback(data);
            }
        });
    }

    // Request matchmaking via WebSocket
    requestMatchmaking(userId: string, userName: string, userAvatar: string, level?: string, topic?: string): void {
        if (this.socket?.connected) {
            this.socket.emit('request_matchmaking', { userId, userName, userAvatar, level, topic });
            console.log('[SocketService] Requesting matchmaking for:', userId);
        }
    }

    // Cancel matchmaking
    cancelMatchmaking(userId: string): void {
        if (this.socket?.connected) {
            this.socket.emit('cancel_matchmaking', { userId });
            console.log('[SocketService] Cancelling matchmaking for:', userId);
        }
    }

    // Send practice invite
    sendPracticeInvite(fromUserId: string, fromUserName: string, fromUserAvatar: string, toUserId: string, topic?: string): void {
        if (this.socket?.connected) {
            this.socket.emit('send_practice_invite', { fromUserId, fromUserName, fromUserAvatar, toUserId, topic });
            console.log('[SocketService] Sending practice invite from:', fromUserId, 'to:', toUserId);
        }
    }

    // Respond to practice invite
    respondPracticeInvite(userId: string, fromUserId: string, accept: boolean): void {
        if (this.socket?.connected) {
            this.socket.emit('respond_practice_invite', { userId, fromUserId, accept });
            console.log('[SocketService] Responding to invite from:', fromUserId, 'accept:', accept);
        }
    }

    // End practice session
    endPracticeSession(userId: string, buddyId: string, roomName: string): void {
        if (this.socket?.connected) {
            this.socket.emit('end_practice_session', { userId, buddyId, roomName });
            console.log('[SocketService] Ending practice session:', roomName);
        }
    }

    // Callback registrations
    onMatchFound(callback: (data: MatchFoundData) => void): void {
        this.matchFoundCallback = callback;
    }

    onMatchmakingQueued(callback: (data: { matched: boolean; message: string; position: number }) => void): void {
        this.matchmakingQueuedCallback = callback;
    }

    onPracticeInvite(callback: (data: PracticeInviteData) => void): void {
        this.practiceInviteCallback = callback;
    }

    onInviteAccepted(callback: (data: InviteAcceptedData) => void): void {
        this.inviteAcceptedCallback = callback;
    }

    onInviteDeclined(callback: (data: { userId: string; reason: string }) => void): void {
        this.inviteDeclinedCallback = callback;
    }

    onSessionStarting(callback: (data: { buddyId: string; roomName: string }) => void): void {
        this.sessionStartingCallback = callback;
    }

    onSessionEnded(callback: (data: { endedBy: string; roomName: string }) => void): void {
        this.sessionEndedCallback = callback;
    }

    // Remove matchmaking callbacks
    removeMatchmakingCallbacks(): void {
        this.matchFoundCallback = null;
        this.practiceInviteCallback = null;
        this.inviteAcceptedCallback = null;
        this.inviteDeclinedCallback = null;
        this.sessionStartingCallback = null;
        this.sessionEndedCallback = null;
        this.matchmakingQueuedCallback = null;
    }
}

// Singleton instance
export const socketService = new SocketService();
export default socketService;
