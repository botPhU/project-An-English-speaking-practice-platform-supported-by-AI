from sqlalchemy import Column, ForeignKey, Integer, DateTime
from sqlalchemy.orm import relationship
from infrastructure.databases.base import Base

class CourseRegisterModel(Base):
    """
    Bảng trung gian (Junction Table) cho quan hệ Many-to-Many
    giữa User và Course.
    
    Quan hệ: User (N) <---> (N) Course
    - 1 User có thể đăng ký nhiều Course
    - 1 Course có thể có nhiều User đăng ký
    """
    __tablename__ = 'course_register'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False)
    course_id = Column(Integer, ForeignKey('courses.id'), nullable=False)
    registered_at = Column(DateTime)  # Thời gian đăng ký
    
    # Relationships (Many-to-One: Nhiều registers thuộc về 1 User/Course)
    user = relationship("UserModel", back_populates="course_registers")
    course = relationship("CourseModel", back_populates="registrations")
