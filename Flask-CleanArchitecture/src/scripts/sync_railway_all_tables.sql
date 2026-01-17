-- ========================================
-- AESP - COMPLETE DATABASE SCHEMA FOR RAILWAY
-- Run this ONCE on Railway MySQL to create ALL tables
-- ========================================
USE aesp_db;

-- =============================================
-- 1. USERS (Admin, Mentor, Learner)
-- =============================================
CREATE TABLE IF NOT EXISTS flask_user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'learner',
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    description TEXT,
    status BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    last_login DATETIME,
    -- Profile fields
    native_language VARCHAR(50) DEFAULT 'Vietnamese',
    timezone VARCHAR(50) DEFAULT 'Asia/Ho_Chi_Minh',
    learning_goals TEXT,
    correction_style VARCHAR(50) DEFAULT 'balanced',
    daily_goal_minutes INT DEFAULT 30,
    profile_visibility VARCHAR(20) DEFAULT 'public',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB;

-- =============================================
-- 2. PACKAGES (Service Plans)
-- =============================================
CREATE TABLE IF NOT EXISTS packages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price FLOAT NOT NULL,
    duration_days INT NOT NULL,
    has_mentor BOOLEAN DEFAULT FALSE,
    has_ai_advanced BOOLEAN DEFAULT FALSE,
    max_sessions_per_month INT DEFAULT 10,
    features TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB;

-- =============================================
-- 3. PURCHASES (Subscriptions)
-- =============================================
CREATE TABLE IF NOT EXISTS purchases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    package_id INT NOT NULL,
    amount FLOAT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100),
    start_date DATETIME,
    end_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES flask_user (id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES packages (id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- =============================================
-- 4. LEARNER_PROGRESS
-- =============================================
CREATE TABLE IF NOT EXISTS learner_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    overall_score FLOAT DEFAULT 0,
    vocabulary_score FLOAT DEFAULT 0,
    grammar_score FLOAT DEFAULT 0,
    pronunciation_score FLOAT DEFAULT 0,
    fluency_score FLOAT DEFAULT 0,
    total_practice_hours FLOAT DEFAULT 0,
    total_sessions INT DEFAULT 0,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    words_learned INT DEFAULT 0,
    current_level VARCHAR(20) DEFAULT 'beginner',
    xp_points INT DEFAULT 0,
    badges TEXT,
    weekly_stats TEXT,
    monthly_stats TEXT,
    last_streak_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES flask_user (id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- =============================================
-- 5. ASSESSMENTS
-- =============================================
CREATE TABLE IF NOT EXISTS assessments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    assessment_type VARCHAR(50) NOT NULL,
    listening_score FLOAT,
    speaking_score FLOAT,
    pronunciation_score FLOAT,
    vocabulary_score FLOAT,
    grammar_score FLOAT,
    overall_score FLOAT,
    determined_level VARCHAR(20),
    previous_level VARCHAR(20),
    questions_answered INT DEFAULT 0,
    correct_answers INT DEFAULT 0,
    time_taken_minutes INT DEFAULT 0,
    ai_feedback TEXT,
    recommended_topics TEXT,
    improvement_areas TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES flask_user (id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- =============================================
-- 6. PRACTICE_SESSIONS
-- =============================================
CREATE TABLE IF NOT EXISTS practice_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    mentor_id INT,
    session_type VARCHAR(50) NOT NULL,
    topic VARCHAR(100),
    scenario VARCHAR(200),
    duration_minutes INT DEFAULT 0,
    transcript TEXT,
    ai_feedback TEXT,
    pronunciation_score FLOAT,
    grammar_score FLOAT,
    vocabulary_score FLOAT,
    fluency_score FLOAT,
    overall_score FLOAT,
    pronunciation_errors TEXT,
    grammar_errors TEXT,
    vocabulary_suggestions TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    started_at DATETIME,
    ended_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES flask_user (id) ON DELETE CASCADE,
    FOREIGN KEY (mentor_id) REFERENCES flask_user (id) ON DELETE SET NULL
) ENGINE = InnoDB;

-- =============================================
-- 7. TOPICS
-- =============================================
CREATE TABLE IF NOT EXISTS topics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    difficulty_level VARCHAR(20),
    sample_questions TEXT,
    vocabulary_list TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;

-- =============================================
-- 8. COURSES & COURSE_REGISTER
-- =============================================
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    difficulty_level VARCHAR(20),
    status VARCHAR(50) NOT NULL,
    thumbnail_url VARCHAR(500),
    start_date DATETIME,
    end_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS course_register (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    progress_percent FLOAT DEFAULT 0,
    registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES flask_user (id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- =============================================
-- 9. FEEDBACK (From system)
-- =============================================
CREATE TABLE IF NOT EXISTS feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    mentor_id INT,
    session_id INT,
    feedback_type VARCHAR(50),
    content TEXT,
    rating INT,
    status VARCHAR(20) DEFAULT 'pending',
    admin_response TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES flask_user (id) ON DELETE CASCADE,
    FOREIGN KEY (mentor_id) REFERENCES flask_user (id) ON DELETE SET NULL,
    FOREIGN KEY (session_id) REFERENCES practice_sessions (id) ON DELETE SET NULL
) ENGINE = InnoDB;

-- =============================================
-- 10. POLICIES
-- =============================================
CREATE TABLE IF NOT EXISTS policies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    policy_type VARCHAR(50),
    version VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    effective_date DATETIME,
    created_by INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES flask_user (id) ON DELETE SET NULL
) ENGINE = InnoDB;

-- =============================================
-- 11. CHALLENGES & USER_CHALLENGES
-- =============================================
CREATE TABLE IF NOT EXISTS challenges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    challenge_type VARCHAR(50),
    xp_reward INT DEFAULT 0,
    badge_reward VARCHAR(100),
    requirement TEXT,
    start_date DATETIME,
    end_date DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS user_challenges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    challenge_id INT NOT NULL,
    progress_value INT DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES flask_user (id) ON DELETE CASCADE,
    FOREIGN KEY (challenge_id) REFERENCES challenges (id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- =============================================
-- 12. NOTIFICATIONS
-- =============================================
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT,
    notification_type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES flask_user (id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- =============================================
-- 13. MENTOR_ASSIGNMENTS (1-to-1 Mentor-Learner)
-- =============================================
CREATE TABLE IF NOT EXISTS mentor_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mentor_id INT NOT NULL,
    learner_id INT NOT NULL,
    assigned_by INT NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    notes TEXT,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    ended_at DATETIME,
    UNIQUE KEY unique_mentor (mentor_id),
    UNIQUE KEY unique_learner (learner_id),
    FOREIGN KEY (mentor_id) REFERENCES flask_user (id) ON DELETE CASCADE,
    FOREIGN KEY (learner_id) REFERENCES flask_user (id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES flask_user (id)
) ENGINE = InnoDB;

-- =============================================
-- 14. MENTOR_BOOKINGS (Session Booking)
-- =============================================
CREATE TABLE IF NOT EXISTS mentor_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    learner_id INT NOT NULL,
    mentor_id INT NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    duration_minutes INT DEFAULT 30,
    topic VARCHAR(255),
    notes TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    confirmed_at DATETIME,
    completed_at DATETIME,
    FOREIGN KEY (learner_id) REFERENCES flask_user (id) ON DELETE CASCADE,
    FOREIGN KEY (mentor_id) REFERENCES flask_user (id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- =============================================
-- 15. REVIEWS (Ratings)
-- =============================================
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reviewer_id INT NOT NULL,
    reviewed_id INT NOT NULL,
    learner_id INT,
    mentor_id INT,
    session_id INT,
    session_type VARCHAR(50),
    booking_id INT,
    rating INT NOT NULL,
    comment TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reviewer_id) REFERENCES flask_user (id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_id) REFERENCES flask_user (id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- =============================================
-- 16. MENTOR_FEEDBACKS (Mentor gives to Learner)
-- =============================================
CREATE TABLE IF NOT EXISTS mentor_feedbacks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mentor_id INT NOT NULL,
    learner_id INT NOT NULL,
    session_id INT,
    pronunciation_score INT,
    grammar_score INT,
    vocabulary_score INT,
    fluency_score INT,
    overall_score INT,
    strengths TEXT,
    improvements TEXT,
    recommendations TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (mentor_id) REFERENCES flask_user (id) ON DELETE CASCADE,
    FOREIGN KEY (learner_id) REFERENCES flask_user (id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- =============================================
-- 17. MESSAGES (Chat)
-- =============================================
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES flask_user (id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES flask_user (id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- =============================================
-- 18. RESOURCES (Mentor uploads)
-- =============================================
CREATE TABLE IF NOT EXISTS resources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mentor_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    resource_type VARCHAR(50),
    file_url VARCHAR(500),
    category VARCHAR(100),
    difficulty_level VARCHAR(20),
    is_public BOOLEAN DEFAULT FALSE,
    download_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (mentor_id) REFERENCES flask_user (id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- =============================================
-- 19. CONVERSATION_SCENARIOS
-- =============================================
CREATE TABLE IF NOT EXISTS conversation_scenarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    topic_id INT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    context TEXT,
    ai_role VARCHAR(100),
    user_role VARCHAR(100),
    difficulty_level VARCHAR(20),
    suggested_vocabulary TEXT,
    sample_dialog TEXT,
    tips TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES topics (id) ON DELETE SET NULL
) ENGINE = InnoDB;

-- =============================================
-- 20. PEER PRACTICE (Community)
-- =============================================
CREATE TABLE IF NOT EXISTS peer_invitations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    topic VARCHAR(200),
    status VARCHAR(50) DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    responded_at DATETIME,
    FOREIGN KEY (sender_id) REFERENCES flask_user (id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES flask_user (id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS peer_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    learner1_id INT NOT NULL,
    learner2_id INT NOT NULL,
    topic VARCHAR(200),
    duration_minutes INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ended_at DATETIME,
    FOREIGN KEY (learner1_id) REFERENCES flask_user (id) ON DELETE CASCADE,
    FOREIGN KEY (learner2_id) REFERENCES flask_user (id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS quick_matches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    level VARCHAR(50),
    topic VARCHAR(200),
    status VARCHAR(50) DEFAULT 'waiting',
    matched_user_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    matched_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES flask_user (id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- =============================================
-- 21. STUDY BUDDY
-- =============================================
CREATE TABLE IF NOT EXISTS study_buddy_matches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user1_id INT NOT NULL,
    user2_id INT NOT NULL,
    compatibility_score FLOAT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    accepted_at DATETIME,
    FOREIGN KEY (user1_id) REFERENCES flask_user (id) ON DELETE CASCADE,
    FOREIGN KEY (user2_id) REFERENCES flask_user (id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- =============================================
-- 22. NOTES
-- =============================================
CREATE TABLE IF NOT EXISTS notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES flask_user (id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- =============================================
-- 23. VIDEO_CALL_ROOMS (Optional persistence)
-- =============================================
CREATE TABLE IF NOT EXISTS video_call_rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    room_name VARCHAR(255) NOT NULL UNIQUE,
    mentor_id INT,
    learner_id INT,
    status VARCHAR(50) DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ended_at DATETIME,
    FOREIGN KEY (mentor_id) REFERENCES flask_user (id),
    FOREIGN KEY (learner_id) REFERENCES flask_user (id)
) ENGINE = InnoDB;

-- =============================================
-- 24. ADMIN_BROADCASTS
-- =============================================
CREATE TABLE IF NOT EXISTS admin_broadcasts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    target_role VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    recipients_count INT,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES flask_user (id)
) ENGINE = InnoDB;

-- =============================================
-- VERIFY ALL TABLES
-- =============================================
SELECT 'All tables created successfully!' AS Result;

SHOW TABLES;