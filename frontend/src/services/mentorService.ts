import api from './api';

export const mentorService = {
    // Dashboard
    getDashboard: () => api.get('/mentor/dashboard'),

    // Learner Management
    getLearners: () => api.get('/mentor/learners'),
    assessLearner: (learnerId: string, data: any) => api.post(`/mentor/learners/${learnerId}/assess`, data),

    // Resources
    getResources: () => api.get('/mentor/resources'),
    createResource: (data: any) => api.post('/mentor/resources', data),

    // Feedback
    giveFeedback: (learnerId: string, sessionId: string, data: any) =>
        api.post(`/mentor/feedback/${learnerId}/${sessionId}`, data),

    // Topics
    getConversationTopics: () => api.get('/mentor/topics'),
    createTopic: (data: any) => api.post('/mentor/topics', data),
};
