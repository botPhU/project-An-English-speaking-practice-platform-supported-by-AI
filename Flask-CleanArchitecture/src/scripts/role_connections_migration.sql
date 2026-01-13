-- ========================================
-- AESP Role Connection Features - MySQL Migration
-- ========================================
-- Run this on Railway MySQL (database: railway)
-- Or on local MySQL (database: aesp_db)

-- Uncomment ONE of these based on your target:
-- USE railway;    -- For Railway
-- USE aesp_db;    -- For Local

-- ========================================
-- 1. Mentor Assignments (1-to-1 relationship)
-- ========================================
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
);

-- ========================================
-- 2. Mentor Feedbacks
-- ========================================
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
);

-- ========================================
-- 3. Video Call Rooms
-- ========================================
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
);

-- ========================================
-- 4. Admin Broadcasts
-- ========================================
CREATE TABLE IF NOT EXISTS admin_broadcasts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    target_role VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    recipients_count INT,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES flask_user (id)
);

-- ========================================
-- Verify tables created
-- ========================================
SELECT 'Migration completed!' AS Status;