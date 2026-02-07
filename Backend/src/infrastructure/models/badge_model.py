"""
Badge Models for AESP Platform
Database models for badges and achievements system
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from infrastructure.databases.mssql import Base


class BadgeModel(Base):
    """Badge definition model"""
    __tablename__ = 'badges'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    icon = Column(String(255))  # URL or emoji
    category = Column(String(50))  # streak, practice, level, social, special
    
    # Requirements
    requirement_type = Column(String(50))  # streak_days, practice_sessions, total_score, level_reached
    requirement_value = Column(Integer, default=0)
    
    # Rarity
    rarity = Column(String(20), default='common')  # common, rare, epic, legendary
    points = Column(Integer, default=10)  # Points awarded when earned
    
    # Status
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user_badges = relationship('UserBadgeModel', back_populates='badge')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'icon': self.icon,
            'category': self.category,
            'requirement_type': self.requirement_type,
            'requirement_value': self.requirement_value,
            'rarity': self.rarity,
            'points': self.points,
            'is_active': self.is_active
        }


class UserBadgeModel(Base):
    """User earned badges model"""
    __tablename__ = 'user_badges'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False)
    badge_id = Column(Integer, ForeignKey('badges.id'), nullable=False)
    earned_at = Column(DateTime, default=datetime.utcnow)
    notified = Column(Boolean, default=False)  # Whether user has been notified
    
    # Relationships
    badge = relationship('BadgeModel', back_populates='user_badges')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'badge_id': self.badge_id,
            'earned_at': self.earned_at.isoformat() if self.earned_at else None,
            'badge': self.badge.to_dict() if self.badge else None
        }


# Default badges to seed
DEFAULT_BADGES = [
    # Streak badges
    {
        'name': 'First Step',
        'description': 'Hoàn thành ngày học đầu tiên',
        'icon': '👣',
        'category': 'streak',
        'requirement_type': 'streak_days',
        'requirement_value': 1,
        'rarity': 'common',
        'points': 10
    },
    {
        'name': 'Week Warrior',
        'description': 'Duy trì streak 7 ngày liên tiếp',
        'icon': '🔥',
        'category': 'streak',
        'requirement_type': 'streak_days',
        'requirement_value': 7,
        'rarity': 'common',
        'points': 50
    },
    {
        'name': 'Month Master',
        'description': 'Duy trì streak 30 ngày liên tiếp',
        'icon': '🏆',
        'category': 'streak',
        'requirement_type': 'streak_days',
        'requirement_value': 30,
        'rarity': 'rare',
        'points': 200
    },
    {
        'name': 'Century Champion',
        'description': 'Duy trì streak 100 ngày liên tiếp',
        'icon': '💎',
        'category': 'streak',
        'requirement_type': 'streak_days',
        'requirement_value': 100,
        'rarity': 'legendary',
        'points': 1000
    },
    # Practice badges
    {
        'name': 'First Conversation',
        'description': 'Hoàn thành buổi luyện nói đầu tiên',
        'icon': '💬',
        'category': 'practice',
        'requirement_type': 'practice_sessions',
        'requirement_value': 1,
        'rarity': 'common',
        'points': 10
    },
    {
        'name': 'Practice Pro',
        'description': 'Hoàn thành 10 buổi luyện nói',
        'icon': '🎯',
        'category': 'practice',
        'requirement_type': 'practice_sessions',
        'requirement_value': 10,
        'rarity': 'common',
        'points': 50
    },
    {
        'name': 'Speaking Master',
        'description': 'Hoàn thành 50 buổi luyện nói',
        'icon': '🎤',
        'category': 'practice',
        'requirement_type': 'practice_sessions',
        'requirement_value': 50,
        'rarity': 'rare',
        'points': 200
    },
    {
        'name': 'Fluent Speaker',
        'description': 'Hoàn thành 100 buổi luyện nói',
        'icon': '🗣️',
        'category': 'practice',
        'requirement_type': 'practice_sessions',
        'requirement_value': 100,
        'rarity': 'epic',
        'points': 500
    },
    # Score badges
    {
        'name': 'Rising Star',
        'description': 'Đạt 100 điểm tổng',
        'icon': '⭐',
        'category': 'score',
        'requirement_type': 'total_score',
        'requirement_value': 100,
        'rarity': 'common',
        'points': 20
    },
    {
        'name': 'Score Hunter',
        'description': 'Đạt 500 điểm tổng',
        'icon': '🌟',
        'category': 'score',
        'requirement_type': 'total_score',
        'requirement_value': 500,
        'rarity': 'common',
        'points': 50
    },
    {
        'name': 'Point Master',
        'description': 'Đạt 1000 điểm tổng',
        'icon': '✨',
        'category': 'score',
        'requirement_type': 'total_score',
        'requirement_value': 1000,
        'rarity': 'rare',
        'points': 100
    },
    {
        'name': 'Score Legend',
        'description': 'Đạt 5000 điểm tổng',
        'icon': '🏅',
        'category': 'score',
        'requirement_type': 'total_score',
        'requirement_value': 5000,
        'rarity': 'epic',
        'points': 300
    },
    # Level badges
    {
        'name': 'Beginner',
        'description': 'Đạt trình độ A1',
        'icon': '🌱',
        'category': 'level',
        'requirement_type': 'level_reached',
        'requirement_value': 1,  # A1
        'rarity': 'common',
        'points': 30
    },
    {
        'name': 'Elementary',
        'description': 'Đạt trình độ A2',
        'icon': '🌿',
        'category': 'level',
        'requirement_type': 'level_reached',
        'requirement_value': 2,  # A2
        'rarity': 'common',
        'points': 50
    },
    {
        'name': 'Intermediate',
        'description': 'Đạt trình độ B1',
        'icon': '🌳',
        'category': 'level',
        'requirement_type': 'level_reached',
        'requirement_value': 3,  # B1
        'rarity': 'rare',
        'points': 100
    },
    {
        'name': 'Upper Intermediate',
        'description': 'Đạt trình độ B2',
        'icon': '🌲',
        'category': 'level',
        'requirement_type': 'level_reached',
        'requirement_value': 4,  # B2
        'rarity': 'epic',
        'points': 200
    },
    {
        'name': 'Advanced',
        'description': 'Đạt trình độ C1',
        'icon': '🏔️',
        'category': 'level',
        'requirement_type': 'level_reached',
        'requirement_value': 5,  # C1
        'rarity': 'legendary',
        'points': 500
    },
    # Special badges
    {
        'name': 'Early Bird',
        'description': 'Luyện tập trước 7 giờ sáng',
        'icon': '🌅',
        'category': 'special',
        'requirement_type': 'special',
        'requirement_value': 0,
        'rarity': 'rare',
        'points': 50
    },
    {
        'name': 'Night Owl',
        'description': 'Luyện tập sau 10 giờ tối',
        'icon': '🦉',
        'category': 'special',
        'requirement_type': 'special',
        'requirement_value': 0,
        'rarity': 'rare',
        'points': 50
    },
    {
        'name': 'Perfect Score',
        'description': 'Đạt điểm tuyệt đối trong một buổi luyện',
        'icon': '💯',
        'category': 'special',
        'requirement_type': 'special',
        'requirement_value': 0,
        'rarity': 'epic',
        'points': 100
    }
]
