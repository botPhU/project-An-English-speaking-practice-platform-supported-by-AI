"""
Speaking Session Model
Stores learner's AI speaking practice sessions for mentor review
"""

from datetime import datetime
from src.infrastructure.database import db


class SpeakingSession(db.Model):
    """Speaking practice session between learner and AI"""
    __tablename__ = 'speaking_sessions'
    
    id = db.Column(db.Integer, primary_key=True)
    learner_id = db.Column(db.Integer, db.ForeignKey('flask_user.id'), nullable=False)
    mentor_id = db.Column(db.Integer, db.ForeignKey('flask_user.id'), nullable=True)
    topic = db.Column(db.String(200), nullable=False)
    mode = db.Column(db.String(50), default='conversation')  # 'repeat' or 'conversation'
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    ended_at = db.Column(db.DateTime, nullable=True)
    average_score = db.Column(db.Float, default=0)
    total_turns = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    learner = db.relationship('FlaskUser', foreign_keys=[learner_id], backref='speaking_sessions')
    messages = db.relationship('SpeakingMessage', backref='session', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'learner_id': self.learner_id,
            'learner_name': self.learner.name if self.learner else 'Unknown',
            'learner_avatar': f"https://api.dicebear.com/7.x/avataaars/svg?seed={self.learner.name if self.learner else 'User'}",
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


class SpeakingMessage(db.Model):
    """Individual message in a speaking session"""
    __tablename__ = 'speaking_messages'
    
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('speaking_sessions.id'), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'ai' or 'user'
    text = db.Column(db.Text, nullable=False)
    score = db.Column(db.Float, nullable=True)
    feedback = db.Column(db.Text, nullable=True)
    audio_url = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
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
