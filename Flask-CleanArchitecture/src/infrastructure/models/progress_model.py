from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from infrastructure.databases.base import Base

class ProgressModel(Base):
    """
    Tiến độ học tập của Learner
    Theo dõi: vocabulary, grammar, pronunciation, speaking fluency
    """
    __tablename__ = 'learner_progress'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False)
    
    # Overall scores (0-100)
    overall_score = Column(Float, default=0)
    vocabulary_score = Column(Float, default=0)
    grammar_score = Column(Float, default=0)
    pronunciation_score = Column(Float, default=0)
    fluency_score = Column(Float, default=0)
    
    # Progress tracking
    total_practice_hours = Column(Float, default=0)
    total_sessions = Column(Integer, default=0)
    current_streak = Column(Integer, default=0)  # Số ngày liên tục
    longest_streak = Column(Integer, default=0)
    words_learned = Column(Integer, default=0)
    
    # Level & achievements
    current_level = Column(String(20), default='beginner')  # beginner, intermediate, advanced
    xp_points = Column(Integer, default=0)
    badges = Column(Text, nullable=True)  # JSON list of badges
    
    # Weekly/monthly stats (JSON)
    weekly_stats = Column(Text, nullable=True)
    monthly_stats = Column(Text, nullable=True)
    
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

    # Relationships
    user = relationship("UserModel", back_populates="progress")
