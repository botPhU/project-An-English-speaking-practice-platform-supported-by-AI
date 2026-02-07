"""
Availability Model for Mentor Scheduling
Database model for mentor time slot management
"""

from datetime import datetime, date, time
from sqlalchemy import Column, Integer, Date, Time, Boolean, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from infrastructure.databases.mssql import Base


class AvailabilityModel(Base):
    """Mentor availability time slots"""
    __tablename__ = 'mentor_availability'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    mentor_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False)
    
    # Schedule details
    date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    slot_duration = Column(Integer, default=30)  # Minutes per slot
    
    # Recurrence
    is_recurring = Column(Boolean, default=False)
    recurrence_pattern = Column(String(50))  # daily, weekly, monthly
    recurrence_end_date = Column(Date)
    
    # Status
    is_booked = Column(Boolean, default=False)
    booking_id = Column(Integer)
    is_active = Column(Boolean, default=True)
    
    # Additional info
    notes = Column(Text)
    created_at = Column(Date, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'mentor_id': self.mentor_id,
            'date': self.date.strftime('%Y-%m-%d') if self.date else None,
            'start_time': self.start_time.strftime('%H:%M') if self.start_time else None,
            'end_time': self.end_time.strftime('%H:%M') if self.end_time else None,
            'slot_duration': self.slot_duration,
            'is_recurring': self.is_recurring,
            'recurrence_pattern': self.recurrence_pattern,
            'is_booked': self.is_booked,
            'is_active': self.is_active,
            'notes': self.notes
        }
