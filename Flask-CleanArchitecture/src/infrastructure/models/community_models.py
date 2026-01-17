"""
Community Models
Database models for community features: peer sessions, invitations, reviews
"""
from sqlalchemy import Column, Integer, String, Boolean, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from infrastructure.databases.mssql import Base
from datetime import datetime


class PeerInvitationModel(Base):
    """Model for practice invitations between learners"""
    __tablename__ = 'peer_invitations'

    id = Column(Integer, primary_key=True, autoincrement=True)
    sender_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False)
    receiver_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False)
    topic = Column(String(255))
    message = Column(Text)
    status = Column(String(50), default='pending')  # pending, accepted, declined, expired
    created_at = Column(DateTime, default=datetime.now)
    responded_at = Column(DateTime)
    
    sender = relationship('UserModel', foreign_keys=[sender_id])
    receiver = relationship('UserModel', foreign_keys=[receiver_id])


class PeerSessionModel(Base):
    """Model for peer practice sessions"""
    __tablename__ = 'peer_sessions'

    id = Column(Integer, primary_key=True, autoincrement=True)
    participant1_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False)
    participant2_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False)
    topic = Column(String(255))
    status = Column(String(50), default='scheduled')  # scheduled, in_progress, completed, cancelled
    scheduled_at = Column(DateTime)
    started_at = Column(DateTime)
    ended_at = Column(DateTime)
    duration_minutes = Column(Integer, default=0)
    xp_earned = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.now)
    
    participant1 = relationship('UserModel', foreign_keys=[participant1_id])
    participant2 = relationship('UserModel', foreign_keys=[participant2_id])


# ReviewModel is now imported from .review_model


class QuickMatchModel(Base):
    """Model for quick match requests"""
    __tablename__ = 'quick_matches'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False)
    requested_level = Column(String(20))
    requested_topic = Column(String(255))
    status = Column(String(50), default='searching')  # searching, matched, expired, cancelled
    matched_user_id = Column(Integer, ForeignKey('flask_user.id'))
    session_id = Column(Integer)
    created_at = Column(DateTime, default=datetime.now)
    matched_at = Column(DateTime)
    
    user = relationship('UserModel', foreign_keys=[user_id])
    matched_user = relationship('UserModel', foreign_keys=[matched_user_id])
