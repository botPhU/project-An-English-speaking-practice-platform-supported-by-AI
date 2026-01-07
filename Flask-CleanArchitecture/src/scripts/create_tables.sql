-- AESP Database Schema for MySQL
-- Run this script in MySQL Workbench to create all tables

-- Create Database
CREATE DATABASE IF NOT EXISTS aesp_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE aesp_db;

-- =============================================
-- 1. USERS TABLE (Admin, Mentor, Learner)
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB;

-- =============================================
-- 2. PACKAGES TABLE (Service Plans)
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
-- 3. PURCHASES TABLE (Subscriptions)
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
-- 4. LEARNER_PROGRESS TABLE
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES flask_user (id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- =============================================
-- 5. ASSESSMENTS TABLE
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
-- 6. PRACTICE_SESSIONS TABLE
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
-- 7. COURSES TABLE
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

-- =============================================
-- 8. COURSE_REGISTER TABLE
-- =============================================
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
-- 9. TOPICS TABLE
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
-- 10. FEEDBACK TABLE
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
-- 11. POLICIES TABLE
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
-- 12. CHALLENGES TABLE
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

-- =============================================
-- 13. USER_CHALLENGES TABLE
-- =============================================
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
-- INSERT SAMPLE DATA
-- =============================================

-- Sample Admin User
INSERT INTO
    flask_user (
        user_name,
        email,
        password,
        full_name,
        role,
        status
    )
VALUES (
        'admin',
        'admin@aesp.com',
        'admin123',
        'Administrator',
        'admin',
        TRUE
    );

-- Sample Packages
INSERT INTO
    packages (
        name,
        description,
        price,
        duration_days,
        has_mentor,
        has_ai_advanced,
        max_sessions_per_month,
        features
    )
VALUES (
        'Basic',
        'Gói cơ bản cho người mới bắt đầu',
        99000,
        30,
        FALSE,
        FALSE,
        5,
        '["AI Practice (5 sessions)", "Progress Tracking", "Community Access"]'
    ),
    (
        'Premium',
        'Gói phổ biến với mentor hỗ trợ',
        299000,
        30,
        TRUE,
        FALSE,
        15,
        '["AI Practice (Unlimited)", "2 Mentor Sessions", "All Topics", "Pronunciation Analysis"]'
    ),
    (
        'Pro',
        'Gói chuyên nghiệp với đầy đủ tính năng',
        499000,
        30,
        TRUE,
        TRUE,
        999,
        '["Everything in Premium", "5 Mentor Sessions", "Advanced AI", "Custom Path", "Weekly Reports"]'
    );

-- Sample Topics
INSERT INTO
    topics (
        name,
        category,
        description,
        difficulty_level
    )
VALUES (
        'Greeting & Introduction',
        'daily_life',
        'Learn how to introduce yourself',
        'beginner'
    ),
    (
        'Business Meeting',
        'business',
        'Professional meeting conversations',
        'intermediate'
    ),
    (
        'Airport & Travel',
        'travel',
        'Essential travel vocabulary',
        'beginner'
    ),
    (
        'Healthcare Consultation',
        'healthcare',
        'Medical conversations',
        'advanced'
    ),
    (
        'Job Interview',
        'business',
        'Prepare for job interviews',
        'intermediate'
    );

-- Sample Challenges
INSERT INTO
    challenges (
        name,
        description,
        challenge_type,
        xp_reward,
        requirement
    )
VALUES (
        'First Steps',
        'Complete your first practice session',
        'special',
        100,
        '{"sessions": 1}'
    ),
    (
        'Daily Streak',
        'Practice 7 days in a row',
        'weekly',
        500,
        '{"streak": 7}'
    ),
    (
        'High Scorer',
        'Get 90%+ in any session',
        'special',
        200,
        '{"score": 90}'
    );

SELECT 'All tables created successfully!' AS Result;