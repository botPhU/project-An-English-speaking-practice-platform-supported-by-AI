"""
Mentor Feedback Service
Business logic for mentor feedback and assessments
"""
from datetime import datetime
from typing import List, Dict, Optional
from sqlalchemy import desc
from infrastructure.databases.mssql import get_db_session
from infrastructure.models.mentor_feedback_model import MentorFeedbackModel
from infrastructure.models.practice_session_model import PracticeSessionModel
from infrastructure.models.progress_model import ProgressModel
from services.notification_service import NotificationService


class MentorFeedbackService:
    """Service for managing mentor feedback"""
    
    def __init__(self):
        self.notification_service = NotificationService()
    
    def create_feedback(self, data: Dict) -> Dict:
        """Create new feedback from mentor"""
        session = get_db_session()
        try:
            feedback = MentorFeedbackModel(
                mentor_id=data['mentor_id'],
                learner_id=data['learner_id'],
                session_id=data.get('session_id'),
                pronunciation_score=data.get('pronunciation_score'),
                grammar_score=data.get('grammar_score'),
                vocabulary_score=data.get('vocabulary_score'),
                fluency_score=data.get('fluency_score'),
                overall_score=data.get('overall_score'),
                strengths=data.get('strengths'),
                improvements=data.get('improvements'),
                recommendations=data.get('recommendations'),
                created_at=datetime.now()
            )
            session.add(feedback)
            session.commit()
            session.refresh(feedback)
            
            # Notify learner
            self.notification_service.notify_mentor_feedback(
                data['learner_id'],
                feedback.mentor.full_name if feedback.mentor else 'Mentor'
            )
            
            return {'success': True, 'feedback': feedback.to_dict()}
        except Exception as e:
            session.rollback()
            print(f"[FeedbackService] Error creating feedback: {e}")
            return {'error': str(e)}
        finally:
            session.close()
    
    def get_learner_feedbacks(self, learner_id: int, limit: int = 20) -> List[Dict]:
        """Get all feedbacks for a learner"""
        session = get_db_session()
        try:
            feedbacks = session.query(MentorFeedbackModel).filter(
                MentorFeedbackModel.learner_id == learner_id
            ).order_by(desc(MentorFeedbackModel.created_at)).limit(limit).all()
            
            return [f.to_dict() for f in feedbacks]
        except Exception as e:
            print(f"[FeedbackService] Error getting feedbacks: {e}")
            return []
        finally:
            session.close()
    
    def get_mentor_sent_feedbacks(self, mentor_id: int, limit: int = 20) -> List[Dict]:
        """Get all feedbacks sent by a mentor"""
        session = get_db_session()
        try:
            feedbacks = session.query(MentorFeedbackModel).filter(
                MentorFeedbackModel.mentor_id == mentor_id
            ).order_by(desc(MentorFeedbackModel.created_at)).limit(limit).all()
            
            return [f.to_dict() for f in feedbacks]
        except Exception as e:
            print(f"[FeedbackService] Error getting sent feedbacks: {e}")
            return []
        finally:
            session.close()
    
    def get_learner_progress(self, learner_id: int) -> Dict:
        """Get comprehensive progress data for a learner (for mentor view)"""
        session = get_db_session()
        try:
            # Get practice sessions
            sessions = session.query(PracticeSessionModel).filter(
                PracticeSessionModel.user_id == learner_id
            ).order_by(desc(PracticeSessionModel.started_at)).limit(20).all()
            
            # Get feedbacks
            feedbacks = session.query(MentorFeedbackModel).filter(
                MentorFeedbackModel.learner_id == learner_id
            ).order_by(desc(MentorFeedbackModel.created_at)).limit(10).all()
            
            # Calculate averages from feedbacks
            if feedbacks:
                avg_pronunciation = sum(f.pronunciation_score or 0 for f in feedbacks) / len(feedbacks)
                avg_grammar = sum(f.grammar_score or 0 for f in feedbacks) / len(feedbacks)
                avg_vocabulary = sum(f.vocabulary_score or 0 for f in feedbacks) / len(feedbacks)
                avg_fluency = sum(f.fluency_score or 0 for f in feedbacks) / len(feedbacks)
                avg_overall = sum(f.overall_score or 0 for f in feedbacks) / len(feedbacks)
            else:
                avg_pronunciation = avg_grammar = avg_vocabulary = avg_fluency = avg_overall = 0
            
            # Get progress record
            progress = session.query(ProgressModel).filter(
                ProgressModel.user_id == learner_id
            ).first()
            
            return {
                'learner_id': learner_id,
                'total_sessions': len(sessions),
                'recent_sessions': [
                    {
                        'id': s.id,
                        'topic': s.topic,
                        'started_at': s.started_at.isoformat() if s.started_at else None,
                        'status': s.status,
                        'overall_score': s.overall_score
                    } for s in sessions[:5]
                ],
                'skill_averages': {
                    'pronunciation': round(avg_pronunciation, 1),
                    'grammar': round(avg_grammar, 1),
                    'vocabulary': round(avg_vocabulary, 1),
                    'fluency': round(avg_fluency, 1),
                    'overall': round(avg_overall, 1)
                },
                'total_feedbacks': len(feedbacks),
                'recent_feedbacks': [f.to_dict() for f in feedbacks[:3]],
                'current_level': progress.current_level if progress else 'Beginner',
                'total_practice_minutes': progress.total_practice_minutes if progress else 0,
                'streak_days': progress.streak_days if progress else 0
            }
        except Exception as e:
            print(f"[FeedbackService] Error getting learner progress: {e}")
            return {'error': str(e)}
        finally:
            session.close()


# Singleton instance
mentor_feedback_service = MentorFeedbackService()
