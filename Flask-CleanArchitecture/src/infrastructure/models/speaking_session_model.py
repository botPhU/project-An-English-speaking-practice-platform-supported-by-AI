"""
Speaking Session Model
Stores learner's AI speaking practice sessions for mentor review
"""
from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from infrastructure.databases.mssql import Base
from datetime import datetime


class SpeakingSession(Base):
    """Speaking practice session between learner and AI"""
    __tablename__ = 'speaking_sessions'
    __table_args__ = {'extend_existing': True}
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    learner_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False)
    mentor_id = Column(Integer, ForeignKey('flask_user.id'), nullable=True)
    topic = Column(String(200), nullable=False)
    mode = Column(String(50), default='conversation')  # 'repeat' or 'conversation'
    started_at = Column(DateTime, default=datetime.utcnow)
    ended_at = Column(DateTime, nullable=True)
    average_score = Column(Float, default=0)
    total_turns = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    learner = relationship('UserModel', foreign_keys=[learner_id], backref='speaking_sessions')
    messages = relationship('SpeakingMessage', backref='session', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'learner_id': self.learner_id,
            'learner_name': self.learner.full_name if self.learner else 'Unknown',
            'learner_avatar': f"https://api.dicebear.com/7.x/avataaars/svg?seed={self.learner.full_name if self.learner else 'User'}",
            'mentor_id': self.mentor_id,
            'topic': self.topic,
            'mode': self.mode,
            'created_at': self.started_at.isoformat() if self.started_at else None,
            'ended_at': self.ended_at.isoformat() if self.ended_at else None,
            'duration_seconds': int((self.ended_at - self.started_at).total_seconds()) if self.ended_at and self.started_at else 0,
            'average_score': round(self.average_score, 1) if self.average_score else 0,
            'total_turns': self.total_turns,
            'messages': [m.to_dict() for m in self.messages.order_by(SpeakingMessage.created_at)]
        }


class SpeakingMessage(Base):
    """Individual message in a speaking session"""
    __tablename__ = 'speaking_messages'
    __table_args__ = {'extend_existing': True}
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(Integer, ForeignKey('speaking_sessions.id'), nullable=False)
    role = Column(String(20), nullable=False)  # 'ai' or 'user'
    text = Column(Text, nullable=False)
    score = Column(Float, nullable=True)
    feedback = Column(Text, nullable=True)
    audio_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'role': self.role,
            'text': self.text,
            'score': self.score,
            'feedback': self.feedback,
            'audio_url': self.audio_url,
            'timestamp': self.created_at.strftime('%H:%M:%S') if self.created_at else None
        }
