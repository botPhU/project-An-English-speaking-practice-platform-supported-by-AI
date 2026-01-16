from infrastructure.models.progress_model import ProgressModel
from infrastructure.models.practice_session_model import PracticeSessionModel
from infrastructure.models.assessment_model import AssessmentModel
from infrastructure.models.user_model import UserModel
from infrastructure.models.learner_profile_model import LearnerProfileModel
from infrastructure.databases.mssql import session as db_session, get_db_session
from datetime import datetime
import json

class LearnerService:
    """Service for Learner-specific business logic"""
    
    def __init__(self):
        pass
    
    def _get_session(self):
        """Get database session"""
        return db_session
    
    # ==================== PROGRESS ====================
    def get_progress(self, user_id: int):
        """Get learner's progress data"""
        session = self._get_session()
        try:
            progress = session.query(ProgressModel).filter_by(user_id=user_id).first()
            if not progress:
                # Create initial progress record
                progress = ProgressModel(
                    user_id=user_id,
                    current_level='beginner',
                    created_at=datetime.now(),
                    updated_at=datetime.now()
                )
                session.add(progress)
                session.commit()
            return progress
        finally:
            session.close()
    
    def update_progress(self, user_id: int, data: dict):
        """Update learner's progress"""
        session = self._get_session()
        try:
            progress = session.query(ProgressModel).filter_by(user_id=user_id).first()
            if progress:
                for key, value in data.items():
                    if hasattr(progress, key):
                        setattr(progress, key, value)
                progress.updated_at = datetime.now()
                session.commit()
            return progress
        finally:
            session.close()
    
    # ==================== PRACTICE SESSIONS ====================
    def get_practice_sessions(self, user_id: int, limit: int = 10):
        """Get learner's practice session history"""
        session = self._get_session()
        try:
            sessions = session.query(PracticeSessionModel)\
                .filter_by(user_id=user_id)\
                .order_by(PracticeSessionModel.created_at.desc())\
                .limit(limit)\
                .all()
            return sessions
        finally:
            session.close()
    
    def create_practice_session(self, user_id: int, data: dict):
        """Start a new practice session"""
        session = self._get_session()
        try:
            practice = PracticeSessionModel(
                user_id=user_id,
                session_type=data.get('session_type', 'ai_only'),
                topic=data.get('topic'),
                scenario=data.get('scenario'),
                started_at=datetime.now(),
                created_at=datetime.now()
            )
            session.add(practice)
            session.commit()
            return practice
        finally:
            session.close()
    
    def complete_practice_session(self, session_id: int, scores: dict):
        """Complete a practice session with scores"""
        session = self._get_session()
        try:
            practice = session.query(PracticeSessionModel).get(session_id)
            if practice:
                practice.pronunciation_score = scores.get('pronunciation')
                practice.grammar_score = scores.get('grammar')
                practice.vocabulary_score = scores.get('vocabulary')
                practice.fluency_score = scores.get('fluency')
                practice.overall_score = scores.get('overall')
                practice.is_completed = True
                practice.ended_at = datetime.now()
                session.commit()
            return practice
        finally:
            session.close()
    
    # ==================== ASSESSMENTS ====================
    def get_assessments(self, user_id: int):
        """Get all assessments for a learner"""
        session = self._get_session()
        try:
            assessments = session.query(AssessmentModel)\
                .filter_by(user_id=user_id)\
                .order_by(AssessmentModel.created_at.desc())\
                .all()
            return assessments
        finally:
            session.close()
    
    def create_assessment(self, user_id: int, assessment_type: str):
        """Create a new assessment"""
        session = self._get_session()
        try:
            assessment = AssessmentModel(
                user_id=user_id,
                assessment_type=assessment_type,
                created_at=datetime.now()
            )
            session.add(assessment)
            session.commit()
            return assessment
        finally:
            session.close()
    
    def complete_assessment(self, assessment_id: int, results: dict):
        """Complete an assessment with results"""
        session = self._get_session()
        try:
            assessment = session.query(AssessmentModel).get(assessment_id)
            if assessment:
                assessment.listening_score = results.get('listening')
                assessment.speaking_score = results.get('speaking')
                assessment.pronunciation_score = results.get('pronunciation')
                assessment.vocabulary_score = results.get('vocabulary')
                assessment.grammar_score = results.get('grammar')
                assessment.overall_score = results.get('overall')
                assessment.determined_level = results.get('level')
                assessment.is_completed = True
                assessment.completed_at = datetime.now()
                session.commit()
            return assessment
        finally:
            session.close()
    
    # ==================== DASHBOARD STATS ====================
    def get_dashboard_stats(self, user_id: int):
        """Get learner dashboard statistics from database"""
        try:
            with get_db_session() as session:
                # Query progress data
                progress = session.query(ProgressModel).filter_by(user_id=user_id).first()
                
                # Query recent sessions count
                from sqlalchemy import func
                recent_count = session.query(func.count(PracticeSessionModel.id))\
                    .filter_by(user_id=user_id, is_completed=True).scalar() or 0
                
                if progress:
                    return {
                        'user_id': user_id,
                        'overall_score': progress.overall_score or 0,
                        'current_level': progress.current_level or 'beginner',
                        'total_sessions': progress.total_sessions or 0,
                        'current_streak': progress.current_streak or 0,
                        'xp_points': progress.xp_points or 0,
                        'recent_sessions': recent_count,
                        'skills': {
                            'vocabulary': progress.vocabulary_score or 0,
                            'grammar': progress.grammar_score or 0,
                            'pronunciation': progress.pronunciation_score or 0,
                            'fluency': progress.fluency_score or 0
                        },
                        'weekly_goal': {'target': 5, 'completed': min(progress.current_streak or 0, 5)},
                        'next_milestone': {'name': self._get_next_level(progress.current_level), 'progress': progress.overall_score or 0}
                    }
                else:
                    # Create default progress for new user
                    return {
                        'user_id': user_id,
                        'overall_score': 0,
                        'current_level': 'beginner',
                        'total_sessions': 0,
                        'current_streak': 0,
                        'xp_points': 0,
                        'recent_sessions': 0,
                        'skills': {'vocabulary': 0, 'grammar': 0, 'pronunciation': 0, 'fluency': 0},
                        'weekly_goal': {'target': 5, 'completed': 0},
                        'next_milestone': {'name': 'A1 Level', 'progress': 0}
                    }
        except Exception as e:
            print(f"Dashboard stats error: {e}")
            return {'user_id': user_id, 'error': str(e)}

    def _get_next_level(self, current_level: str) -> str:
        """Get next English level"""
        levels = ['beginner', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2']
        try:
            idx = levels.index(current_level)
            return levels[idx + 1] if idx < len(levels) - 1 else 'Master'
        except ValueError:
            return 'A1'

    # ==================== PROFILE ====================
    def get_profile(self, user_id: int):
        """Get learner's profile from database"""
        try:
            with get_db_session() as session:
                # Query user data
                user = session.query(UserModel).filter_by(id=user_id).first()
                if not user:
                    return {'error': 'User not found'}
                
                # Query learner profile (or create if not exists)
                profile = session.query(LearnerProfileModel).filter_by(user_id=user_id).first()
                
                # Query progress for level info
                progress = session.query(ProgressModel).filter_by(user_id=user_id).first()
                
                # Parse learning goals from JSON
                learning_goals = []
                if profile and profile.learning_goals:
                    try:
                        learning_goals = json.loads(profile.learning_goals)
                    except json.JSONDecodeError:
                        learning_goals = []
                
                return {
                    'id': user.id,
                    'full_name': user.full_name or user.user_name,
                    'username': user.user_name,
                    'email': user.email,
                    'avatar': f'https://api.dicebear.com/7.x/avataaars/svg?seed={user.user_name}',
                    'current_level': progress.current_level if progress else 'beginner',
                    'current_streak': progress.current_streak if progress else 0,
                    'xp_points': progress.xp_points if progress else 0,
                    'target_level': profile.target_level if profile else 'C1',
                    'progress_to_target': self._calculate_level_progress(progress) if progress else 0,
                    'native_language': profile.native_language if profile else 'vi',
                    'timezone': profile.timezone if profile else 'Asia/Ho_Chi_Minh',
                    'member_since': user.created_at.strftime('%B %Y') if user.created_at else 'Unknown',
                    'learning_goals': learning_goals,
                    'correction_style': profile.correction_style if profile else 'gentle',
                    'daily_goal_minutes': profile.daily_goal_minutes if profile else 30,
                    'voice_calibration_date': profile.voice_calibrated_at.strftime('%d/%m/%Y') if profile and profile.voice_calibrated_at else None,
                    'profile_visibility': profile.profile_visibility if profile else 'public',
                    'show_progress': profile.show_progress if profile else True
                }
        except Exception as e:
            # Fallback to mock data if database error
            print(f"Database error: {e}")
            return {
                'id': user_id,
                'full_name': 'Guest User',
                'username': 'guest',
                'email': 'guest@example.com',
                'current_level': 'beginner',
                'error_message': str(e)
            }

    def _calculate_level_progress(self, progress) -> int:
        """Calculate progress percentage to next level"""
        level_thresholds = {'beginner': 0, 'A1': 20, 'A2': 35, 'B1': 50, 'B2': 65, 'C1': 80, 'C2': 95}
        if not progress or not progress.overall_score:
            return 0
        return min(int(progress.overall_score), 100)

    def update_profile(self, user_id: int, data: dict):
        """Update learner's profile in database"""
        try:
            with get_db_session() as session:
                # Update user basic info
                user = session.query(UserModel).filter_by(id=user_id).first()
                if not user:
                    return {'success': False, 'error': 'User not found'}
                
                # Update user fields
                if 'full_name' in data:
                    user.full_name = data['full_name']
                if 'email' in data:
                    user.email = data['email']
                user.updated_at = datetime.now()
                
                # Get or create learner profile
                profile = session.query(LearnerProfileModel).filter_by(user_id=user_id).first()
                if not profile:
                    profile = LearnerProfileModel(user_id=user_id, created_at=datetime.now())
                    session.add(profile)
                
                # Update profile fields
                if 'native_language' in data:
                    profile.native_language = data['native_language']
                if 'timezone' in data:
                    profile.timezone = data['timezone']
                if 'target_level' in data:
                    profile.target_level = data['target_level']
                profile.updated_at = datetime.now()
                
                return {'success': True, 'message': 'Profile updated'}
        except Exception as e:
            return {'success': False, 'error': str(e)}

    def update_learning_goals(self, user_id: int, data: dict):
        """Update learning goals and preferences in database"""
        try:
            with get_db_session() as session:
                profile = session.query(LearnerProfileModel).filter_by(user_id=user_id).first()
                if not profile:
                    profile = LearnerProfileModel(user_id=user_id, created_at=datetime.now())
                    session.add(profile)
                
                if 'goals' in data:
                    profile.learning_goals = json.dumps(data['goals'])
                if 'correction_style' in data:
                    profile.correction_style = data['correction_style']
                if 'daily_goal_minutes' in data:
                    profile.daily_goal_minutes = data['daily_goal_minutes']
                if 'preferred_time' in data:
                    profile.preferred_time = data['preferred_time']
                profile.updated_at = datetime.now()
                
                return {'success': True, 'message': 'Learning goals updated'}
        except Exception as e:
            return {'success': False, 'error': str(e)}

    def update_voice_calibration(self, user_id: int, data: dict):
        """Update voice calibration in database"""
        try:
            with get_db_session() as session:
                profile = session.query(LearnerProfileModel).filter_by(user_id=user_id).first()
                if not profile:
                    profile = LearnerProfileModel(user_id=user_id, created_at=datetime.now())
                    session.add(profile)
                
                if 'voice_sample_url' in data:
                    profile.voice_sample_url = data['voice_sample_url']
                profile.voice_calibrated_at = datetime.now()
                profile.updated_at = datetime.now()
                
                return {'success': True, 'message': 'Voice calibration updated'}
        except Exception as e:
            return {'success': False, 'error': str(e)}

    # ==================== TOPICS / AI ROLEPLAY ====================
    def get_topics(self, category: str = 'all'):
        """Get AI roleplay topics from database"""
        try:
            with get_db_session() as session:
                from infrastructure.models.learning_models import TopicModel
                query = session.query(TopicModel).filter_by(is_active=True)
                if category != 'all':
                    query = query.filter_by(category=category)
                topics = query.all()
                
                return [{
                    'id': t.id,
                    'title': t.title,
                    'description': t.description,
                    'category': t.category,
                    'difficulty': t.difficulty,
                    'icon': t.icon,
                    'color': t.color,
                    'duration': t.duration,
                    'xp_reward': t.xp_reward
                } for t in topics]
        except Exception as e:
            print(f"Topics error: {e}")
            return []

    def get_daily_challenge(self):
        """Get today's daily challenge from database"""
        try:
            with get_db_session() as session:
                from infrastructure.models.learning_models import TopicModel
                challenge = session.query(TopicModel)\
                    .filter_by(is_active=True, is_daily_challenge=True)\
                    .first()
                
                if challenge:
                    return {
                        'id': challenge.id,
                        'title': challenge.title,
                        'description': challenge.description,
                        'difficulty': challenge.difficulty,
                        'duration': challenge.duration,
                        'xp_reward': challenge.xp_reward,
                        'category': challenge.category
                    }
                else:
                    # Fallback if no daily challenge set
                    return {
                        'id': 0,
                        'title': 'Daily Practice',
                        'description': 'Complete any practice session today!',
                        'difficulty': 'beginner',
                        'duration': '10m',
                        'xp_reward': 100,
                        'category': 'general'
                    }
        except Exception as e:
            print(f"Daily challenge error: {e}")
            return {'id': 0, 'title': 'Error loading challenge', 'xp_reward': 0}

    def start_topic_session(self, user_id: int, topic_id: int):
        """Start AI roleplay session for a topic - creates practice session"""
        try:
            with get_db_session() as session:
                new_session = PracticeSessionModel(
                    user_id=user_id,
                    topic=str(topic_id),
                    session_type='ai_roleplay',
                    started_at=datetime.now(),
                    created_at=datetime.now()
                )
                session.add(new_session)
                session.flush()  # Get the ID
                return new_session.id
        except Exception as e:
            print(f"Start session error: {e}")
            return 0

    # ==================== ACHIEVEMENTS ====================
    def get_achievements(self, user_id: int):
        """Get learner's achievements from database"""
        try:
            with get_db_session() as session:
                from infrastructure.models.learning_models import AchievementModel, UserAchievementModel
                
                # Get progress for XP
                progress = session.query(ProgressModel).filter_by(user_id=user_id).first()
                total_xp = progress.xp_points if progress else 0
                
                # Get user's earned achievements
                user_achievements = session.query(UserAchievementModel)\
                    .filter_by(user_id=user_id).all()
                
                earned_ids = [ua.achievement_id for ua in user_achievements]
                
                # Get achievement details
                badges = []
                for ua in user_achievements:
                    achievement = session.query(AchievementModel).get(ua.achievement_id)
                    if achievement:
                        badges.append({
                            'id': achievement.id,
                            'name': achievement.name,
                            'icon': achievement.icon,
                            'description': achievement.description,
                            'earned_at': ua.earned_at.strftime('%d/%m/%Y') if ua.earned_at else None
                        })
                
                # Get next achievable badge
                next_badge = session.query(AchievementModel)\
                    .filter(AchievementModel.id.notin_(earned_ids))\
                    .filter_by(is_active=True)\
                    .first()
                
                return {
                    'total_badges': len(badges),
                    'total_xp': total_xp,
                    'badges': badges,
                    'next_badge': {
                        'name': next_badge.name if next_badge else 'All unlocked!',
                        'progress': min(total_xp % 1000 / 10, 100),
                        'requirement': next_badge.requirement if next_badge else None
                    } if next_badge else None
                }
        except Exception as e:
            print(f"Achievements error: {e}")
            return {'total_badges': 0, 'total_xp': 0, 'badges': [], 'next_badge': None}

    # ==================== MENTOR BOOKING ====================
    def get_available_mentors(self, specialty: str = 'all'):
        """Get available mentors from database"""
        try:
            with get_db_session() as session:
                # Query users with role='mentor'
                query = session.query(UserModel).filter_by(role='mentor', status=True)
                mentors = query.all()
                
                result = []
                for m in mentors:
                    mentor_data = {
                        'id': m.id,
                        'name': m.full_name or m.user_name,
                        'full_name': m.full_name or m.user_name,
                        'specialty': m.specialty or m.description or 'General English',
                        'bio': m.bio or 'Experienced English mentor.',
                        'rating': m.average_rating if m.average_rating else 5.0,
                        'review_count': m.review_count if m.review_count else 0,
                        'avatar': m.avatar_url or f'https://ui-avatars.com/api/?name={m.user_name}&background=random',
                        'available': True
                    }
                    # Filter by specialty if specified
                    if specialty == 'all' or specialty.lower() in mentor_data['specialty'].lower():
                        result.append(mentor_data)
                
                return result if result else []
        except Exception as e:
            print(f"Mentors error: {e}")
            return []

    def book_mentor_session(self, user_id: int, mentor_id: int, date_time: str):
        """Book a session with a mentor"""
        try:
            with get_db_session() as session:
                from infrastructure.models.learning_models import MentorBookingModel
                from datetime import datetime as dt
                
                booking = MentorBookingModel(
                    learner_id=user_id,
                    mentor_id=mentor_id,
                    scheduled_at=dt.strptime(date_time, '%Y-%m-%d %H:%M'),
                    status='pending',
                    created_at=datetime.now()
                )
                session.add(booking)
                session.flush()
                return booking.id
        except Exception as e:
            print(f"Booking error: {e}")
            return 0

    def get_mentor_sessions(self, user_id: int):
        """Get booked mentor sessions from database"""
        try:
            with get_db_session() as session:
                from infrastructure.models.learning_models import MentorBookingModel
                
                bookings = session.query(MentorBookingModel)\
                    .filter_by(learner_id=user_id)\
                    .order_by(MentorBookingModel.scheduled_at.desc())\
                    .all()
                
                result = []
                for b in bookings:
                    mentor = session.query(UserModel).get(b.mentor_id)
                    result.append({
                        'id': b.id,
                        'mentor': mentor.full_name if mentor else 'Unknown',
                        'date_time': b.scheduled_at.strftime('%d/%m/%Y %H:%M') if b.scheduled_at else None,
                        'topic': b.topic,
                        'status': b.status,
                        'rating': b.rating
                    })
                return result
        except Exception as e:
            print(f"Mentor sessions error: {e}")
            return []

    # ==================== SETTINGS ====================
    def get_settings(self, user_id: int):
        """Get learner's settings from database"""
        try:
            with get_db_session() as session:
                profile = session.query(LearnerProfileModel).filter_by(user_id=user_id).first()
                
                if profile:
                    return {
                        'notifications': {'email': True, 'push': True, 'reminders': True},
                        'privacy': {
                            'profile_visibility': profile.profile_visibility or 'public',
                            'show_progress': profile.show_progress if profile.show_progress is not None else True
                        },
                        'preferences': {
                            'correction_style': profile.correction_style or 'gentle',
                            'daily_goal': profile.daily_goal_minutes or 30,
                            'preferred_time': profile.preferred_time or 'morning',
                            'ai_voice': profile.ai_voice or 'female_us'
                        }
                    }
                else:
                    return {
                        'notifications': {'email': True, 'push': True, 'reminders': True},
                        'privacy': {'profile_visibility': 'public', 'show_progress': True},
                        'preferences': {'correction_style': 'gentle', 'daily_goal': 30, 'preferred_time': 'morning', 'ai_voice': 'female_us'}
                    }
        except Exception as e:
            print(f"Settings error: {e}")
            return {}

    def update_settings(self, user_id: int, data: dict):
        """Update learner's settings in database"""
        try:
            with get_db_session() as session:
                profile = session.query(LearnerProfileModel).filter_by(user_id=user_id).first()
                if not profile:
                    profile = LearnerProfileModel(user_id=user_id, created_at=datetime.now())
                    session.add(profile)
                
                if 'preferences' in data:
                    prefs = data['preferences']
                    if 'correction_style' in prefs:
                        profile.correction_style = prefs['correction_style']
                    if 'daily_goal' in prefs:
                        profile.daily_goal_minutes = prefs['daily_goal']
                    if 'preferred_time' in prefs:
                        profile.preferred_time = prefs['preferred_time']
                    if 'ai_voice' in prefs:
                        profile.ai_voice = prefs['ai_voice']
                
                profile.updated_at = datetime.now()
                return {'success': True, 'message': 'Settings updated'}
        except Exception as e:
            return {'success': False, 'error': str(e)}

    def update_privacy_settings(self, user_id: int, data: dict):
        """Update privacy settings in database"""
        try:
            with get_db_session() as session:
                profile = session.query(LearnerProfileModel).filter_by(user_id=user_id).first()
                if not profile:
                    profile = LearnerProfileModel(user_id=user_id, created_at=datetime.now())
                    session.add(profile)
                
                if 'profile_visibility' in data:
                    profile.profile_visibility = data['profile_visibility']
                if 'show_progress' in data:
                    profile.show_progress = data['show_progress']
                
                profile.updated_at = datetime.now()
                return {'success': True, 'message': 'Privacy settings updated'}
        except Exception as e:
            return {'success': False, 'error': str(e)}

    # ==================== MESSAGING ====================
    def send_message(self, sender_id: int, receiver_id: int, content: str):
        """Send a message to another user"""
        try:
            with get_db_session() as session:
                from infrastructure.models.message_model import MessageModel
                
                message = MessageModel(
                    sender_id=sender_id,
                    receiver_id=receiver_id,
                    content=content,
                    is_read=False,
                    created_at=datetime.now()
                )
                session.add(message)
                session.flush()
                
                # Get sender name
                sender = session.query(UserModel).get(sender_id)
                
                return {
                    'id': message.id,
                    'sender_id': sender_id,
                    'receiver_id': receiver_id,
                    'sender_name': sender.full_name if sender else 'Unknown',
                    'content': content,
                    'is_read': False,
                    'created_at': message.created_at.isoformat()
                }
        except Exception as e:
            print(f"Send message error: {e}")
            return {'error': str(e)}
    
    def get_messages(self, user_id: int, other_user_id: int = None):
        """Get messages for a user, optionally with specific user"""
        try:
            with get_db_session() as session:
                from infrastructure.models.message_model import MessageModel
                from sqlalchemy import or_, and_
                
                query = session.query(MessageModel)
                
                if other_user_id:
                    # Get conversation between two users
                    query = query.filter(
                        or_(
                            and_(MessageModel.sender_id == user_id, MessageModel.receiver_id == other_user_id),
                            and_(MessageModel.sender_id == other_user_id, MessageModel.receiver_id == user_id)
                        )
                    )
                else:
                    # Get all messages for user
                    query = query.filter(
                        or_(MessageModel.sender_id == user_id, MessageModel.receiver_id == user_id)
                    )
                
                messages = query.order_by(MessageModel.created_at.asc()).all()
                
                return [m.to_dict() for m in messages]
        except Exception as e:
            print(f"Get messages error: {e}")
            return []
    
    def mark_message_read(self, message_id: int):
        """Mark a message as read"""
        try:
            with get_db_session() as session:
                from infrastructure.models.message_model import MessageModel
                message = session.query(MessageModel).get(message_id)
                if message:
                    message.is_read = True
                    message.read_at = datetime.now()
                return {'success': True}
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def get_conversations(self, user_id: int):
        """Get list of conversations for a user"""
        try:
            with get_db_session() as session:
                from infrastructure.models.message_model import MessageModel
                from sqlalchemy import or_, func, distinct
                
                # Get unique users this person has messaged with
                subq = session.query(
                    func.case(
                        (MessageModel.sender_id == user_id, MessageModel.receiver_id),
                        else_=MessageModel.sender_id
                    ).label('other_user_id')
                ).filter(
                    or_(MessageModel.sender_id == user_id, MessageModel.receiver_id == user_id)
                ).distinct().subquery()
                
                other_ids = session.query(subq.c.other_user_id).all()
                
                conversations = []
                for (other_id,) in other_ids:
                    other_user = session.query(UserModel).get(other_id)
                    
                    # Get last message
                    last_message = session.query(MessageModel).filter(
                        or_(
                            and_(MessageModel.sender_id == user_id, MessageModel.receiver_id == other_id),
                            and_(MessageModel.sender_id == other_id, MessageModel.receiver_id == user_id)
                        )
                    ).order_by(MessageModel.created_at.desc()).first()
                    
                    # Count unread
                    unread_count = session.query(MessageModel).filter(
                        MessageModel.sender_id == other_id,
                        MessageModel.receiver_id == user_id,
                        MessageModel.is_read == False
                    ).count()
                    
                    if other_user:
                        conversations.append({
                            'user_id': other_id,
                            'user_name': other_user.full_name or other_user.user_name,
                            'avatar': f'https://api.dicebear.com/7.x/avataaars/svg?seed={other_user.user_name}',
                            'last_message': last_message.content[:50] if last_message else '',
                            'last_message_time': last_message.created_at.isoformat() if last_message else None,
                            'unread_count': unread_count
                        })
                
                return sorted(conversations, key=lambda x: x.get('last_message_time') or '', reverse=True)
        except Exception as e:
            print(f"Get conversations error: {e}")
            return []

    # ==================== ENHANCED BOOKING ====================
    def create_booking(self, data: dict):
        """Create a new mentor booking"""
        try:
            with get_db_session() as session:
                from infrastructure.models.mentor_booking_model import MentorBookingModel
                from datetime import date, time
                
                # Parse date and time
                scheduled_date = datetime.strptime(data.get('scheduled_date'), '%Y-%m-%d').date()
                scheduled_time = datetime.strptime(data.get('scheduled_time'), '%H:%M').time()
                
                booking = MentorBookingModel(
                    learner_id=data.get('learner_id'),
                    mentor_id=data.get('mentor_id'),
                    scheduled_date=scheduled_date,
                    scheduled_time=scheduled_time,
                    duration_minutes=data.get('duration_minutes', 30),
                    topic=data.get('topic'),
                    notes=data.get('notes'),
                    status='pending',
                    created_at=datetime.now()
                )
                session.add(booking)
                session.flush()
                
                # Get mentor name
                mentor = session.query(UserModel).get(data.get('mentor_id'))
                learner = session.query(UserModel).get(data.get('learner_id'))
                
                return {
                    'id': booking.id,
                    'learner_id': booking.learner_id,
                    'mentor_id': booking.mentor_id,
                    'learner_name': learner.full_name if learner else None,
                    'mentor_name': mentor.full_name if mentor else None,
                    'scheduled_date': str(scheduled_date),
                    'scheduled_time': str(scheduled_time),
                    'topic': booking.topic,
                    'status': booking.status
                }
        except Exception as e:
            print(f"Create booking error: {e}")
            return {'error': str(e)}
    
    def update_booking(self, booking_id: int, data: dict):
        """Update a booking status"""
        try:
            with get_db_session() as session:
                from infrastructure.models.mentor_booking_model import MentorBookingModel
                
                booking = session.query(MentorBookingModel).get(booking_id)
                if not booking:
                    return {'error': 'Booking not found'}
                
                if 'status' in data:
                    booking.status = data['status']
                    if data['status'] == 'confirmed':
                        booking.confirmed_at = datetime.now()
                    elif data['status'] == 'completed':
                        booking.completed_at = datetime.now()
                
                booking.updated_at = datetime.now()
                
                return booking.to_dict()
        except Exception as e:
            print(f"Update booking error: {e}")
            return {'error': str(e)}
    
    def get_bookings(self, user_id: int, role: str = 'learner'):
        """Get all bookings for a user"""
        try:
            with get_db_session() as session:
                from infrastructure.models.mentor_booking_model import MentorBookingModel
                
                if role == 'mentor':
                    bookings = session.query(MentorBookingModel).filter_by(mentor_id=user_id).all()
                else:
                    bookings = session.query(MentorBookingModel).filter_by(learner_id=user_id).all()
                
                return [b.to_dict() for b in bookings]
        except Exception as e:
            print(f"Get bookings error: {e}")
            return []
