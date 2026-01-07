import api from './api';

export const adminService = {
    // Dashboard
    getDashboard: () => api.get('/admin/dashboard'),
    getDashboardStats: () => api.get('/admin/dashboard/stats'),
    getRecentActivities: (limit: number = 10) => api.get(`/admin/dashboard/activities?limit=${limit}`),
    getRevenueChart: (period: string = '30days') => api.get(`/admin/dashboard/revenue-chart?period=${period}`),
    getUserGrowth: () => api.get('/admin/dashboard/user-growth'),

    // User Management
    getUsers: (params?: { role?: string; status?: string; search?: string; page?: number; per_page?: number }) => {
        const queryParams = new URLSearchParams();
        if (params?.role) queryParams.append('role', params.role);
        if (params?.status) queryParams.append('status', params.status);
        if (params?.search) queryParams.append('search', params.search);
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
        return api.get(`/admin/users/?${queryParams.toString()}`);
    },
    getUserStats: () => api.get('/admin/users/stats'),
    enableUser: (userId: string) => api.put(`/admin/users/${userId}/enable`),
    disableUser: (userId: string) => api.put(`/admin/users/${userId}/disable`),
    updateUser: (userId: string, data: any) => api.put(`/admin/users/${userId}`, data),
    deleteUser: (userId: string) => api.delete(`/admin/users/${userId}`),

    // Mentor Management
    getMentors: (params?: { status?: string; page?: number; limit?: number }) => {
        const queryParams = new URLSearchParams();
        if (params?.status && params.status !== 'all') queryParams.append('status', params.status);
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        return api.get(`/admin/mentors?${queryParams.toString()}`);
    },
    getMentorDetails: (mentorId: string) => api.get(`/admin/mentors/${mentorId}`),
    getMentorStats: () => api.get('/admin/mentors/stats'),
    getPendingMentors: () => api.get('/admin/mentors/pending'),
    approveMentor: (mentorId: string) => api.post(`/admin/mentors/${mentorId}/approve`),
    updateMentorStatus: (mentorId: string, status: string) =>
        api.put(`/admin/mentors/${mentorId}/status`, { status }),
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
    getFeedbacks: (params?: { status?: string }) => {
        const queryParams = new URLSearchParams();
        if (params?.status && params.status !== 'all') queryParams.append('status', params.status);
        return api.get(`/admin/feedbacks?${queryParams.toString()}`);
    },
    moderateFeedback: (feedbackId: string, action: 'approve' | 'reject') =>
        api.put(`/admin/feedbacks/${feedbackId}`, { action }),

    // Learner Support
    getSupportTickets: (params?: { status?: string; priority?: string }) => {
        const queryParams = new URLSearchParams();
        if (params?.status && params.status !== 'all') queryParams.append('status', params.status);
        if (params?.priority && params.priority !== 'all') queryParams.append('priority', params.priority);
        return api.get(`/admin/support/tickets?${queryParams.toString()}`);
    },
    getSupportStats: () => api.get('/admin/support/stats'),
    getTicketDetails: (ticketId: string) => api.get(`/admin/support/tickets/${ticketId}`),
    updateTicketStatus: (ticketId: string, status: string) =>
        api.put(`/admin/support/tickets/${ticketId}/status`, { status }),
    replyToTicket: (ticketId: string, adminId: string, message: string) =>
        api.post(`/admin/support/tickets/${ticketId}/reply`, { admin_id: adminId, message }),

    // Policies
    getPolicies: () => api.get('/admin/policies'),
    createPolicy: (data: any) => api.post('/admin/policies', data),
    updatePolicy: (policyId: string, data: any) => api.put(`/admin/policies/${policyId}`, data),

    // Reports
    getStatistics: () => api.get('/admin/statistics'),
    getReports: () => api.get('/admin/reports'),
};
