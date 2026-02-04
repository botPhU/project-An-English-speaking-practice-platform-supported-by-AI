from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from infrastructure.databases.base import Base


class TopicModel(Base):
    """
    Topic/Scenario cho AI roleplay practice
    """
    __tablename__ = 'topics'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(50), default='daily')  # work, travel, daily, social, academic
    difficulty = Column(String(20), default='beginner')  # beginner, intermediate, advanced
    icon = Column(String(50), nullable=True)
    color = Column(String(30), default='blue')
    duration = Column(String(20), default='10m')
    xp_reward = Column(Integer, default=100)
    is_active = Column(Boolean, default=True)
    is_daily_challenge = Column(Boolean, default=False)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)


class AchievementModel(Base):
    """
    Định nghĩa các loại Achievement/Badge
    """
    __tablename__ = 'achievements'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(String(255), nullable=True)
    icon = Column(String(50), nullable=True)
    requirement = Column(String(255), nullable=True)  # Điều kiện đạt được
    xp_reward = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime)


class UserAchievementModel(Base):
    """
    Achievements đã đạt được của user
    """
    __tablename__ = 'user_achievements'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=False)
    achievement_id = Column(Integer, nullable=False)
    earned_at = Column(DateTime)


class MentorBookingModel(Base):
    """
    Booking session với Mentor
    """
    __tablename__ = 'mentor_bookings'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True)
    learner_id = Column(Integer, nullable=False)
    mentor_id = Column(Integer, nullable=False)
    scheduled_at = Column(DateTime, nullable=False)
    topic = Column(String(200), nullable=True)
    status = Column(String(20), default='pending')  # pending, confirmed, completed, cancelled
    rating = Column(Integer, nullable=True)  # 1-5
    feedback = Column(Text, nullable=True)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
