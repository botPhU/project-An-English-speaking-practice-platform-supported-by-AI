from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Enum
from sqlalchemy.orm import relationship
from infrastructure.databases.base import Base
import enum

class PurchaseStatus(enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"

class PurchaseModel(Base):
    """
    Giao dịch mua gói dịch vụ
    Quan hệ: User (1) <---> (N) Purchase (N) <---> (1) Package
    """
    __tablename__ = 'purchases'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False)
    package_id = Column(Integer, ForeignKey('packages.id'), nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(String(20), default='pending')  # pending, completed, cancelled, refunded
    payment_method = Column(String(50), nullable=True)  # momo, vnpay, bank_transfer
    transaction_id = Column(String(100), nullable=True)
    start_date = Column(DateTime, nullable=True)  # Ngày bắt đầu sử dụng
    end_date = Column(DateTime, nullable=True)  # Ngày hết hạn
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

    # Relationships
    user = relationship("UserModel", back_populates="purchases")
    package = relationship("PackageModel", back_populates="purchases")
