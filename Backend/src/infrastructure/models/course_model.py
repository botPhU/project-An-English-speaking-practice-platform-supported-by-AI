from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from infrastructure.databases.base import Base

class CourseModel(Base):
    __tablename__ = 'courses'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True)
    course_name = Column(String(255), nullable=False)
    description = Column(String(255), nullable=True)
    status = Column(String(50), nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    
    # Relationships (One-to-Many: 1 Course có nhiều registrations)
    # ORM: Object Relational Mapping - Ánh xạ giữa database và object trong code
    registrations = relationship("CourseRegisterModel", back_populates="course")
