/**
 * Resource Service for AESP Platform
 * API calls for managing mentor resources and assignments
 */

import api from './api';

export interface Resource {
    id: number;
    mentor_id: number;
    title: string;
    description?: string;
    resource_type: string;
    file_url?: string;
    category?: string;
    difficulty_level?: string;
    is_public: boolean;
    download_count: number;
    created_at: string;
    updated_at: string;
}

export interface ResourceAssignment {
    id: number;
    resource_id: number;
    learner_id: number;
    mentor_id: number;
    status: string;
    due_date?: string;
    completion_date?: string;
    score?: number;
    mentor_feedback?: string;
    learner_notes?: string;
    assigned_at: string;
    resource?: Resource;
}

export const resourceService = {
    // Get public resources
    getPublicResources: (params?: { category?: string; difficulty_level?: string; limit?: number }) =>
        api.get('/resources', { params }),

    // Get mentor's resources
    getMentorResources: (mentorId: number) =>
        api.get(`/resources/mentor/${mentorId}`),

    // Create a new resource
    createResource: (data: {
        mentor_id: number;
        title: string;
        description?: string;
        resource_type?: string;
        file_url?: string;
        category?: string;
        difficulty_level?: string;
        is_public?: boolean;
    }) => api.post('/resources', data),

    // Update a resource
    updateResource: (resourceId: number, data: Partial<Resource> & { mentor_id: number }) =>
        api.put(`/resources/${resourceId}`, data),

    // Delete a resource
    deleteResource: (resourceId: number, mentorId: number) =>
        api.delete(`/resources/${resourceId}?mentor_id=${mentorId}`),

    // Search resources
    searchResources: (query: string, category?: string) =>
        api.get('/resources/search', { params: { q: query, category } }),

    // ==================== LEARNER ASSIGNMENTS ====================

    // Assign a resource to a learner
    assignToLearner: (data: {
        resource_id: number;
        learner_id: number;
        mentor_id: number;
        due_date?: string;
    }) => api.post('/resources/assign', data),

    // Get learner's assigned resources
    getLearnerAssignments: (learnerId: number, status?: string) =>
        api.get(`/resources/learner/${learnerId}/assigned`, { params: { status } }),

    // Get mentor's assignments
    getMentorAssignments: (mentorId: number, learnerId?: number, status?: string) =>
        api.get(`/resources/mentor/${mentorId}/assignments`, {
            params: { learner_id: learnerId, status }
        }),

    // Update an assignment
    updateAssignment: (assignmentId: number, data: {
        status?: string;
        score?: number;
        mentor_feedback?: string;
        learner_notes?: string;
    }) => api.put(`/resources/assignment/${assignmentId}`, data),

    // Delete an assignment
    deleteAssignment: (assignmentId: number, mentorId: number) =>
        api.delete(`/resources/assignment/${assignmentId}?mentor_id=${mentorId}`),
};

export default resourceService;
