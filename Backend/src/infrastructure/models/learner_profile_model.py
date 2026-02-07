from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from infrastructure.databases.base import Base


class LearnerProfileModel(Base):
    """
    Extended profile cho Learner - Lưu preferences và learning goals
    Kết nối với UserModel để có thông tin cá nhân
    """
    __tablename__ = 'learner_profile'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False, unique=True)
    
    # Learning goals (JSON stored as Text)
    learning_goals = Column(Text, nullable=True)  # ['career', 'travel', 'exam']
    target_level = Column(String(20), default='C1')  # A1, A2, B1, B2, C1, C2
    
    # Learning preferences
    correction_style = Column(String(20), default='gentle')  # 'gentle' or 'strict'
    daily_goal_minutes = Column(Integer, default=30)
    preferred_time = Column(String(20), default='morning')  # morning, afternoon, evening
    ai_voice = Column(String(50), default='female_us')
    
    # Privacy settings
    profile_visibility = Column(String(20), default='public')  # public, mentors_only, private
    show_progress = Column(Boolean, default=True)
    
    # Voice calibration
    voice_sample_url = Column(String(255), nullable=True)
    voice_calibrated_at = Column(DateTime, nullable=True)
    
    # Language settings
    native_language = Column(String(10), default='vi')
    timezone = Column(String(50), default='Asia/Ho_Chi_Minh')
    
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

    # Relationship
    user = relationship("UserModel", backref="learner_profile")
