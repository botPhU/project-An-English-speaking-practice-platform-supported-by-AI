/**
 * Assignment Service
 * Frontend API calls for mentor-learner assignments
 */

import api from './api';

export interface Assignment {
    id: number;
    mentor_id: number;
    learner_id: number;
    mentor_name: string;
    mentor_email: string;
    mentor_avatar: string | null;
    mentor_online: boolean;
    learner_name: string;
    learner_email: string;
    learner_avatar: string | null;
    assigned_by: number;
    admin_name: string;
    status: string;
    notes: string | null;
    assigned_at: string;
    ended_at: string | null;
}

export interface UnassignedUser {
    id: number;
    full_name: string;
    email: string;
    avatar_url: string | null;
}

export const assignmentService = {
    // Admin endpoints
    getAllAssignments: async (status?: string): Promise<Assignment[]> => {
        const params = status ? { status } : {};
        const response = await api.get('/assignments/', { params });
        return response.data;
    },

    createAssignment: async (mentorId: number, learnerId: number, adminId: number, notes?: string) => {
        const response = await api.post('/assignments/', {
            mentor_id: mentorId,
            learner_id: learnerId,
            admin_id: adminId,
            notes
        });
        return response.data;
    },

    endAssignment: async (assignmentId: number) => {
        const response = await api.delete(`/assignments/${assignmentId}`);
        return response.data;
    },

    getUnassignedMentors: async (): Promise<UnassignedUser[]> => {
        const response = await api.get('/assignments/unassigned-mentors');
        return response.data;
    },

    getUnassignedLearners: async (): Promise<UnassignedUser[]> => {
        const response = await api.get('/assignments/unassigned-learners');
        return response.data;
    },

    // Mentor endpoint - returns array of learners (1-to-many)
    getMyLearner: async (mentorId: number): Promise<Assignment[]> => {
        const response = await api.get('/assignments/mentor/my-learner', {
            params: { mentor_id: mentorId }
        });
        return response.data;
    },

    // Learner endpoint
    getMyMentor: async (learnerId: number): Promise<Assignment | null> => {
        const response = await api.get('/assignments/learner/my-mentor', {
            params: { learner_id: learnerId }
        });
        return response.data;
    }
};

export default assignmentService;
