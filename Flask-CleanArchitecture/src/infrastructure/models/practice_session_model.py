from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from infrastructure.databases.base import Base

class PracticeSessionModel(Base):
    """
    Phiên luyện tập nói với AI
    Lưu trữ: transcript, scores, feedback
    """
    __tablename__ = 'practice_sessions'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False)
    mentor_id = Column(Integer, ForeignKey('flask_user.id'), nullable=True)  # Null nếu chỉ AI
    
    # Session info
    session_type = Column(String(50), nullable=False)  # ai_only, with_mentor, peer_practice
    topic = Column(String(100), nullable=True)  # travel, business, daily_life
    scenario = Column(String(200), nullable=True)
    duration_minutes = Column(Integer, default=0)
    
    # Transcript & Analysis
    transcript = Column(Text, nullable=True)  # JSON: user & AI messages
    ai_feedback = Column(Text, nullable=True)  # JSON: AI analysis
    
    # Scores (0-100)
    pronunciation_score = Column(Float, nullable=True)
    grammar_score = Column(Float, nullable=True)
    vocabulary_score = Column(Float, nullable=True)
    fluency_score = Column(Float, nullable=True)
    overall_score = Column(Float, nullable=True)
    
    # Errors detected
    pronunciation_errors = Column(Text, nullable=True)  # JSON list
    grammar_errors = Column(Text, nullable=True)  # JSON list
    vocabulary_suggestions = Column(Text, nullable=True)  # JSON list
    
    # Status
    is_completed = Column(Boolean, default=False)
    started_at = Column(DateTime)
    ended_at = Column(DateTime)
    created_at = Column(DateTime)

    # Relationships
    user = relationship("UserModel", foreign_keys=[user_id], back_populates="practice_sessions")
