-- AESP Additional Tables for MySQL
-- Run this script in MySQL after connecting to aesp_db

USE aesp_db;

-- =============================================
-- 14. NOTIFICATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT,
    notification_type VARCHAR(50), -- system, reminder, achievement, feedback, session
    is_read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(500), -- Link khi click vào notification
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES flask_user (id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- =============================================
-- 15. MENTOR_ASSIGNMENTS TABLE
-- Phân công Mentor cho Learner
-- =============================================
CREATE TABLE IF NOT EXISTS mentor_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mentor_id INT NOT NULL,
    learner_id INT NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- active, paused, completed
    sessions_remaining INT DEFAULT 0,
    notes TEXT,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ended_at DATETIME,
    FOREIGN KEY (mentor_id) REFERENCES flask_user (id) ON DELETE CASCADE,
    FOREIGN KEY (learner_id) REFERENCES flask_user (id) ON DELETE CASCADE,
    UNIQUE KEY unique_assignment (mentor_id, learner_id)
) ENGINE = InnoDB;

-- =============================================
-- 16. RESOURCES TABLE
-- Tài liệu Mentor chia sẻ
-- =============================================
CREATE TABLE IF NOT EXISTS resources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mentor_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    resource_type VARCHAR(50), -- document, video, audio, link, exercise
    file_url VARCHAR(500),
    category VARCHAR(100), -- vocabulary, grammar, pronunciation, speaking
    difficulty_level VARCHAR(20), -- beginner, intermediate, advanced
    is_public BOOLEAN DEFAULT FALSE, -- Chia sẻ công khai hay chỉ cho learners của mình
    download_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (mentor_id) REFERENCES flask_user (id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- =============================================
-- 17. CONVERSATION_SCENARIOS TABLE
-- Kịch bản hội thoại AI chi tiết
-- =============================================
CREATE TABLE IF NOT EXISTS conversation_scenarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    topic_id INT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    context TEXT, -- Mô tả bối cảnh (ví dụ: "Bạn đang ở sân bay...")
    ai_role VARCHAR(100), -- Vai trò của AI (receptionist, interviewer, doctor)
    user_role VARCHAR(100), -- Vai trò của user
    difficulty_level VARCHAR(20),
    suggested_vocabulary TEXT, -- JSON list
    sample_dialog TEXT, -- JSON: conversation mẫu
    tips TEXT, -- Gợi ý cho user
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES topics (id) ON DELETE SET NULL
) ENGINE = InnoDB;

-- =============================================
-- INSERT SAMPLE DATA
-- =============================================

-- Sample Notifications
INSERT INTO
    notifications (
        user_id,
        title,
        message,
        notification_type
    )
VALUES (
        1,
        'Chào mừng đến AESP!',
        'Bắt đầu hành trình học tiếng Anh của bạn ngay hôm nay.',
        'system'
    ),
    (
        1,
        'Hoàn thành bài đánh giá',
        'Làm bài test để xác định trình độ của bạn.',
        'reminder'
    );

-- Sample Scenarios
INSERT INTO
    conversation_scenarios (
        topic_id,
        name,
        description,
        context,
        ai_role,
        user_role,
        difficulty_level
    )
VALUES (
        1,
        'Gặp gỡ đồng nghiệp mới',
        'Tự giới thiệu bản thân trong môi trường công sở',
        'Bạn vừa vào công ty mới và gặp đồng nghiệp lần đầu',
        'colleague',
        'new_employee',
        'beginner'
    ),
    (
        3,
        'Check-in tại sân bay',
        'Thực hành hội thoại khi làm thủ tục bay',
        'Bạn đang ở quầy check-in của hãng hàng không',
        'airline_staff',
        'passenger',
        'beginner'
    ),
    (
        2,
        'Thuyết trình dự án',
        'Trình bày ý tưởng trong cuộc họp',
        'Bạn đang thuyết trình trước ban lãnh đạo',
        'manager',
        'presenter',
        'intermediate'
    );

SELECT 'Additional tables created successfully!' AS Result;

SHOW TABLES;