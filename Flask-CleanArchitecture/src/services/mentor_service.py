from infrastructure.models.user_model import UserModel
from infrastructure.models.feedback_model import FeedbackModel
from infrastructure.models.practice_session_model import PracticeSessionModel
from infrastructure.databases.mssql import session as db_session
from datetime import datetime

class MentorService:
    """Service for Mentor-specific business logic"""
    
    def __init__(self):
        pass
    
    def _get_session(self):
        return db_session
    
    # ==================== LEARNER MANAGEMENT ====================
    def get_assigned_learners(self, mentor_id: int):
        """Get learners assigned to this mentor"""
        session = self._get_session()
        try:
            # Get practice sessions where this mentor is assigned
            sessions = session.query(PracticeSessionModel)\
                .filter_by(mentor_id=mentor_id)\
                .all()
            
            learner_ids = set([s.user_id for s in sessions])
            learners = session.query(UserModel)\
                .filter(UserModel.id.in_(learner_ids))\
                .all()
            return learners
        finally:
            session.close()
    
    def get_learner_sessions(self, mentor_id: int, learner_id: int):
        """Get sessions with a specific learner"""
        session = self._get_session()
        try:
            sessions = session.query(PracticeSessionModel)\
                .filter_by(mentor_id=mentor_id, user_id=learner_id)\
                .order_by(PracticeSessionModel.created_at.desc())\
                .all()
            return sessions
        finally:
            session.close()
    
    # ==================== FEEDBACK ====================
    def provide_feedback(self, mentor_id: int, session_id: int, feedback_data: dict):
        """Provide feedback for a practice session"""
        session = self._get_session()
        try:
            practice = session.query(PracticeSessionModel).get(session_id)
            if practice:
                practice.ai_feedback = str(feedback_data)  # JSON stringify
                session.commit()
            return practice
        finally:
            session.close()
    
    def create_learner_feedback(self, mentor_id: int, learner_id: int, data: dict):
        """Create general feedback for a learner"""
        session = self._get_session()
        try:
            feedback = FeedbackModel(
                user_id=learner_id,
                mentor_id=mentor_id,
                content=data.get('content'),
                rating=data.get('rating'),
                feedback_type=data.get('type', 'general'),
                created_at=datetime.now()
            )
            session.add(feedback)
            session.commit()
            return feedback
        finally:
            session.close()
    
    # ==================== ASSESSMENT ====================
    def assess_learner(self, mentor_id: int, learner_id: int, assessment_data: dict):
        """Assess a learner's proficiency"""
        from infrastructure.models.assessment_model import AssessmentModel
        session = self._get_session()
        try:
            assessment = AssessmentModel(
                user_id=learner_id,
                assessment_type='mentor_evaluation',
                speaking_score=assessment_data.get('speaking'),
                pronunciation_score=assessment_data.get('pronunciation'),
                grammar_score=assessment_data.get('grammar'),
                vocabulary_score=assessment_data.get('vocabulary'),
                overall_score=assessment_data.get('overall'),
                determined_level=assessment_data.get('level'),
                ai_feedback=str(assessment_data.get('feedback', '')),
                is_completed=True,
                completed_at=datetime.now(),
                created_at=datetime.now()
            )
            session.add(assessment)
            session.commit()
            return assessment
        finally:
            session.close()
    
    # ==================== RESOURCES ====================
    def get_resources(self, mentor_id: int):
        """Get mentor's shared resources (placeholder)"""
        # TODO: Implement when ResourceModel is created
        return []
    
    def share_resource(self, mentor_id: int, resource_data: dict):
        """Share a resource with learners (placeholder)"""
        # TODO: Implement when ResourceModel is created
        return None
    
    # ==================== DASHBOARD STATS ====================
    def get_dashboard_stats(self, mentor_id: int):
        """Get mentor dashboard statistics"""
        session = self._get_session()
        try:
            # Count assigned learners
            sessions = session.query(PracticeSessionModel)\
                .filter_by(mentor_id=mentor_id)\
                .all()
            
            learner_ids = set([s.user_id for s in sessions])
            total_sessions = len(sessions)
            completed_sessions = len([s for s in sessions if s.is_completed])
            
            return {
                'total_learners': len(learner_ids),
                'total_sessions': total_sessions,
                'completed_sessions': completed_sessions,
                'pending_sessions': total_sessions - completed_sessions
            }
        finally:
            session.close()
