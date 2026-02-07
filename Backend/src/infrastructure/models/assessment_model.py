from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from infrastructure.databases.base import Base

class AssessmentModel(Base):
    """
    Bài đánh giá trình độ (Initial & Periodic)
    - Initial: Đánh giá đầu vào khi đăng ký
    - Periodic: Đánh giá định kỳ để tracking progress
    """
    __tablename__ = 'assessments'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False)
    
    # Assessment type
    assessment_type = Column(String(50), nullable=False)  # initial, weekly, monthly, level_up
    
    # Scores (0-100)
    listening_score = Column(Float, nullable=True)
    speaking_score = Column(Float, nullable=True)
    pronunciation_score = Column(Float, nullable=True)
    vocabulary_score = Column(Float, nullable=True)
    grammar_score = Column(Float, nullable=True)
    overall_score = Column(Float, nullable=True)
    
    # Level determination
    determined_level = Column(String(20), nullable=True)  # A1, A2, B1, B2, C1, C2
    previous_level = Column(String(20), nullable=True)
    
    # Details
    questions_answered = Column(Integer, default=0)
    correct_answers = Column(Integer, default=0)
    time_taken_minutes = Column(Integer, default=0)
    
    # Feedback & Recommendations
    ai_feedback = Column(Text, nullable=True)  # JSON
    recommended_topics = Column(Text, nullable=True)  # JSON list
    improvement_areas = Column(Text, nullable=True)  # JSON list
    
    # Status
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime)

    # Relationships
    user = relationship("UserModel", back_populates="assessments")
