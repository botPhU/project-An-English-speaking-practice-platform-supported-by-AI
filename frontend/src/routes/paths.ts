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
    MENTOR_APPLICATIONS: '/admin/mentor-applications',  // Approve mentor applications
};

// Learner Routes - Aligned with Use Case Diagram
export const LEARNER_ROUTES = {
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
    SPEAKING_PRACTICE: '/practice',
    AI_PRACTICE: '/practice/ai',  // AI-powered speaking practice
    CHALLENGES: '/challenges',  // Speaking Challenges
    COMMUNITY: '/community',    // Practice with Others, Reviews, Mentors
    PROGRESS: '/progress',      // Performance Reports, Tracking, AI Feedback, Scoring
    PACKAGES: '/packages',
    PLACEMENT_TEST: '/placement-test',  // Level assessment test
    SPEAKING_DRILLS: '/speaking-drills',  // AI Speaking practice
};

// Mentor Routes
export const MENTOR_ROUTES = {
    DASHBOARD: '/mentor',
    LEARNER_ASSESSMENT: '/mentor/assessment',
    SPEAKING_SESSIONS: '/mentor/speaking-sessions',  // View learner AI speaking sessions
    RESOURCES: '/mentor/resources',
    FEEDBACK_SESSION: '/mentor/feedback',
    CONVERSATION_TOPICS: '/mentor/topics',
    EXPERIENCE_SHARING: '/mentor/experience',
    REAL_LIFE_SITUATIONS: '/mentor/real-life-situations',
    COLLOCATIONS_IDIOMS: '/mentor/collocations-idioms',
    BUILD_CONFIDENCE: '/mentor/build-confidence',
    WORD_USAGE: '/mentor/word-usage',
    PRONUNCIATION_ERRORS: '/mentor/pronunciation',
    GRAMMAR_ERRORS: '/mentor/grammar',
    CLEAR_EXPRESSION: '/mentor/clear-expression',
    PROFILE: '/mentor/profile',
};

// Auth Routes
export const AUTH_ROUTES = {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    COMPLETE_PROFILE: '/complete-profile',
    MENTOR_APPLICATION: '/apply-mentor',  // Mentor application form
};
