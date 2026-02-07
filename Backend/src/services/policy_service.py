"""
Policy Service for AESP Platform
Business logic for managing system policies (Terms, Privacy, Refund, etc.)
"""

from datetime import datetime
from typing import List, Optional, Dict, Any

from infrastructure.databases.mssql import session
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from infrastructure.databases.base import Base


class PolicyModel(Base):
    """Policy model for system policies"""
    
    __tablename__ = 'policies'
    __table_args__ = {'extend_existing': True}
    
    id = Column(Integer, primary_key=True)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    policy_type = Column(String(50))  # terms, privacy, refund, usage
    version = Column(String(20))
    is_active = Column(Boolean, default=True)
    effective_date = Column(DateTime)
    created_by = Column(Integer, ForeignKey('flask_user.id'))
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'policy_type': self.policy_type,
            'version': self.version,
            'is_active': self.is_active,
            'effective_date': self.effective_date.isoformat() if self.effective_date else None,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class PolicyService:
    """Service for managing system policies"""
    
    @staticmethod
    def get_all_policies(
        policy_type: str = None,
        active_only: bool = True
    ) -> List[Dict[str, Any]]:
        """Get all policies with optional filters"""
        query = session.query(PolicyModel)
        
        if active_only:
            query = query.filter(PolicyModel.is_active == True)
        
        if policy_type:
            query = query.filter(PolicyModel.policy_type == policy_type)
        
        policies = query.order_by(PolicyModel.updated_at.desc()).all()
        return [p.to_dict() for p in policies]
    
    @staticmethod
    def get_policy_by_id(policy_id: int) -> Optional[Dict[str, Any]]:
        """Get policy by ID"""
        policy = session.query(PolicyModel).filter_by(id=policy_id).first()
        return policy.to_dict() if policy else None
    
    @staticmethod
    def get_policy_by_type(policy_type: str) -> Optional[Dict[str, Any]]:
        """Get active policy by type (e.g., 'terms', 'privacy')"""
        policy = session.query(PolicyModel).filter(
            PolicyModel.policy_type == policy_type,
            PolicyModel.is_active == True
        ).order_by(PolicyModel.effective_date.desc()).first()
        
        return policy.to_dict() if policy else None
    
    @staticmethod
    def create_policy(
        title: str,
        content: str,
        policy_type: str = None,
        version: str = None,
        effective_date: datetime = None,
        created_by: int = None
    ) -> Dict[str, Any]:
        """Create a new policy"""
        policy = PolicyModel(
            title=title,
            content=content,
            policy_type=policy_type,
            version=version,
            is_active=True,
            effective_date=effective_date or datetime.now(),
            created_by=created_by,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        session.add(policy)
        session.commit()
        
        return policy.to_dict()
    
    @staticmethod
    def update_policy(policy_id: int, **kwargs) -> Optional[Dict[str, Any]]:
        """Update a policy"""
        policy = session.query(PolicyModel).filter_by(id=policy_id).first()
        
        if not policy:
            return None
        
        for key, value in kwargs.items():
            if hasattr(policy, key) and value is not None:
                setattr(policy, key, value)
        
        policy.updated_at = datetime.now()
        session.commit()
        
        return policy.to_dict()
    
    @staticmethod
    def delete_policy(policy_id: int) -> bool:
        """Soft delete a policy (set inactive)"""
        policy = session.query(PolicyModel).filter_by(id=policy_id).first()
        
        if policy:
            policy.is_active = False
            policy.updated_at = datetime.now()
            session.commit()
            return True
        
        return False
    
    @staticmethod
    def get_policy_types() -> List[str]:
        """Get all unique policy types"""
        types = session.query(PolicyModel.policy_type).distinct().all()
        return [t[0] for t in types if t[0]]
