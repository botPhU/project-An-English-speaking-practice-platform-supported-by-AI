// WebSocket event types for real-time user status tracking

export type OnlineStatus = 'online' | 'offline' | 'away';

export type WebSocketEventType =
    | 'USER_STATUS_CHANGE'
    | 'USER_CREATED'
    | 'USER_DELETED'
    | 'USER_UPDATED';

export interface UserStatusChangePayload {
    userId: string;
    status: OnlineStatus;
    lastActive?: string;
}

export interface WebSocketMessage<T = unknown> {
    type: WebSocketEventType;
    payload: T;
    timestamp?: number;
}

export interface UserStatusChangeMessage extends WebSocketMessage<UserStatusChangePayload> {
    type: 'USER_STATUS_CHANGE';
}

// WebSocket connection states
export type WebSocketConnectionState = 'connecting' | 'connected' | 'disconnected' | 'reconnecting';
