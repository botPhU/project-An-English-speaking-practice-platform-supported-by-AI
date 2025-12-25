// Admin Routes
export const ADMIN_ROUTES = {
    DASHBOARD: '/admin',
    USER_MANAGEMENT: '/admin/users',
    MENTOR_MANAGEMENT: '/admin/mentors',
    LEARNER_MANAGEMENT: '/admin/learners',
    PACKAGE_MANAGEMENT: '/admin/packages',
    FEEDBACK_MODERATION: '/admin/feedbacks',
    LEARNER_SUPPORT: '/admin/support',
    POLICY_MANAGEMENT: '/admin/policies',
    REPORTS: '/admin/reports',
    PROFILE: '/admin/profile',
    SETTINGS: '/admin/settings',
};

// Learner Routes
export const LEARNER_ROUTES = {
    DASHBOARD: '/learner',
    PROFILE: '/learner/profile',
    PROFICIENCY_TEST: '/learner/proficiency-test',
    LEARNING_PATH: '/learner/learning-path',
    SPEAKING_PRACTICE: '/learner/practice',
    TOPIC_SELECTION: '/learner/topics',
    PROGRESS: '/learner/progress',
    CHALLENGES: '/learner/challenges',
    PACKAGES: '/learner/packages',
};

// Mentor Routes
export const MENTOR_ROUTES = {
    DASHBOARD: '/mentor',
    LEARNER_ASSESSMENT: '/mentor/assessment',
    RESOURCES: '/mentor/resources',
    FEEDBACK_SESSION: '/mentor/feedback',
    CONVERSATION_TOPICS: '/mentor/topics',
    EXPERIENCE_SHARING: '/mentor/experience',
};

// Auth Routes
export const AUTH_ROUTES = {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
};
