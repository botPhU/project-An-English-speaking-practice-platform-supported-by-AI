from sqlalchemy import Column, Integer, String, DateTime, Boolean, Date, Text
from sqlalchemy.orm import relationship
from infrastructure.databases.base import Base

class UserModel(Base):
    __tablename__ = 'flask_user'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True)
    user_name = Column(String(18), nullable=False, unique=True)
    password = Column(String(255), nullable=False)  # Increased for hashed passwords
    email = Column(String(100), nullable=True, unique=True)
    full_name = Column(String(100), nullable=True)
    role = Column(String(20), default='learner')  # admin, mentor, learner
    description = Column(String(255), nullable=True)
    status = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    
    # Extended Profile Fields
    phone_number = Column(String(20), nullable=True)
    date_of_birth = Column(Date, nullable=True)
    gender = Column(String(10), nullable=True)  # male, female, other
    address = Column(String(255), nullable=True)
    city = Column(String(100), nullable=True)
    country = Column(String(100), nullable=True)
    avatar_url = Column(String(500), nullable=True)
    bio = Column(Text, nullable=True)
    
    # Profile Completion Tracking
    profile_completed = Column(Boolean, default=False)
    
    # Relationships
    course_registers = relationship("CourseRegisterModel", back_populates="user")
    purchases = relationship("PurchaseModel", back_populates="user")
    progress = relationship("ProgressModel", back_populates="user", uselist=False)
    practice_sessions = relationship("PracticeSessionModel", foreign_keys="PracticeSessionModel.user_id", back_populates="user")
    assessments = relationship("AssessmentModel", back_populates="user") 
