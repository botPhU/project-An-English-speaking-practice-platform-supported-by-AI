"""
Mentor Assignment Model
Database model for mentor-learner assignments (1-to-many: one mentor can have multiple learners)
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from infrastructure.databases.mssql import Base
from datetime import datetime


class MentorAssignmentModel(Base):
    """Model for mentor-learner assignments (1-to-many)"""
    __tablename__ = 'mentor_assignments'
    __table_args__ = (
        # Unique constraint: each mentor-learner pair can only have one active assignment
        UniqueConstraint('mentor_id', 'learner_id', name='uq_mentor_learner'),
        {'extend_existing': True}
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # 1-to-many relationship - each mentor can have multiple learners
    mentor_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False)
    learner_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False)

    
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
