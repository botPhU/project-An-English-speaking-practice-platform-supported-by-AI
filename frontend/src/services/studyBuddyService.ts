/**
 * Study Buddy Service
 * Frontend API calls for learner-to-learner matching
 */

import api from './api';

export interface PotentialBuddy {
    id: number;
    full_name: string;
    avatar_url: string | null;
    level: string;
    xp_points: number;
    current_streak: number;
    total_sessions: number;
    is_online: boolean;
}

export interface MatchResult {
    matched: boolean;
    buddy?: {
        id: number;
        full_name: string;
        avatar_url: string | null;
    };
    room_name?: string;
    topic?: string;
    message?: string;
    position?: number;
    waiting?: boolean;
}

export const studyBuddyService = {
    // Find potential study buddies
    findBuddies: async (userId: number, level?: string, limit: number = 10): Promise<PotentialBuddy[]> => {
        const params: Record<string, unknown> = { user_id: userId, limit };
        if (level) params.level = level;
        const response = await api.get('/study-buddy/find', { params });
        return response.data;
    },

    // Request to be matched
    requestMatch: async (userId: number, topic?: string, level?: string): Promise<MatchResult> => {
        const response = await api.post('/study-buddy/match', {
            user_id: userId,
            topic,
            level
        });
        return response.data;
    },

    // Check match status (poll this)
    checkStatus: async (userId: number): Promise<MatchResult> => {
        const response = await api.get('/study-buddy/status', {
            params: { user_id: userId }
        });
        return response.data;
    },

    // Cancel pending request
    cancelRequest: async (userId: number): Promise<{ success: boolean }> => {
        const response = await api.post('/study-buddy/cancel', { user_id: userId });
        return response.data;
    },

    // End study session
    endSession: async (userId: number): Promise<{ success: boolean }> => {
        const response = await api.post('/study-buddy/end', { user_id: userId });
        return response.data;
    }
};

export default studyBuddyService;
