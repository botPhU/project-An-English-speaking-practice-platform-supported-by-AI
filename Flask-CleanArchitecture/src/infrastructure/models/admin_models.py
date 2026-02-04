"""
Admin Models
Database models for admin dashboard and system management
"""
from sqlalchemy import Column, Integer, String, Boolean, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from infrastructure.databases.mssql import Base
from datetime import datetime


class SupportTicketModel(Base):
    """Model for support tickets"""
    __tablename__ = 'support_tickets'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False)
    subject = Column(String(500), nullable=False)
    description = Column(Text)
    category = Column(String(100))  # payment, booking, subscription, account, other
    status = Column(String(50), default='open')  # open, in_progress, resolved, closed
    priority = Column(String(50), default='medium')  # low, medium, high, urgent
    assigned_to = Column(Integer, ForeignKey('flask_user.id'))
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, onupdate=datetime.now)
    resolved_at = Column(DateTime)
    
    user = relationship('UserModel', foreign_keys=[user_id])
    assignee = relationship('UserModel', foreign_keys=[assigned_to])


class TicketMessageModel(Base):
    """Model for ticket messages"""
    __tablename__ = 'ticket_messages'

    id = Column(Integer, primary_key=True, autoincrement=True)
    ticket_id = Column(Integer, ForeignKey('support_tickets.id'), nullable=False)
    sender_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False)
    sender_type = Column(String(50))  # user, admin, system
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    
    ticket = relationship('SupportTicketModel')
    sender = relationship('UserModel')


class ActivityLogModel(Base):
    """Model for system activity logs"""
    __tablename__ = 'activity_logs'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('flask_user.id'))
    action_type = Column(String(100), nullable=False)  # user_registration, package_purchase, etc.
    description = Column(Text)
    entity_type = Column(String(100))  # user, order, mentor, etc.
    entity_id = Column(Integer)
    ip_address = Column(String(50))
    user_agent = Column(String(500))
    created_at = Column(DateTime, default=datetime.now)
    
    user = relationship('UserModel')


class SystemSettingModel(Base):
    """Model for system settings"""
    __tablename__ = 'system_settings'

    id = Column(Integer, primary_key=True, autoincrement=True)
    key = Column(String(255), unique=True, nullable=False)
    value = Column(Text)
    category = Column(String(100))  # general, payment, notification, security
    description = Column(Text)
    updated_by = Column(Integer, ForeignKey('flask_user.id'))
    updated_at = Column(DateTime, default=datetime.now)
    
    updater = relationship('UserModel')


class MentorApplicationModel(Base):
    """Model for mentor applications"""
    __tablename__ = 'mentor_applications'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False)
    specialty = Column(String(255))
    experience_years = Column(Integer)
    bio = Column(Text)
    certifications = Column(Text)  # JSON array
    cv_url = Column(String(500))
    status = Column(String(50), default='pending')  # pending, approved, rejected
    reviewed_by = Column(Integer, ForeignKey('flask_user.id'))
    reviewed_at = Column(DateTime)
    reject_reason = Column(Text)
    created_at = Column(DateTime, default=datetime.now)
    
    user = relationship('UserModel', foreign_keys=[user_id])
    reviewer = relationship('UserModel', foreign_keys=[reviewed_by])
