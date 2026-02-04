"""
Resource Model for AESP Platform
Mentor shared resources (documents, videos, exercises)
"""

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from infrastructure.databases.base import Base


class ResourceModel(Base):
    """Resource model for mentor shared materials"""
    
    __tablename__ = 'resources'
    __table_args__ = {'extend_existing': True}
    
    id = Column(Integer, primary_key=True)
    mentor_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    resource_type = Column(String(50))  # document, video, audio, link, exercise
    file_url = Column(String(500))
    category = Column(String(100))  # vocabulary, grammar, pronunciation, speaking
    difficulty_level = Column(String(20))  # beginner, intermediate, advanced
    is_public = Column(Boolean, default=False)  # Public or only for assigned learners
    download_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    
    # Relationships
    mentor = relationship("UserModel", backref="resources")
    
    def to_dict(self):
        """Convert model to dictionary"""
        return {
            'id': self.id,
            'mentor_id': self.mentor_id,
            'title': self.title,
            'description': self.description,
            'resource_type': self.resource_type,
            'file_url': self.file_url,
            'category': self.category,
            'difficulty_level': self.difficulty_level,
            'is_public': self.is_public,
            'download_count': self.download_count,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
