"""
Review Model for AESP Platform
Database model for learner ratings of mentors
"""
from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from infrastructure.databases.mssql import Base
from datetime import datetime


class ReviewModel(Base):
    """Model for learner reviews/ratings of mentors"""
    __tablename__ = 'reviews'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, autoincrement=True)
    learner_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False)
    mentor_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False)
    session_id = Column(Integer, ForeignKey('practice_sessions.id'), nullable=True)
    booking_id = Column(Integer, ForeignKey('mentor_bookings.id'), nullable=True)
    
    rating = Column(Integer, nullable=False)  # 1-5 stars
    comment = Column(Text)
    
    created_at = Column(DateTime, default=datetime.now)
    
    # Relationships
    learner = relationship('UserModel', foreign_keys=[learner_id])
    mentor = relationship('UserModel', foreign_keys=[mentor_id])
    
    def to_dict(self):
        return {
            'id': self.id,
            'learner_id': self.learner_id,
            'mentor_id': self.mentor_id,
            'session_id': self.session_id,
            'booking_id': self.booking_id,
            'rating': self.rating,
            'comment': self.comment,
            'learner_name': self.learner.full_name if self.learner else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
