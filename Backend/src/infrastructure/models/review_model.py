"""
Review Model for AESP Platform
Database model for learner ratings of mentors
"""
from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from infrastructure.databases.mssql import Base
from datetime import datetime


class ReviewModel(Base):
    """Unified model for all reviews and ratings (Mentor & Peer)"""
    __tablename__ = 'reviews'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Generic IDs for peer reviews
    reviewer_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False)
    reviewed_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False)
    
    # Mentor-specific fields (linked to same user IDs for backward compatibility)
    learner_id = Column(Integer, ForeignKey('flask_user.id'), nullable=True) 
    mentor_id = Column(Integer, ForeignKey('flask_user.id'), nullable=True)
    
    # Session Links
    session_id = Column(Integer, nullable=True) 
    session_type = Column(String(50))  # 'peer' or 'mentor'
    booking_id = Column(Integer, ForeignKey('mentor_bookings.id'), nullable=True)
    
    # Review Data
    rating = Column(Integer, nullable=False)
    comment = Column(Text)
    is_anonymous = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.now)
    
    # Relationships
    reviewer = relationship('UserModel', foreign_keys=[reviewer_id])
    reviewed = relationship('UserModel', foreign_keys=[reviewed_id])
    learner = relationship('UserModel', foreign_keys=[learner_id])
    mentor = relationship('UserModel', foreign_keys=[mentor_id])
    
    def to_dict(self):
        """Convert model to dictionary for API responses"""
        return {
            'id': self.id,
            'reviewer_id': self.reviewer_id,
            'reviewed_id': self.reviewed_id,
            'learner_id': self.learner_id,
            'mentor_id': self.mentor_id,
            'session_id': self.session_id,
            'session_type': self.session_type,
            'booking_id': self.booking_id,
            'rating': self.rating,
            'comment': self.comment,
            'is_anonymous': self.is_anonymous,
            'learner_name': self.learner.full_name if self.learner else (self.reviewer.full_name if self.reviewer else None),
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
