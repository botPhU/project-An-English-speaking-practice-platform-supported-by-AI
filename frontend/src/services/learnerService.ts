import api from './api';

export interface LearnerProgress {
    overall_score: number;
    vocabulary_score: number;
    grammar_score: number;
    pronunciation_score: number;
    fluency_score: number;
    current_level: string;
    current_streak: number;
    xp_points: number;
    total_sessions: number;
}

export interface LearnerProfile {
    id: number;
    full_name: string;
    username: string;
    email: string;
    avatar: string;
    current_level: string;
    current_streak: number;
    xp_points: number;
    target_level: string;
    progress_to_target: number;
    native_language: string;
    timezone: string;
    member_since: string;
    learning_goals: string[];
    correction_style: 'gentle' | 'strict';
    daily_goal_minutes: number;
    voice_calibration_date: string | null;
    profile_visibility: 'public' | 'mentors_only' | 'private';
    show_progress: boolean;
}

export interface PracticeSession {
    id: number;
    session_type: string;
    topic: string;
    overall_score: number;
    pronunciation_score?: number;
    grammar_score?: number;
    vocabulary_score?: number;
    fluency_score?: number;
    ai_feedback?: string;
    pronunciation_errors?: string;
    grammar_errors?: string;
    vocabulary_suggestions?: string;
    is_completed: boolean;
    created_at: string;
}

export interface Assessment {
    id: number;
    type: string;
    overall_score: number;
    level: string;
    is_completed: boolean;
    completed_at: string;
}

export const learnerService = {
    // Dashboard
    getDashboard: (userId: number) =>
        api.get(`/learner/dashboard/${userId}`),

    // Profile - NEW CRUD Methods
    getProfile: (userId: number) =>
        api.get<LearnerProfile>(`/learner/profile/${userId}`),

    updateProfile: (userId: number, data: Partial<LearnerProfile>) =>
        api.put(`/learner/profile/${userId}`, data),

    updateLearningGoals: (userId: number, data: { goals?: string[]; correction_style?: string; daily_goal_minutes?: number }) =>
        api.put(`/learner/profile/${userId}/learning-goals`, data),

    updateVoiceCalibration: (userId: number, data: { voice_sample_url?: string }) =>
        api.post(`/learner/profile/${userId}/voice-calibration`, data),

    updatePrivacySettings: (userId: number, data: { profile_visibility?: string; show_progress?: boolean }) =>
        api.put(`/learner/settings/${userId}/privacy`, data),

    // Progress
    getProgress: (userId: number) =>
        api.get<LearnerProgress>(`/learner/progress/${userId}`),

    updateProgress: (userId: number, data: Partial<LearnerProgress>) =>
        api.put(`/learner/progress/${userId}`, data),

    // Practice Sessions
    getSessions: (userId: number, limit = 10) =>
        api.get<PracticeSession[]>(`/learner/sessions/${userId}?limit=${limit}`),

    startSession: (userId: number, data: { topic?: string; session_type?: string }) =>
        api.post('/learner/sessions', { user_id: userId, ...data }),

    completeSession: (sessionId: number, scores: object) =>
        api.post(`/learner/sessions/${sessionId}/complete`, scores),

    // Assessments
    getAssessments: (userId: number) =>
        api.get<Assessment[]>(`/learner/assessments/${userId}`),

    startAssessment: (userId: number, type = 'initial') =>
        api.post('/learner/assessments', { user_id: userId, type }),

    completeAssessment: (assessmentId: number, results: object) =>
        api.post(`/learner/assessments/${assessmentId}/complete`, results),

    // Topics
    getTopics: (category?: string, difficulty?: string) =>
        api.get('/learner/topics', { params: { category, difficulty } }),

    getDailyChallenge: () =>
        api.get('/learner/topics/daily-challenge'),

    startTopicSession: (userId: number, topicId: number) =>
        api.post(`/learner/topics/${topicId}/start`, { user_id: userId }),

    // Achievements
    getAchievements: (userId: number) =>
        api.get(`/learner/achievements/${userId}`),

    // Mentors
    getMentors: (specialty?: string) =>
        api.get('/learner/mentors', { params: { specialty } }),

    bookMentor: (userId: number, mentorId: number, dateTime: string) =>
        api.post(`/learner/mentors/${mentorId}/book`, { user_id: userId, date_time: dateTime }),

    getMentorSessions: (userId: number) =>
        api.get(`/learner/mentor-sessions/${userId}`),

    // Settings
    getSettings: (userId: number) =>
        api.get(`/learner/settings/${userId}`),

    updateSettings: (userId: number, data: object) =>
        api.put(`/learner/settings/${userId}`, data),

    // Reports
    getWeeklyReport: (userId: number) =>
        api.get(`/reports/learner/${userId}/weekly`),

    getProgressReport: (userId: number) =>
        api.get(`/reports/learner/${userId}/progress`),

    // Notifications
    getNotifications: (userId: number, limit = 20) =>
        api.get(`/notifications/user/${userId}?limit=${limit}`),

    markNotificationRead: (notificationId: number) =>
        api.put(`/notifications/${notificationId}/read`),

    // Packages & Subscriptions
    getPackages: () =>
        api.get('/purchase/packages'),

    getSubscriptionStatus: (userId: number) =>
        api.get(`/purchase/subscription/${userId}`),

    purchasePackage: (userId: number, packageId: number, paymentMethod?: string) =>
        api.post('/purchase/buy', { user_id: userId, package_id: packageId, payment_method: paymentMethod }),
};

