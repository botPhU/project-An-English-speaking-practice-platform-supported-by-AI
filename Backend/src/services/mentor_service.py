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
        """Get mentor dashboard statistics with REAL data"""
        session = self._get_session()
        try:
            from sqlalchemy import func
            from datetime import datetime, timedelta
            from infrastructure.models.mentor_assignment_model import MentorAssignmentModel
            
            # Get assigned learners count
            try:
                from infrastructure.models.mentor_assignment_model import MentorAssignmentModel
                total_learners = session.query(MentorAssignmentModel)\
                    .filter_by(mentor_id=mentor_id, status='active')\
                    .count()
            except:
                # Fallback: count unique learners from sessions
                sessions_all = session.query(PracticeSessionModel)\
                    .filter_by(mentor_id=mentor_id)\
                    .all()
                total_learners = len(set([s.user_id for s in sessions_all]))
            
            # Get sessions this week
            today = datetime.now()
            week_start = today - timedelta(days=today.weekday())
            sessions_this_week = session.query(PracticeSessionModel)\
                .filter(
                    PracticeSessionModel.mentor_id == mentor_id,
                    PracticeSessionModel.created_at >= week_start
                ).count()
            
            # Get sessions today
            today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
            sessions_today = session.query(PracticeSessionModel)\
                .filter(
                    PracticeSessionModel.mentor_id == mentor_id,
                    PracticeSessionModel.created_at >= today_start
                ).count()
            
            # Get average rating from reviews
            avg_rating = None
            total_reviews = 0
            try:
                from infrastructure.models.review_model import ReviewModel
                rating_result = session.query(
                    func.avg(ReviewModel.rating),
                    func.count(ReviewModel.id)
                ).filter_by(mentor_id=mentor_id).first()
                
                if rating_result and rating_result[0]:
                    avg_rating = round(float(rating_result[0]), 1)
                    total_reviews = rating_result[1]
            except Exception as e:
                print(f"[MENTOR_STATS] Reviews error: {e}")
                avg_rating = None
            
            # Calculate hours this month from completed sessions
            month_start = today.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            completed_sessions = session.query(PracticeSessionModel)\
                .filter(
                    PracticeSessionModel.mentor_id == mentor_id,
                    PracticeSessionModel.is_completed == True,
                    PracticeSessionModel.created_at >= month_start
                ).all()
            
            total_minutes = sum([s.duration_minutes or 0 for s in completed_sessions])
            hours_this_month = round(total_minutes / 60, 1)
            
            # Get upcoming sessions from bookings
            upcoming_sessions = []
            try:
                from infrastructure.models.mentor_booking_model import MentorBookingModel
                bookings = session.query(MentorBookingModel)\
                    .filter(
                        MentorBookingModel.mentor_id == mentor_id,
                        MentorBookingModel.status.in_(['pending', 'confirmed']),
                        MentorBookingModel.scheduled_date >= today.date()
                    )\
                    .order_by(MentorBookingModel.scheduled_date, MentorBookingModel.scheduled_time)\
                    .limit(5)\
                    .all()
                
                for b in bookings:
                    upcoming_sessions.append({
                        'id': b.id,
                        'learner_name': b.learner.full_name if b.learner else 'Học viên',
                        'topic': b.topic or 'Chưa xác định',
                        'scheduled_time': str(b.scheduled_time) if b.scheduled_time else '',
                        'scheduled_date': str(b.scheduled_date) if b.scheduled_date else '',
                        'level': 'Intermediate',
                        'status': b.status
                    })
            except Exception as e:
                print(f"[MENTOR_STATS] Bookings error: {e}")
            
            # Get recent feedback needing review
            recent_feedback = []
            try:
                pending_feedback = session.query(PracticeSessionModel)\
                    .filter(
                        PracticeSessionModel.mentor_id == mentor_id,
                        PracticeSessionModel.is_completed == True
                    )\
                    .order_by(PracticeSessionModel.created_at.desc())\
                    .limit(5)\
                    .all()
                
                for f in pending_feedback:
                    learner = session.query(UserModel).get(f.user_id)
                    recent_feedback.append({
                        'id': f.id,
                        'learner_name': learner.full_name if learner else 'Học viên',
                        'type': f.session_type or 'Speaking',
                        'description': f.topic or 'Phiên luyện tập',
                        'status': 'reviewed' if f.ai_feedback else 'pending'
                    })
            except Exception as e:
                print(f"[MENTOR_STATS] Feedback error: {e}")
            
            return {
                'total_learners': total_learners,
                'sessions_this_week': sessions_this_week,
                'sessions_today': sessions_today,
                'avg_rating': avg_rating,
                'total_reviews': total_reviews,
                'hours_this_month': hours_this_month,
                'upcoming_sessions': upcoming_sessions,
                'recent_feedback': recent_feedback
            }
        except Exception as e:
            print(f"[MENTOR_STATS] Error: {e}")
            return {
                'total_learners': 0,
                'sessions_this_week': 0,
                'sessions_today': 0,
                'avg_rating': None,
                'hours_this_month': 0,
                'upcoming_sessions': [],
                'recent_feedback': []
            }
        finally:
            session.close()
