import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { WebSocketConnectionState, WebSocketMessage } from '../types/websocket';

interface UseWebSocketOptions {
    url: string;
    onMessage?: (message: WebSocketMessage) => void;
    onConnectionChange?: (state: WebSocketConnectionState) => void;
    autoConnect?: boolean;
}

interface UseWebSocketReturn {
    connectionState: WebSocketConnectionState;
    isConnected: boolean;
    connect: () => void;
    disconnect: () => void;
    sendMessage: (event: string, data: unknown) => void;
}

/**
 * Custom hook for Socket.IO connection management
 * Uses socket.io-client to connect to Flask-SocketIO backend
 * Features:
 * - Auto-reconnection (built into Socket.IO)
 * - Type-safe message handling
 * - Connection state tracking
 * - Cleanup on unmount
 */
export function useWebSocket({
    url,
    onMessage,
    onConnectionChange,
    autoConnect = true,
}: UseWebSocketOptions): UseWebSocketReturn {
    const socketRef = useRef<Socket | null>(null);
    const [connectionState, setConnectionState] = useState<WebSocketConnectionState>('disconnected');
    const isUnmountedRef = useRef(false);

    // Update connection state and notify
    const updateConnectionState = useCallback((state: WebSocketConnectionState) => {
        setConnectionState(state);
        onConnectionChange?.(state);
    }, [onConnectionChange]);

    // Connect to Socket.IO server
    const connect = useCallback(() => {
        if (isUnmountedRef.current) return;

        // Cleanup existing connection
        if (socketRef.current) {
            socketRef.current.disconnect();
        }

        updateConnectionState('connecting');

        try {
            const socket = io(url, {
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
            });

            socket.on('connect', () => {
                if (isUnmountedRef.current) {
                    socket.disconnect();
                    return;
                }
                updateConnectionState('connected');
                console.log('[Socket.IO] Connected to:', url);
            });

            socket.on('disconnect', (reason) => {
                if (isUnmountedRef.current) return;
                console.log('[Socket.IO] Disconnected:', reason);
                updateConnectionState('disconnected');
            });

            socket.on('connect_error', (error) => {
                console.error('[Socket.IO] Connection error:', error);
                updateConnectionState('reconnecting');
            });

            // Listen for 'message' events from server
            socket.on('message', (message: WebSocketMessage) => {
                console.log('[Socket.IO] Received message:', message);
                onMessage?.(message);
            });

            // Also listen for 'connected' event from server
            socket.on('connected', (data) => {
                console.log('[Socket.IO] Server connected event:', data);
            });

            socketRef.current = socket;
        } catch (error) {
            console.error('[Socket.IO] Failed to connect:', error);
            updateConnectionState('disconnected');
        }
    }, [url, onMessage, updateConnectionState]);

    // Disconnect from Socket.IO
    const disconnect = useCallback(() => {
        socketRef.current?.disconnect();
        updateConnectionState('disconnected');
    }, [updateConnectionState]);

    // Send message through Socket.IO
    const sendMessage = useCallback((event: string, data: unknown) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit(event, data);
        } else {
            console.warn('[Socket.IO] Cannot send message - not connected');
        }
    }, []);

    // Auto-connect on mount
    useEffect(() => {
        isUnmountedRef.current = false;

        if (autoConnect) {
            connect();
        }

        return () => {
            isUnmountedRef.current = true;
            socketRef.current?.disconnect();
        };
    }, [autoConnect, connect]);

    return {
        connectionState,
        isConnected: connectionState === 'connected',
        connect,
        disconnect,
        sendMessage,
    };
}

export default useWebSocket;
