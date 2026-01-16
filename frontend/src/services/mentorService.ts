import api from './api';

export const mentorService = {
    // Dashboard
    getDashboard: (mentorId: number) => api.get(`/mentor/dashboard/${mentorId}`),

    // Profile
    getProfile: (mentorId: number) => api.get(`/mentor/profile/${mentorId}`),
    updateProfile: (mentorId: number, data: any) => api.put(`/mentor/profile/${mentorId}`, data),

    // Learner Management
    getLearners: (mentorId: number) => api.get(`/mentor/learners/${mentorId}`),
    getLearnerSessions: (mentorId: number, learnerId: number) =>
        api.get(`/mentor/learners/${mentorId}/${learnerId}/sessions`),
    assessLearner: (data: { mentor_id: number; learner_id: number; assessment: any }) =>
        api.post('/mentor/assess', data),

    // Resources
    getResources: (mentorId: number) => api.get(`/mentor/resources/${mentorId}`),
    createResource: (data: any) => api.post('/mentor/resources', data),

    // Feedback
    provideSessionFeedback: (sessionId: number, data: { mentor_id: number; feedback: any }) =>
        api.post(`/mentor/feedback/session/${sessionId}`, data),
    createLearnerFeedback: (data: { mentor_id: number; learner_id: number; feedback: any }) =>
        api.post('/mentor/feedback/learner', data),

    // Topics
    getConversationTopics: () => api.get('/mentor/topics'),
    createTopic: (data: any) => api.post('/mentor/topics', data),

    // Schedule/Sessions
    getUpcomingSessions: (mentorId: number) => api.get(`/mentor/sessions/${mentorId}/upcoming`),
    getRecentFeedback: (mentorId: number) => api.get(`/mentor/feedback/${mentorId}/recent`),

    // Practice Sessions (for reviewing learner recordings)
    getPracticeSessions: (mentorId: number) => api.get(`/practice/sessions/mentor/${mentorId}`),
    getSessionAudioUrl: (sessionId: number) => `/api/practice/sessions/${sessionId}/audio`,

    // Booking Management
    getBookings: (mentorId: number) => api.get(`/learner/bookings/${mentorId}`, { params: { role: 'mentor' } }),
    updateBookingStatus: (bookingId: number, status: string) => api.put(`/learner/booking/${bookingId}`, { status }),

    // Reviews
    submitReview: (data: {
        learner_id: number;
        mentor_id: number;
        rating: number;
        comment?: string;
        session_id?: number;
        booking_id?: number;
    }) => api.post('/mentor/reviews', data),

    getMentorReviews: (mentorId: number) => api.get(`/mentor/reviews/${mentorId}`),
};
