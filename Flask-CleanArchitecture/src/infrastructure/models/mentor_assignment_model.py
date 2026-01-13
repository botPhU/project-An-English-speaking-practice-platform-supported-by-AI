"""
Mentor Assignment Model
Database model for 1-to-1 mentor-learner assignments
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from infrastructure.databases.mssql import Base
from datetime import datetime


class MentorAssignmentModel(Base):
    """Model for 1-to-1 mentor-learner assignments"""
    __tablename__ = 'mentor_assignments'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # 1-to-1 relationship - each mentor has one learner, each learner has one mentor
    mentor_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False, unique=True)
    learner_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False, unique=True)
    
    # Admin who made the assignment
    assigned_by = Column(Integer, ForeignKey('flask_user.id'), nullable=False)
    
    # Status: active, paused, ended
    status = Column(String(50), default='active')
    
    # Notes from admin
    notes = Column(Text)
    
    # Timestamps
    assigned_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, onupdate=datetime.now)
    ended_at = Column(DateTime)
    
    # Relationships
    mentor = relationship('UserModel', foreign_keys=[mentor_id])
    learner = relationship('UserModel', foreign_keys=[learner_id])
    admin = relationship('UserModel', foreign_keys=[assigned_by])
    
    def to_dict(self):
        from datetime import datetime, timedelta
        
        # Calculate mentor online status - online if last_login within 15 minutes
        mentor_online = False
        if self.mentor and self.mentor.last_login:
            time_diff = datetime.now() - self.mentor.last_login
            mentor_online = time_diff < timedelta(minutes=15)
        
        return {
            'id': self.id,
            'mentor_id': self.mentor_id,
            'learner_id': self.learner_id,
            'mentor_name': self.mentor.full_name if self.mentor else None,
            'mentor_email': self.mentor.email if self.mentor else None,
            'mentor_avatar': self.mentor.avatar_url if self.mentor else None,
            'mentor_online': mentor_online,
            'learner_name': self.learner.full_name if self.learner else None,
            'learner_email': self.learner.email if self.learner else None,
            'learner_avatar': self.learner.avatar_url if self.learner else None,
            'assigned_by': self.assigned_by,
            'admin_name': self.admin.full_name if self.admin else None,
            'status': self.status,
            'notes': self.notes,
            'assigned_at': self.assigned_at.isoformat() if self.assigned_at else None,
            'ended_at': self.ended_at.isoformat() if self.ended_at else None
        }
