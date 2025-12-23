import api from './api';

export const adminService = {
    // Dashboard
    getDashboard: () => api.get('/admin/dashboard'),

    // User Management
    getUsers: () => api.get('/admin/users'),
    enableUser: (userId: string) => api.put(`/admin/users/${userId}/enable`),
    disableUser: (userId: string) => api.put(`/admin/users/${userId}/disable`),

    // Mentor Management
    getMentors: () => api.get('/admin/mentors'),
    updateMentorSkills: (mentorId: string, skills: string[]) =>
        api.put(`/admin/mentors/${mentorId}/skills`, { skills }),

    // Package Management
    getPackages: () => api.get('/admin/packages'),
    createPackage: (data: any) => api.post('/admin/packages', data),
    updatePackage: (packageId: string, data: any) => api.put(`/admin/packages/${packageId}`, data),
    deletePackage: (packageId: string) => api.delete(`/admin/packages/${packageId}`),

    // Purchase History
    getPurchaseHistory: () => api.get('/admin/purchases'),

    // Feedback Moderation
    getFeedbacks: () => api.get('/admin/feedbacks'),
    moderateFeedback: (feedbackId: string, action: 'approve' | 'reject') =>
        api.put(`/admin/feedbacks/${feedbackId}`, { action }),

    // Policies
    getPolicies: () => api.get('/admin/policies'),
    createPolicy: (data: any) => api.post('/admin/policies', data),

    // Reports
    getStatistics: () => api.get('/admin/statistics'),
    getReports: () => api.get('/admin/reports'),
};
