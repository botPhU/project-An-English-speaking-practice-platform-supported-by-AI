"""
Report Service for AESP Platform
Analytics and reporting for Admin, Learner, and Mentor
"""

from datetime import datetime, timedelta
from typing import Dict, Any, List
from sqlalchemy import func

from infrastructure.models.user_model import UserModel
from infrastructure.models.purchase_model import PurchaseModel
from infrastructure.models.progress_model import ProgressModel
from infrastructure.models.practice_session_model import PracticeSessionModel
from infrastructure.models.assessment_model import AssessmentModel
from infrastructure.databases.mssql import session


class ReportService:
    """Service for generating reports and analytics"""
    
    # ==================== ADMIN REPORTS ====================
    
    @staticmethod
    def get_admin_dashboard_stats() -> Dict[str, Any]:
        """Get overall statistics for admin dashboard"""
        try:
            # User counts by role
            total_users = session.query(func.count(UserModel.id)).scalar() or 0
            learners = session.query(func.count(UserModel.id)).filter(
                UserModel.role == 'learner'
            ).scalar() or 0
            mentors = session.query(func.count(UserModel.id)).filter(
                UserModel.role == 'mentor'
            ).scalar() or 0
            admins = session.query(func.count(UserModel.id)).filter(
                UserModel.role == 'admin'
            ).scalar() or 0
            
            # Revenue stats
            total_revenue = session.query(
                func.sum(PurchaseModel.amount)
            ).filter(
                PurchaseModel.status == 'completed'
            ).scalar() or 0
            
            # This month revenue
            month_start = datetime.now().replace(day=1, hour=0, minute=0, second=0)
            monthly_revenue = session.query(
                func.sum(PurchaseModel.amount)
            ).filter(
                PurchaseModel.status == 'completed',
                PurchaseModel.created_at >= month_start
            ).scalar() or 0
            
            # Session stats
            total_sessions = session.query(
                func.count(PracticeSessionModel.id)
            ).scalar() or 0
            
            return {
                'users': {
                    'total': total_users,
                    'learners': learners,
                    'mentors': mentors,
                    'admins': admins
                },
                'revenue': {
                    'total': float(total_revenue),
                    'this_month': float(monthly_revenue)
                },
                'sessions': {
                    'total': total_sessions
                },
                'generated_at': datetime.now().isoformat()
            }
        except Exception as e:
            return {'error': str(e)}
    
    @staticmethod
    def get_revenue_report(
        start_date: datetime = None,
        end_date: datetime = None
    ) -> Dict[str, Any]:
        """Get detailed revenue report"""
        if not start_date:
            start_date = datetime.now() - timedelta(days=30)
        if not end_date:
            end_date = datetime.now()
        
        try:
            purchases = session.query(PurchaseModel).filter(
                PurchaseModel.status == 'completed',
                PurchaseModel.created_at >= start_date,
                PurchaseModel.created_at <= end_date
            ).all()
            
            total = sum(p.amount for p in purchases)
            
            # Group by payment method
            by_method = {}
            for p in purchases:
                method = p.payment_method or 'unknown'
                by_method[method] = by_method.get(method, 0) + p.amount
            
            return {
                'total_revenue': float(total),
                'transaction_count': len(purchases),
                'average_transaction': float(total / len(purchases)) if purchases else 0,
                'by_payment_method': by_method,
                'period': {
                    'start': start_date.isoformat(),
                    'end': end_date.isoformat()
                }
            }
        except Exception as e:
            return {'error': str(e)}
    
    @staticmethod
    def get_user_growth_report(days: int = 30) -> Dict[str, Any]:
        """Get user registration growth over time"""
        try:
            start_date = datetime.now() - timedelta(days=days)
            
            new_users = session.query(UserModel).filter(
                UserModel.created_at >= start_date
            ).all()
            
            # Group by date
            daily_signups = {}
            for user in new_users:
                if user.created_at:
                    date_str = user.created_at.strftime('%Y-%m-%d')
                    daily_signups[date_str] = daily_signups.get(date_str, 0) + 1
            
            return {
                'new_users_total': len(new_users),
                'daily_signups': daily_signups,
                'days': days
            }
        except Exception as e:
            return {'error': str(e)}
    
    # ==================== LEARNER REPORTS ====================
    
    @staticmethod
    def get_learner_progress_report(user_id: int) -> Dict[str, Any]:
        """Get detailed progress report for a learner"""
        try:
            progress = session.query(ProgressModel).filter_by(
                user_id=user_id
            ).first()
            
            if not progress:
                return {'error': 'No progress data found'}
            
            # Get recent sessions
            recent_sessions = session.query(PracticeSessionModel).filter(
                PracticeSessionModel.user_id == user_id,
                PracticeSessionModel.is_completed == True
            ).order_by(
                PracticeSessionModel.ended_at.desc()
            ).limit(10).all()
            
            # Get assessments
            assessments = session.query(AssessmentModel).filter(
                AssessmentModel.user_id == user_id,
                AssessmentModel.is_completed == True
            ).order_by(
                AssessmentModel.completed_at.desc()
            ).all()
            
            return {
                'overall_score': progress.overall_score,
                'scores': {
                    'vocabulary': progress.vocabulary_score,
                    'grammar': progress.grammar_score,
                    'pronunciation': progress.pronunciation_score,
                    'fluency': progress.fluency_score
                },
                'streak': {
                    'current': progress.current_streak,
                    'longest': progress.longest_streak
                },
                'stats': {
                    'total_sessions': progress.total_sessions,
                    'practice_hours': progress.total_practice_hours,
                    'words_learned': progress.words_learned,
                    'xp_points': progress.xp_points
                },
                'level': progress.current_level,
                'recent_sessions': [
                    {
                        'id': s.id,
                        'topic': s.topic,
                        'score': s.overall_score,
                        'date': s.ended_at.isoformat() if s.ended_at else None
                    } for s in recent_sessions
                ],
                'assessments': [
                    {
                        'id': a.id,
                        'type': a.assessment_type,
                        'level': a.determined_level,
                        'score': a.overall_score,
                        'date': a.completed_at.isoformat() if a.completed_at else None
                    } for a in assessments
                ]
            }
        except Exception as e:
            return {'error': str(e)}
    
    @staticmethod
    def get_learner_weekly_report(user_id: int) -> Dict[str, Any]:
        """Get weekly progress summary for a learner"""
        try:
            week_ago = datetime.now() - timedelta(days=7)
            
            sessions = session.query(PracticeSessionModel).filter(
                PracticeSessionModel.user_id == user_id,
                PracticeSessionModel.is_completed == True,
                PracticeSessionModel.ended_at >= week_ago
            ).all()
            
            total_time = sum(s.duration_minutes or 0 for s in sessions)
            avg_score = sum(s.overall_score or 0 for s in sessions) / len(sessions) if sessions else 0
            
            return {
                'period': 'weekly',
                'sessions_completed': len(sessions),
                'total_practice_time': total_time,
                'average_score': round(avg_score, 1),
                'start_date': week_ago.isoformat(),
                'end_date': datetime.now().isoformat()
            }
        except Exception as e:
            return {'error': str(e)}
    
    # ==================== MENTOR REPORTS ====================
    
    @staticmethod
    def get_mentor_performance_report(mentor_id: int) -> Dict[str, Any]:
        """Get performance report for a mentor"""
        try:
            # Sessions conducted
            sessions = session.query(PracticeSessionModel).filter(
                PracticeSessionModel.mentor_id == mentor_id,
                PracticeSessionModel.is_completed == True
            ).all()
            
            # Average rating from feedback (simplified)
            total_sessions = len(sessions)
            
            return {
                'total_sessions': total_sessions,
                'total_learners': len(set(s.user_id for s in sessions)),
                'average_session_duration': sum(s.duration_minutes or 0 for s in sessions) / total_sessions if total_sessions else 0
            }
        except Exception as e:
            return {'error': str(e)}
