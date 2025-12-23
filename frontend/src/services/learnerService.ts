import api from './api';

export const learnerService = {
    // Profile
    getProfile: () => api.get('/learner/profile'),
    updateProfile: (data: any) => api.put('/learner/profile', data),

    // Proficiency Test
    getProficiencyTest: () => api.get('/learner/proficiency-test'),
    submitProficiencyTest: (answers: any) => api.post('/learner/proficiency-test', answers),

    // Learning Path
    getLearningPath: () => api.get('/learner/learning-path'),

    // Practice
    getTopics: () => api.get('/learner/topics'),
    startPracticeSession: (topicId: string) => api.post('/learner/practice/start', { topicId }),
    endPracticeSession: (sessionId: string, data: any) => api.post(`/learner/practice/${sessionId}/end`, data),

    // Progress
    getProgress: () => api.get('/learner/progress'),
    getWeeklyReport: () => api.get('/learner/reports/weekly'),
    getMonthlyReport: () => api.get('/learner/reports/monthly'),

    // Challenges
    getChallenges: () => api.get('/learner/challenges'),
    getLeaderboard: () => api.get('/learner/leaderboard'),

    // Packages
    getPackages: () => api.get('/packages'),
    purchasePackage: (packageId: string) => api.post('/learner/packages/purchase', { packageId }),
};
