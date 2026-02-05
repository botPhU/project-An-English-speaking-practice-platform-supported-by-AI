"""
Mentor Assignment Service
Business logic for 1-to-1 mentor-learner assignments
"""
from datetime import datetime
from typing import List, Dict, Optional
from sqlalchemy import or_
from infrastructure.databases.mssql import get_db_session
from infrastructure.models.mentor_assignment_model import MentorAssignmentModel
from infrastructure.models.user_model import UserModel


class MentorAssignmentService:
    """Service for managing 1-to-1 mentor-learner assignments"""
    
    def get_all_assignments(self, status: str = None) -> List[Dict]:
        """Get all assignments (for admin)"""
        with get_db_session() as session:
            try:
                query = session.query(MentorAssignmentModel)
                if status:
                    query = query.filter(MentorAssignmentModel.status == status)
                assignments = query.order_by(MentorAssignmentModel.assigned_at.desc()).all()
                return [a.to_dict() for a in assignments]
            except Exception as e:
                print(f"[MentorAssignment] Error getting assignments: {e}")
                return []
    
    def get_mentor_learner(self, mentor_id: int) -> List[Dict]:
        """Get ALL learners assigned to a mentor (1-to-many support)"""
        with get_db_session() as session:
            try:
                assignments = session.query(MentorAssignmentModel).filter(
                    MentorAssignmentModel.mentor_id == mentor_id,
                    MentorAssignmentModel.status == 'active'
                ).order_by(MentorAssignmentModel.assigned_at.desc()).all()
                
                return [a.to_dict() for a in assignments]
            except Exception as e:
                print(f"[MentorAssignment] Error getting mentor's learners: {e}")
                return []
    
    def get_learner_mentor(self, learner_id: int) -> Optional[Dict]:
        """Get the mentor assigned to a learner"""
        with get_db_session() as session:
            try:
                assignment = session.query(MentorAssignmentModel).filter(
                    MentorAssignmentModel.learner_id == learner_id,
                    MentorAssignmentModel.status == 'active'
                ).first()
                
                if assignment:
                    return assignment.to_dict()
                return None
            except Exception as e:
                print(f"[MentorAssignment] Error getting learner's mentor: {e}")
                return None
    
    def create_assignment(self, mentor_id: int, learner_id: int, admin_id: int, notes: str = None) -> Dict:
        """Create a new 1-to-1 assignment (Admin only - strict)"""
        with get_db_session() as session:
            try:
                # Check if mentor already has an active assignment
                existing_mentor = session.query(MentorAssignmentModel).filter(
                    MentorAssignmentModel.mentor_id == mentor_id,
                    MentorAssignmentModel.status == 'active'
                ).first()
                
                if existing_mentor:
                    return {'error': 'Mentor already has an assigned learner', 'existing': existing_mentor.to_dict()}
                
                # Check if learner already has an active assignment
                existing_learner = session.query(MentorAssignmentModel).filter(
                    MentorAssignmentModel.learner_id == learner_id,
                    MentorAssignmentModel.status == 'active'
                ).first()
                
                if existing_learner:
                    return {'error': 'Learner already has an assigned mentor', 'existing': existing_learner.to_dict()}
                
                # Create new assignment
                assignment = MentorAssignmentModel(
                    mentor_id=mentor_id,
                    learner_id=learner_id,
                    assigned_by=admin_id,
                    notes=notes,
                    status='active',
                    assigned_at=datetime.now()
                )
                session.add(assignment)
                session.flush()
                session.refresh(assignment)
                
                return {'success': True, 'assignment': assignment.to_dict()}
            except Exception as e:
                print(f"[MentorAssignment] Error creating assignment: {e}")
                return {'error': str(e)}
    
    def create_assignment_for_booking(self, mentor_id: int, learner_id: int, booking_id: int = None) -> Dict:
        """Create assignment when mentor confirms booking (allows multiple learners per mentor)"""
        with get_db_session() as session:
            try:
                # Only check if this specific learner-mentor pair already exists
                existing = session.query(MentorAssignmentModel).filter(
                    MentorAssignmentModel.mentor_id == mentor_id,
                    MentorAssignmentModel.learner_id == learner_id,
                    MentorAssignmentModel.status == 'active'
                ).first()
                
                if existing:
                    print(f"[MentorAssignment] Assignment already exists for mentor {mentor_id} and learner {learner_id}")
                    return {'success': True, 'assignment': existing.to_dict(), 'already_exists': True}
                
                # Create new assignment
                assignment = MentorAssignmentModel(
                    mentor_id=mentor_id,
                    learner_id=learner_id,
                    assigned_by=mentor_id,  # Mentor assigns themselves via booking
                    notes=f"Auto-assigned from booking #{booking_id}" if booking_id else "Auto-assigned from booking",
                    status='active',
                    assigned_at=datetime.now()
                )
                session.add(assignment)
                session.flush()
                session.refresh(assignment)
                
                print(f"[MentorAssignment] Created assignment: mentor {mentor_id} -> learner {learner_id}")
                return {'success': True, 'assignment': assignment.to_dict()}
            except Exception as e:
                print(f"[MentorAssignment] Error creating booking assignment: {e}")
                return {'error': str(e)}
    
    def end_assignment(self, assignment_id: int) -> bool:
        """End an assignment"""
        with get_db_session() as session:
            try:
                assignment = session.query(MentorAssignmentModel).filter(
                    MentorAssignmentModel.id == assignment_id
                ).first()
                
                if assignment:
                    assignment.status = 'ended'
                    assignment.ended_at = datetime.now()
                    return True
                return False
            except Exception as e:
                print(f"[MentorAssignment] Error ending assignment: {e}")
                return False
    
    def get_unassigned_mentors(self) -> List[Dict]:
        """Get mentors without active assignments"""
        with get_db_session() as session:
            try:
                # Get IDs of mentors with active assignments
                assigned_mentor_ids = session.query(MentorAssignmentModel.mentor_id).filter(
                    MentorAssignmentModel.status == 'active'
                ).subquery()
                
                # Get mentors not in that list
                mentors = session.query(UserModel).filter(
                    UserModel.role == 'mentor',
                    ~UserModel.id.in_(assigned_mentor_ids)
                ).all()
                
                return [{
                    'id': m.id,
                    'full_name': m.full_name,
                    'email': m.email,
                    'avatar_url': m.avatar_url
                } for m in mentors]
            except Exception as e:
                print(f"[MentorAssignment] Error getting unassigned mentors: {e}")
                return []
    
    def get_unassigned_learners(self) -> List[Dict]:
        """Get learners without active assignments"""
        with get_db_session() as session:
            try:
                # Get IDs of learners with active assignments
                assigned_learner_ids = session.query(MentorAssignmentModel.learner_id).filter(
                    MentorAssignmentModel.status == 'active'
                ).subquery()
                
                # Get learners not in that list
                learners = session.query(UserModel).filter(
                    UserModel.role == 'learner',
                    ~UserModel.id.in_(assigned_learner_ids)
                ).all()
                
                return [{
                    'id': l.id,
                    'full_name': l.full_name,
                    'email': l.email,
                    'avatar_url': l.avatar_url
                } for l in learners]
            except Exception as e:
                print(f"[MentorAssignment] Error getting unassigned learners: {e}")
                return []


# Singleton instance
mentor_assignment_service = MentorAssignmentService()
