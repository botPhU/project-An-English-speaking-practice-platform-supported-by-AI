"""
Subscription Models
Database models for subscription management
"""
from sqlalchemy import Column, Integer, String, Boolean, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from infrastructure.databases.mssql import Base
from datetime import datetime


class SubscriptionPlanModel(Base):
    """Model for subscription plans"""
    __tablename__ = 'subscription_plans'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    price = Column(Float, default=0)
    currency = Column(String(10), default='VND')
    period = Column(String(20), default='month')  # month, year
    original_price = Column(Float)  # For discount display
    discount_percent = Column(Integer)
    features = Column(Text)  # JSON string of features
    limitations = Column(Text)  # JSON string of limitations
    mentor_sessions = Column(Integer, default=0)
    is_popular = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, onupdate=datetime.now)


class UserSubscriptionModel(Base):
    """Model for user subscriptions"""
    __tablename__ = 'user_subscriptions'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False)
    plan_id = Column(Integer, ForeignKey('subscription_plans.id'), nullable=False)
    status = Column(String(50), default='active')  # active, cancelled, expired, paused
    started_at = Column(DateTime, default=datetime.now)
    expires_at = Column(DateTime)
    cancelled_at = Column(DateTime)
    cancel_reason = Column(Text)
    auto_renew = Column(Boolean, default=True)
    payment_method = Column(String(50))  # credit_card, bank_transfer, momo, etc.
    mentor_sessions_remaining = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, onupdate=datetime.now)
    
    user = relationship('UserModel')
    plan = relationship('SubscriptionPlanModel')


class PaymentHistoryModel(Base):
    """Model for payment history"""
    __tablename__ = 'payment_history'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False)
    subscription_id = Column(Integer, ForeignKey('user_subscriptions.id'))
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default='VND')
    payment_method = Column(String(50))
    transaction_id = Column(String(255))
    status = Column(String(50), default='pending')  # pending, completed, failed, refunded
    description = Column(Text)
    paid_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.now)
    
    user = relationship('UserModel')
    subscription = relationship('UserSubscriptionModel')
