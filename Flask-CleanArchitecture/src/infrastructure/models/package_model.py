from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean, Text
from sqlalchemy.orm import relationship
from infrastructure.databases.base import Base

class PackageModel(Base):
    """
    Gói dịch vụ học tập (Service Package)
    - Basic: Không có mentor
    - Premium: Có mentor hỗ trợ
    - Pro: Mentor + AI advanced features
    """
    __tablename__ = 'packages'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    duration_days = Column(Integer, nullable=False)  # Thời hạn (ngày)
    has_mentor = Column(Boolean, default=False)  # Có mentor không
    has_ai_advanced = Column(Boolean, default=False)  # AI nâng cao
    max_sessions_per_month = Column(Integer, default=10)  # Số buổi/tháng
    features = Column(Text, nullable=True)  # JSON features list
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

    # Relationships
    purchases = relationship("PurchaseModel", back_populates="package")
