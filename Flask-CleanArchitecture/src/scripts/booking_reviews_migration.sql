-- AESP Booking and Reviews Migration for MySQL
-- Run this script to add mentor_bookings and reviews tables

USE aesp_db;

-- =============================================
-- MENTOR_BOOKINGS TABLE
-- For booking sessions with mentors
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
    status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, completed, cancelled, rejected
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    confirmed_at DATETIME,
    completed_at DATETIME,
    FOREIGN KEY (learner_id) REFERENCES flask_user (id) ON DELETE CASCADE,
    FOREIGN KEY (mentor_id) REFERENCES flask_user (id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- =============================================
-- REVIEWS TABLE
-- Learners rate mentors after sessions
-- =============================================
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    learner_id INT NOT NULL,
    mentor_id INT NOT NULL,
    session_id INT,
    booking_id INT,
    rating INT NOT NULL, -- 1 to 5 stars
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (learner_id) REFERENCES flask_user (id) ON DELETE CASCADE,
    FOREIGN KEY (mentor_id) REFERENCES flask_user (id) ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES practice_sessions (id) ON DELETE SET NULL,
    FOREIGN KEY (booking_id) REFERENCES mentor_bookings (id) ON DELETE SET NULL
) ENGINE = InnoDB;

-- =============================================
-- Add indexes for better query performance
-- =============================================
CREATE INDEX idx_bookings_mentor ON mentor_bookings (mentor_id);

CREATE INDEX idx_bookings_learner ON mentor_bookings (learner_id);

CREATE INDEX idx_bookings_status ON mentor_bookings (status);

CREATE INDEX idx_bookings_date ON mentor_bookings (scheduled_date);

CREATE INDEX idx_reviews_mentor ON reviews (mentor_id);

CREATE INDEX idx_reviews_learner ON reviews (learner_id);

SELECT 'Booking and Reviews tables created successfully!' AS Result;

SHOW TABLES;