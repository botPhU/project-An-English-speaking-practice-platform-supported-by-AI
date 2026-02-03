"""
Mentor Application Model
Database model for storing mentor applications
"""

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from infrastructure.databases.mssql import Base


class MentorApplicationModel(Base):
    """Model for mentor applications"""
    __tablename__ = 'mentor_applications'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('flask_user.id'), nullable=True)  # Null if applying during registration
    
    # Personal Information
    full_name = Column(String(200), nullable=False)
    email = Column(String(200), nullable=False)
    phone = Column(String(20))
    date_of_birth = Column(DateTime)
    
    # Professional Information
    current_job = Column(String(200))
    company = Column(String(200))
    years_experience = Column(Integer)
    
    # Education
    education_level = Column(String(100))  # Bachelor, Master, PhD, etc.
    major = Column(String(200))
    university = Column(String(300))
    
    # English Qualifications
    english_certificates = Column(Text)  # JSON array of certificates
    # e.g., [{"name": "IELTS", "score": "8.0", "year": 2022}]
    native_language = Column(String(100))
    english_level = Column(String(10))  # C1, C2, Native
    
    # Teaching Experience
    teaching_experience = Column(Text)  # Description of teaching background
    specializations = Column(Text)  # JSON array: ["IELTS", "Business English", "Conversation"]
    target_students = Column(Text)  # JSON array: ["Beginners", "Intermediate", "Advanced"]
    
    # Availability
    available_hours_per_week = Column(Integer)
    preferred_schedule = Column(Text)  # JSON: preferred time slots
    
    # Motivation
    motivation = Column(Text)  # Why they want to be a mentor
    teaching_style = Column(Text)  # Their teaching approach
    
    # Documents
    cv_file_path = Column(String(500))
    certificate_files = Column(Text)  # JSON array of file paths
    video_intro_url = Column(String(500))  # Optional video introduction
    
    # Application Status
    status = Column(String(20), default='pending')  # pending, reviewing, approved, rejected
    admin_notes = Column(Text)
    reviewed_by = Column(Integer, ForeignKey('flask_user.id'))
    reviewed_at = Column(DateTime)
    rejection_reason = Column(Text)
    
    # Timestamps
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    def to_dict(self):
        import json
        return {
            'id': self.id,
            'user_id': self.user_id,
            'personal_info': {
                'full_name': self.full_name,
                'email': self.email,
                'phone': self.phone,
                'date_of_birth': self.date_of_birth.isoformat() if self.date_of_birth else None
            },
            'professional_info': {
                'current_job': self.current_job,
                'company': self.company,
                'years_experience': self.years_experience
            },
            'education': {
                'level': self.education_level,
                'major': self.major,
                'university': self.university
            },
            'english_qualifications': {
                'certificates': json.loads(self.english_certificates) if self.english_certificates else [],
                'native_language': self.native_language,
                'english_level': self.english_level
            },
            'teaching': {
                'experience': self.teaching_experience,
                'specializations': json.loads(self.specializations) if self.specializations else [],
                'target_students': json.loads(self.target_students) if self.target_students else [],
                'available_hours': self.available_hours_per_week,
                'motivation': self.motivation,
                'teaching_style': self.teaching_style
            },
            'documents': {
                'cv': self.cv_file_path,
                'certificates': json.loads(self.certificate_files) if self.certificate_files else [],
                'video_intro': self.video_intro_url
            },
            'status': self.status,
            'admin_notes': self.admin_notes,
            'rejection_reason': self.rejection_reason,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'reviewed_at': self.reviewed_at.isoformat() if self.reviewed_at else None
        }
