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
    __table_args__ = {'extend_existing': True}
    
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
        
        # Safe attribute getter with default
        def safe_get(attr, default=None):
            return getattr(self, attr, default) or default
        
        # Parse JSON safely
        def parse_json(value, default=None):
            if default is None:
                default = []
            if not value:
                return default
            try:
                return json.loads(value)
            except:
                return default
        
        # Get user info from flask_user if linked
        user_name = safe_get('full_name', '')
        user_email = safe_get('email', '')
        
        # Try to get from linked user if fields are empty
        if self.user_id and (not user_name or not user_email):
            try:
                from infrastructure.databases.mssql import SessionLocal
                with SessionLocal() as session:
                    from infrastructure.models.user_model import UserModel
                    user = session.query(UserModel).get(self.user_id)
                    if user:
                        user_name = user_name or user.full_name or user.user_name
                        user_email = user_email or user.email
            except:
                pass
        
        return {
            'id': self.id,
            'user_id': self.user_id,
            'personal_info': {
                'full_name': user_name or f'Mentor #{self.id}',
                'email': user_email or '',
                'phone': safe_get('phone', ''),
                'date_of_birth': self.date_of_birth.isoformat() if safe_get('date_of_birth') else None
            },
            'professional_info': {
                'current_job': safe_get('current_job', safe_get('specialty', '')),
                'company': safe_get('company', ''),
                'years_experience': safe_get('years_experience', safe_get('experience_years', 0)) or 0
            },
            'education': {
                'level': safe_get('education_level', ''),
                'major': safe_get('major', ''),
                'university': safe_get('university', '')
            },
            'english_qualifications': {
                'certificates': parse_json(safe_get('english_certificates') or safe_get('certifications')),
                'native_language': safe_get('native_language', 'Vietnamese'),
                'english_level': safe_get('english_level', '')
            },
            'teaching': {
                'experience': safe_get('teaching_experience', safe_get('bio', '')),
                'specializations': parse_json(safe_get('specializations') or safe_get('specialty')),
                'target_students': parse_json(safe_get('target_students')),
                'available_hours': safe_get('available_hours_per_week', 0) or 0,
                'motivation': safe_get('motivation', ''),
                'teaching_style': safe_get('teaching_style', '')
            },
            'documents': {
                'cv': safe_get('cv_file_path', safe_get('cv_url', '')),
                'certificates': parse_json(safe_get('certificate_files')),
                'video_intro': safe_get('video_intro_url', '')
            },
            'status': self.status or 'pending',
            'admin_notes': safe_get('admin_notes', ''),
            'rejection_reason': safe_get('rejection_reason', safe_get('reject_reason', '')),
            'created_at': self.created_at.isoformat() if safe_get('created_at') else None,
            'reviewed_at': self.reviewed_at.isoformat() if safe_get('reviewed_at') else None
        }
