"""
Challenge Models
Database models for challenges and gamification
"""
from sqlalchemy import Column, Integer, String, Boolean, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from infrastructure.databases.mssql import Base
from datetime import datetime


class ChallengeModel(Base):
    """Model for challenges"""
    __tablename__ = 'challenges'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    difficulty = Column(String(50), default='medium')  # easy, medium, hard
    status = Column(String(50), default='draft')  # draft, active, completed, cancelled
    target_value = Column(Integer, default=1)  # e.g., 7 days, 100 words
    xp_reward = Column(Integer, default=100)
    badge_name = Column(String(100))
    icon = Column(String(50))
    rules = Column(Text)  # JSON string of rules
    starts_at = Column(DateTime)
    ends_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, onupdate=datetime.now)
    is_active = Column(Boolean, default=True)


class UserChallengeModel(Base):
    """Model for user challenge participation"""
    __tablename__ = 'user_challenges'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False)
    challenge_id = Column(Integer, ForeignKey('challenges.id'), nullable=False)
    current_progress = Column(Integer, default=0)
    status = Column(String(50), default='active')  # active, completed, failed, withdrawn
    joined_at = Column(DateTime, default=datetime.now)
    completed_at = Column(DateTime)
    xp_earned = Column(Integer, default=0)
    
    user = relationship('UserModel')
    challenge = relationship('ChallengeModel')


class LeaderboardEntryModel(Base):
    """Model for leaderboard entries"""
    __tablename__ = 'leaderboard_entries'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False)
    period = Column(String(20))  # daily, weekly, monthly, all_time
    xp_points = Column(Integer, default=0)
    rank = Column(Integer)
    period_start = Column(DateTime)
    period_end = Column(DateTime)
    updated_at = Column(DateTime, default=datetime.now)
    
    user = relationship('UserModel')


class RewardModel(Base):
    """Model for available rewards"""
    __tablename__ = 'rewards'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    cost = Column(Integer, default=0)  # XP or points cost
    category = Column(String(50))  # customization, learning, badge, boost
    icon = Column(String(50))
    is_active = Column(Boolean, default=True)
    stock = Column(Integer, default=-1)  # -1 = unlimited
    created_at = Column(DateTime, default=datetime.now)


class UserRewardModel(Base):
    """Model for user's claimed rewards"""
    __tablename__ = 'user_rewards'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False)
    reward_id = Column(Integer, ForeignKey('rewards.id'), nullable=False)
    claimed_at = Column(DateTime, default=datetime.now)
    expires_at = Column(DateTime)  # For time-limited rewards like boosts
    is_active = Column(Boolean, default=True)
    
    user = relationship('UserModel')
    reward = relationship('RewardModel')
