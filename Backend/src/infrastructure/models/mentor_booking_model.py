"""
Mentor Booking Model
Database model for booking sessions with mentors
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, Date, Time, ForeignKey
from sqlalchemy.orm import relationship
from infrastructure.databases.mssql import Base
from datetime import datetime


class MentorBookingModel(Base):
    """Model for mentor session bookings"""
    __tablename__ = 'mentor_bookings'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, autoincrement=True)
    learner_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False)
    mentor_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False)
    
    # Scheduling
    scheduled_date = Column(Date, nullable=False)
    scheduled_time = Column(Time, nullable=False)
    duration_minutes = Column(Integer, default=30)
    
    # Session details
    topic = Column(String(255))
    notes = Column(Text)
    
    # Status: pending, confirmed, completed, cancelled, rejected
    status = Column(String(50), default='pending')
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, onupdate=datetime.now)
    confirmed_at = Column(DateTime)
    completed_at = Column(DateTime)
    
    # Relationships
    learner = relationship('UserModel', foreign_keys=[learner_id])
    mentor = relationship('UserModel', foreign_keys=[mentor_id])
    
    def to_dict(self):
        return {
            'id': self.id,
            'learner_id': self.learner_id,
            'mentor_id': self.mentor_id,
            'learner_name': self.learner.full_name if self.learner else None,
            'mentor_name': self.mentor.full_name if self.mentor else None,
            'scheduled_date': str(self.scheduled_date) if self.scheduled_date else None,
            'scheduled_time': str(self.scheduled_time) if self.scheduled_time else None,
            'duration_minutes': self.duration_minutes,
            'topic': self.topic,
            'notes': self.notes,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
