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
    
    # ==================== LEARNER RESOURCE ASSIGNMENTS ====================
    
    @staticmethod
    def assign_to_learner(
        resource_id: int,
        learner_id: int,
        mentor_id: int,
        due_date: str = None
    ) -> Dict[str, Any]:
        """Assign a resource to a learner"""
        from infrastructure.models.learner_resource_model import LearnerResourceModel
        
        # Check if resource exists
        resource = session.query(ResourceModel).filter_by(id=resource_id).first()
        if not resource:
            return {'error': 'Resource not found'}
        
        # Check if already assigned
        existing = session.query(LearnerResourceModel).filter(
            LearnerResourceModel.resource_id == resource_id,
            LearnerResourceModel.learner_id == learner_id
        ).first()
        
        if existing:
            return {'error': 'Resource already assigned to this learner'}
        
        # Parse due date if provided
        parsed_due_date = None
        if due_date:
            try:
                parsed_due_date = datetime.fromisoformat(due_date.replace('Z', '+00:00'))
            except:
                parsed_due_date = None
        
        # Create assignment
        assignment = LearnerResourceModel(
            resource_id=resource_id,
            learner_id=learner_id,
            mentor_id=mentor_id,
            status='assigned',
            due_date=parsed_due_date,
            assigned_at=datetime.now()
        )
        
        session.add(assignment)
        session.commit()
        
        return assignment.to_dict()
    
    @staticmethod
    def get_learner_assignments(
        learner_id: int,
        status: str = None
    ) -> List[Dict[str, Any]]:
        """Get all resources assigned to a learner"""
        from infrastructure.models.learner_resource_model import LearnerResourceModel
        
        query = session.query(LearnerResourceModel).filter(
            LearnerResourceModel.learner_id == learner_id
        )
        
        if status:
            query = query.filter(LearnerResourceModel.status == status)
        
        assignments = query.order_by(
            LearnerResourceModel.assigned_at.desc()
        ).all()
        
        return [a.to_dict() for a in assignments]
    
    @staticmethod
    def get_mentor_assignments(
        mentor_id: int,
        learner_id: int = None,
        status: str = None
    ) -> List[Dict[str, Any]]:
        """Get all assignments made by a mentor"""
        from infrastructure.models.learner_resource_model import LearnerResourceModel
        
        query = session.query(LearnerResourceModel).filter(
            LearnerResourceModel.mentor_id == mentor_id
        )
        
        if learner_id:
            query = query.filter(LearnerResourceModel.learner_id == learner_id)
        
        if status:
            query = query.filter(LearnerResourceModel.status == status)
        
        assignments = query.order_by(
            LearnerResourceModel.assigned_at.desc()
        ).all()
        
        return [a.to_dict() for a in assignments]
    
    @staticmethod
    def update_assignment(
        assignment_id: int,
        status: str = None,
        score: int = None,
        mentor_feedback: str = None,
        learner_notes: str = None
    ) -> Optional[Dict[str, Any]]:
        """Update an assignment status or feedback"""
        from infrastructure.models.learner_resource_model import LearnerResourceModel
        
        assignment = session.query(LearnerResourceModel).filter_by(
            id=assignment_id
        ).first()
        
        if not assignment:
            return None
        
        if status:
            assignment.status = status
            if status == 'completed':
                assignment.completion_date = datetime.now()
        
        if score is not None:
            assignment.score = score
        
        if mentor_feedback is not None:
            assignment.mentor_feedback = mentor_feedback
        
        if learner_notes is not None:
            assignment.learner_notes = learner_notes
        
        assignment.updated_at = datetime.now()
        session.commit()
        
        return assignment.to_dict()
    
    @staticmethod
    def delete_assignment(assignment_id: int, mentor_id: int) -> bool:
        """Delete an assignment (only by assigning mentor)"""
        from infrastructure.models.learner_resource_model import LearnerResourceModel
        
        assignment = session.query(LearnerResourceModel).filter(
            LearnerResourceModel.id == assignment_id,
            LearnerResourceModel.mentor_id == mentor_id
        ).first()
        
        if assignment:
            session.delete(assignment)
            session.commit()
            return True
        
        return False

