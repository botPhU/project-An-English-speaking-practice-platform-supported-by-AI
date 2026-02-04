/**
 * Message Service
 * Frontend API calls for messaging between users
 */

import api from './api';

export interface Conversation {
    user_id: number;
    user_name: string;
    avatar: string | null;
    last_message: string;
    last_message_time: string;
    unread_count: number;
    is_mine: boolean;
}

export interface Message {
    id: number;
    sender_id: number;
    receiver_id: number;
    sender_name: string;
    receiver_name: string;
    content: string;
    is_read: boolean;
    created_at: string;
}

export const messageService = {
    getConversations: async (userId: number): Promise<Conversation[]> => {
        const response = await api.get('/messages/conversations', {
            params: { user_id: userId }
        });
        return response.data;
    },

    getMessages: async (userId: number, otherUserId: number, limit?: number, offset?: number): Promise<Message[]> => {
        const params: any = { user_id: userId };
        if (limit) params.limit = limit;
        if (offset) params.offset = offset;

        const response = await api.get(`/messages/${otherUserId}`, { params });
        return response.data;
    },

    sendMessage: async (senderId: number, receiverId: number, content: string): Promise<Message> => {
        const response = await api.post('/messages/send', {
            sender_id: senderId,
            receiver_id: receiverId,
            content
        });
        return response.data;
    },

    markAsRead: async (messageId: number, userId: number) => {
        const response = await api.put(`/messages/${messageId}/read`, {
            user_id: userId
        });
        return response.data;
    },

    markAllRead: async (userId: number, otherUserId: number) => {
        const response = await api.put(`/messages/read-all/${otherUserId}`, {
            user_id: userId
        });
        return response.data;
    },

    getUnreadCount: async (userId: number): Promise<number> => {
        const response = await api.get('/messages/unread-count', {
            params: { user_id: userId }
        });
        return response.data.unread_count;
    }
};

export default messageService;
