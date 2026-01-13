"""
Mentor Feedback Model
Database model for mentor feedback and assessments of learners
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from infrastructure.databases.mssql import Base
from datetime import datetime


class MentorFeedbackModel(Base):
    """Model for mentor feedback on learner performance"""
    __tablename__ = 'mentor_feedbacks'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Relationships
    mentor_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False)
    learner_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False)
    session_id = Column(Integer, ForeignKey('practice_sessions.id'), nullable=True)
    
    # Skill scores (1-10)
    pronunciation_score = Column(Integer)
    grammar_score = Column(Integer)
    vocabulary_score = Column(Integer)
    fluency_score = Column(Integer)
    overall_score = Column(Integer)
    
    # Detailed feedback
    strengths = Column(Text)
    improvements = Column(Text)
    recommendations = Column(Text)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, onupdate=datetime.now)
    
    # Relationships
    mentor = relationship('UserModel', foreign_keys=[mentor_id])
    learner = relationship('UserModel', foreign_keys=[learner_id])
    
    def to_dict(self):
        return {
            'id': self.id,
            'mentor_id': self.mentor_id,
            'learner_id': self.learner_id,
            'session_id': self.session_id,
            'mentor_name': self.mentor.full_name if self.mentor else None,
            'mentor_avatar': self.mentor.avatar_url if self.mentor else None,
            'learner_name': self.learner.full_name if self.learner else None,
            'pronunciation_score': self.pronunciation_score,
            'grammar_score': self.grammar_score,
            'vocabulary_score': self.vocabulary_score,
            'fluency_score': self.fluency_score,
            'overall_score': self.overall_score,
            'strengths': self.strengths,
            'improvements': self.improvements,
            'recommendations': self.recommendations,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
