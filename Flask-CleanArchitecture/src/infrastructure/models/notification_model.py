"""
Notification Model for AESP Platform
"""

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from infrastructure.databases.base import Base


class NotificationModel(Base):
    """Notification model for user notifications"""
    
    __tablename__ = 'notifications'
    __table_args__ = {'extend_existing': True}
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False)
    title = Column(String(200), nullable=False)
    message = Column(Text)
    notification_type = Column(String(50))  # system, reminder, achievement, feedback, session
    is_read = Column(Boolean, default=False)
    action_url = Column(String(500))  # Link when clicking notification
    created_at = Column(DateTime, default=datetime.now)
    
    # Relationships
    user = relationship("UserModel", backref="notifications")
    
    def to_dict(self):
        """Convert model to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'message': self.message,
            'type': self.notification_type,  # Frontend expects 'type' not 'notification_type'
            'notification_type': self.notification_type,  # Keep for backwards compatibility
            'is_read': self.is_read,
            'action_url': self.action_url,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
