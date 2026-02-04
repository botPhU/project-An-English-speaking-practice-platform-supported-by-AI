"""
Resource Service for AESP Platform
Business logic for managing mentor resources
"""

from datetime import datetime
from typing import List, Optional, Dict, Any

from infrastructure.models.resource_model import ResourceModel
from infrastructure.databases.mssql import session


class ResourceService:
    """Service for managing mentor resources"""
    
    @staticmethod
    def create_resource(
        mentor_id: int,
        title: str,
        description: str = None,
        resource_type: str = 'document',
        file_url: str = None,
        category: str = None,
        difficulty_level: str = None,
        is_public: bool = False
    ) -> ResourceModel:
        """Create a new resource"""
        resource = ResourceModel(
            mentor_id=mentor_id,
            title=title,
            description=description,
            resource_type=resource_type,
            file_url=file_url,
            category=category,
            difficulty_level=difficulty_level,
            is_public=is_public,
            download_count=0,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        session.add(resource)
        session.commit()
        
        return resource
    
    @staticmethod
    def get_resource_by_id(resource_id: int) -> Optional[ResourceModel]:
        """Get a resource by ID"""
        return session.query(ResourceModel).filter_by(id=resource_id).first()
    
    @staticmethod
    def get_mentor_resources(
        mentor_id: int,
        limit: int = 20,
        offset: int = 0
    ) -> List[Dict[str, Any]]:
        """Get all resources by a mentor"""
        resources = session.query(ResourceModel).filter(
            ResourceModel.mentor_id == mentor_id
        ).order_by(
            ResourceModel.created_at.desc()
        ).offset(offset).limit(limit).all()
        
        return [r.to_dict() for r in resources]
    
    @staticmethod
    def get_public_resources(
        category: str = None,
        difficulty_level: str = None,
        limit: int = 20,
        offset: int = 0
    ) -> List[Dict[str, Any]]:
        """Get all public resources with optional filters"""
        query = session.query(ResourceModel).filter(
            ResourceModel.is_public == True
        )
        
        if category:
            query = query.filter(ResourceModel.category == category)
        
        if difficulty_level:
            query = query.filter(ResourceModel.difficulty_level == difficulty_level)
        
        resources = query.order_by(
            ResourceModel.download_count.desc()
        ).offset(offset).limit(limit).all()
        
        return [r.to_dict() for r in resources]
    
    @staticmethod
    def update_resource(
        resource_id: int,
        mentor_id: int,
        **kwargs
    ) -> Optional[ResourceModel]:
        """Update a resource (only by owner)"""
        resource = session.query(ResourceModel).filter(
            ResourceModel.id == resource_id,
            ResourceModel.mentor_id == mentor_id
        ).first()
        
        if not resource:
            return None
        
        for key, value in kwargs.items():
            if hasattr(resource, key) and value is not None:
                setattr(resource, key, value)
        
        resource.updated_at = datetime.now()
        session.commit()
        
        return resource
    
    @staticmethod
    def delete_resource(resource_id: int, mentor_id: int) -> bool:
        """Delete a resource (only by owner)"""
        resource = session.query(ResourceModel).filter(
            ResourceModel.id == resource_id,
            ResourceModel.mentor_id == mentor_id
        ).first()
        
        if resource:
            session.delete(resource)
            session.commit()
            return True
        
        return False
    
    @staticmethod
    def increment_download_count(resource_id: int) -> bool:
        """Increment download count for a resource"""
        resource = session.query(ResourceModel).filter_by(id=resource_id).first()
        
        if resource:
            resource.download_count += 1
            session.commit()
            return True
        
        return False
    
    @staticmethod
    def search_resources(
        query: str,
        category: str = None,
        limit: int = 20
    ) -> List[Dict[str, Any]]:
        """Search resources by title or description"""
        search_query = session.query(ResourceModel).filter(
            ResourceModel.is_public == True,
            (ResourceModel.title.ilike(f'%{query}%')) |
            (ResourceModel.description.ilike(f'%{query}%'))
        )
        
        if category:
            search_query = search_query.filter(ResourceModel.category == category)
        
        resources = search_query.limit(limit).all()
        
        return [r.to_dict() for r in resources]
