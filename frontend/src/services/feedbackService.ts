/**
 * Feedback Service
 * Frontend API calls for mentor feedback system
 */

import api from './api';

export interface Feedback {
    id: number;
    mentor_id: number;
    learner_id: number;
    session_id: number | null;
    mentor_name: string;
    mentor_avatar: string | null;
    learner_name: string;
    pronunciation_score: number;
    grammar_score: number;
    vocabulary_score: number;
    fluency_score: number;
    overall_score: number;
    strengths: string;
    improvements: string;
    recommendations: string;
    created_at: string;
}

export interface LearnerProgress {
    learner_id: number;
    total_sessions: number;
    recent_sessions: Array<{
        id: number;
        topic: string;
        started_at: string;
        status: string;
        overall_score: number;
    }>;
    skill_averages: {
        pronunciation: number;
        grammar: number;
        vocabulary: number;
        fluency: number;
        overall: number;
    };
    total_feedbacks: number;
    recent_feedbacks: Feedback[];
    current_level: string;
    total_practice_minutes: number;
    streak_days: number;
}

export const feedbackService = {
    createFeedback: async (data: {
        mentor_id: number;
        learner_id: number;
        session_id?: number;
        pronunciation_score?: number;
        grammar_score?: number;
        vocabulary_score?: number;
        fluency_score?: number;
        overall_score?: number;
        strengths?: string;
        improvements?: string;
        recommendations?: string;
    }) => {
        const response = await api.post('/feedback/', data);
        return response.data;
    },

    getLearnerFeedbacks: async (learnerId: number, limit?: number): Promise<Feedback[]> => {
        const params = limit ? { limit } : {};
        const response = await api.get(`/feedback/learner/${learnerId}`, { params });
        return response.data;
    },

    getMentorSentFeedbacks: async (mentorId: number, limit?: number): Promise<Feedback[]> => {
        const params = limit ? { limit } : {};
        const response = await api.get(`/feedback/mentor/${mentorId}/sent`, { params });
        return response.data;
    },

    getLearnerProgress: async (learnerId: number): Promise<LearnerProgress> => {
        const response = await api.get(`/feedback/progress/${learnerId}`);
        return response.data;
    }
};

export default feedbackService;
