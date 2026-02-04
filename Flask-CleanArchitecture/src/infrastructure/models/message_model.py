"""
Message Model
Database model for chat messages between users
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from infrastructure.databases.mssql import Base
from datetime import datetime


class MessageModel(Base):
    """Model for chat messages"""
    __tablename__ = 'messages'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, autoincrement=True)
    sender_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False)
    receiver_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False)
    
    # Message content
    content = Column(Text, nullable=False)
    
    # Read status
    is_read = Column(Boolean, default=False)
    read_at = Column(DateTime)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.now)
    
    # Relationships
    sender = relationship('UserModel', foreign_keys=[sender_id])
    receiver = relationship('UserModel', foreign_keys=[receiver_id])
    
    def to_dict(self):
        return {
            'id': self.id,
            'sender_id': self.sender_id,
            'receiver_id': self.receiver_id,
            'sender_name': self.sender.full_name if self.sender else None,
            'receiver_name': self.receiver.full_name if self.receiver else None,
            'content': self.content,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
