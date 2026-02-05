"""
Learner Resource Assignment Model
Tracks which resources/exercises are assigned to which learners
"""

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from infrastructure.databases.base import Base


class LearnerResourceModel(Base):
    """Assignment of resources/exercises to learners by mentors"""
    
    __tablename__ = 'learner_resources'
    __table_args__ = {'extend_existing': True}
    
    id = Column(Integer, primary_key=True)
    resource_id = Column(Integer, ForeignKey('resources.id'), nullable=False)
    learner_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False)
    mentor_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False)
    
    # Status tracking
    status = Column(String(20), default='assigned')  # assigned, in_progress, completed, reviewed
    due_date = Column(DateTime, nullable=True)
    completion_date = Column(DateTime, nullable=True)
    
    # Progress tracking (for exercises)
    score = Column(Integer, nullable=True)  # 0-100
    mentor_feedback = Column(Text, nullable=True)
    learner_notes = Column(Text, nullable=True)
    
    # Timestamps
    assigned_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    
    # Relationships
    resource = relationship("ResourceModel", backref="assignments")
    learner = relationship("UserModel", foreign_keys=[learner_id], backref="assigned_resources")
    mentor = relationship("UserModel", foreign_keys=[mentor_id], backref="resource_assignments")
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'resource_id': self.resource_id,
            'learner_id': self.learner_id,
            'mentor_id': self.mentor_id,
            'status': self.status,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'completion_date': self.completion_date.isoformat() if self.completion_date else None,
            'score': self.score,
            'mentor_feedback': self.mentor_feedback,
            'learner_notes': self.learner_notes,
            'assigned_at': self.assigned_at.isoformat() if self.assigned_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            # Include resource details
            'resource': self.resource.to_dict() if self.resource else None
        }
