"""
Study Buddy Service
Matching learners with similar levels for practice together
"""
from datetime import datetime
from typing import List, Dict, Optional
from sqlalchemy import and_, or_, func
from infrastructure.databases.mssql import get_db_session
from infrastructure.models.user_model import UserModel
from infrastructure.models.progress_model import ProgressModel


class StudyBuddyModel:
    """In-memory model for study buddy requests (can be persisted later)"""
    _requests = {}  # {user_id: {'level': str, 'topic': str, 'created_at': datetime}}
    _matches = {}   # {user_id: {'buddy_id': int, 'room_name': str, 'created_at': datetime}}


class StudyBuddyService:
    """Service for matching learners for study sessions"""
    
    @staticmethod
    def find_potential_buddies(user_id: int, level: str = None, limit: int = 10) -> List[Dict]:
        """Find potential study buddies based on similar level"""
        session = get_db_session()
        try:
            # Get current user's progress
            current_progress = session.query(ProgressModel).filter_by(user_id=user_id).first()
            current_level = current_progress.current_level if current_progress else 'beginner'
            
            if level:
                current_level = level
            
            # Find learners with similar levels
            query = session.query(UserModel, ProgressModel).join(
                ProgressModel, UserModel.id == ProgressModel.user_id, isouter=True
            ).filter(
                UserModel.role == 'learner',
                UserModel.id != user_id,
                UserModel.status == True
            )
            
            # Filter by similar level
            if current_level:
                # Allow adjacent levels for variety
                level_map = {
                    'beginner': ['beginner', 'elementary'],
                    'elementary': ['beginner', 'elementary', 'intermediate'],
                    'intermediate': ['elementary', 'intermediate', 'upper-intermediate'],
                    'upper-intermediate': ['intermediate', 'upper-intermediate', 'advanced'],
                    'advanced': ['upper-intermediate', 'advanced']
                }
                allowed_levels = level_map.get(current_level, [current_level])
                query = query.filter(
                    or_(
                        ProgressModel.current_level.in_(allowed_levels),
                        ProgressModel.current_level == None
                    )
                )
            
            results = query.limit(limit).all()
            
            buddies = []
            for user, progress in results:
                buddies.append({
                    'id': user.id,
                    'full_name': user.full_name,
                    'avatar_url': user.avatar_url,
                    'level': progress.current_level if progress else 'beginner',
                    'xp_points': progress.xp_points if progress else 0,
                    'current_streak': progress.current_streak if progress else 0,
                    'total_sessions': progress.total_sessions if progress else 0,
                    'is_online': self._is_user_online(user.id)
                })
            
            return buddies
        except Exception as e:
            print(f"[StudyBuddy] Error finding buddies: {e}")
            return []
        finally:
            session.close()
    
    @staticmethod
    def _is_user_online(user_id: int) -> bool:
        """Check if user is online (logged in recently)"""
        session = get_db_session()
        try:
            user = session.query(UserModel).filter_by(id=user_id).first()
            if user and user.last_login:
                # Consider online if logged in within last 10 minutes
                diff = (datetime.now() - user.last_login).total_seconds()
                return diff < 600
            return False
        finally:
            session.close()
    
    @staticmethod
    def request_buddy_match(user_id: int, topic: str = None, level: str = None) -> Dict:
        """Submit a request to find a study buddy"""
        session = get_db_session()
        try:
            # Get user's level if not specified
            if not level:
                progress = session.query(ProgressModel).filter_by(user_id=user_id).first()
                level = progress.current_level if progress else 'beginner'
            
            # Check if there's an existing match request
            for req_user_id, req_data in StudyBuddyModel._requests.items():
                if req_user_id != user_id and req_data['level'] == level:
                    # Found a match!
                    room_name = f"aesp-study-{req_user_id}-{user_id}-{int(datetime.now().timestamp())}"
                    
                    # Create match for both users
                    match_data = {
                        'buddy_id': user_id,
                        'room_name': room_name,
                        'topic': req_data.get('topic') or topic,
                        'created_at': datetime.now()
                    }
                    StudyBuddyModel._matches[req_user_id] = match_data
                    StudyBuddyModel._matches[user_id] = {
                        'buddy_id': req_user_id,
                        'room_name': room_name,
                        'topic': req_data.get('topic') or topic,
                        'created_at': datetime.now()
                    }
                    
                    # Remove the waiting request
                    del StudyBuddyModel._requests[req_user_id]
                    
                    # Get buddy info
                    buddy = session.query(UserModel).filter_by(id=req_user_id).first()
                    
                    return {
                        'matched': True,
                        'buddy': {
                            'id': buddy.id,
                            'full_name': buddy.full_name,
                            'avatar_url': buddy.avatar_url
                        } if buddy else None,
                        'room_name': room_name,
                        'topic': req_data.get('topic') or topic
                    }
            
            # No immediate match, add to waiting list
            StudyBuddyModel._requests[user_id] = {
                'level': level,
                'topic': topic,
                'created_at': datetime.now()
            }
            
            return {
                'matched': False,
                'message': 'Đang tìm kiếm bạn học phù hợp...',
                'position': len(StudyBuddyModel._requests)
            }
        except Exception as e:
            print(f"[StudyBuddy] Error requesting match: {e}")
            return {'error': str(e)}
        finally:
            session.close()
    
    @staticmethod
    def check_match_status(user_id: int) -> Dict:
        """Check if user has been matched"""
        if user_id in StudyBuddyModel._matches:
            match = StudyBuddyModel._matches[user_id]
            session = get_db_session()
            try:
                buddy = session.query(UserModel).filter_by(id=match['buddy_id']).first()
                return {
                    'matched': True,
                    'buddy': {
                        'id': buddy.id,
                        'full_name': buddy.full_name,
                        'avatar_url': buddy.avatar_url
                    } if buddy else None,
                    'room_name': match['room_name'],
                    'topic': match.get('topic')
                }
            finally:
                session.close()
        
        if user_id in StudyBuddyModel._requests:
            return {
                'matched': False,
                'waiting': True,
                'position': list(StudyBuddyModel._requests.keys()).index(user_id) + 1
            }
        
        return {'matched': False, 'waiting': False}
    
    @staticmethod
    def cancel_request(user_id: int) -> bool:
        """Cancel a pending buddy request"""
        if user_id in StudyBuddyModel._requests:
            del StudyBuddyModel._requests[user_id]
            return True
        return False
    
    @staticmethod
    def end_session(user_id: int) -> bool:
        """End a study buddy session"""
        if user_id in StudyBuddyModel._matches:
            buddy_id = StudyBuddyModel._matches[user_id]['buddy_id']
            
            # Remove both matches
            if user_id in StudyBuddyModel._matches:
                del StudyBuddyModel._matches[user_id]
            if buddy_id in StudyBuddyModel._matches:
                del StudyBuddyModel._matches[buddy_id]
            
            return True
        return False
    
    @staticmethod
    def get_online_learners(user_id: int, level: str = None, limit: int = 20) -> list:
        """Get list of online learners for practice matching"""
        from api.websocket import get_online_learner_ids
        
        session = get_db_session()
        try:
            online_ids = get_online_learner_ids()
            # Filter out current user and convert to int
            online_ids = [int(uid) for uid in online_ids if int(uid) != user_id]
            
            if not online_ids:
                return []
            
            # Get user info for online learners
            query = session.query(UserModel, ProgressModel).outerjoin(
                ProgressModel, UserModel.id == ProgressModel.user_id
            ).filter(
                UserModel.id.in_(online_ids),
                UserModel.role == 'learner',
                UserModel.status == True
            )
            
            # Filter by level if specified
            if level:
                level_map = {
                    'beginner': ['beginner', 'elementary'],
                    'elementary': ['beginner', 'elementary', 'intermediate'],
                    'intermediate': ['elementary', 'intermediate', 'upper-intermediate'],
                    'upper-intermediate': ['intermediate', 'upper-intermediate', 'advanced'],
                    'advanced': ['upper-intermediate', 'advanced']
                }
                allowed_levels = level_map.get(level, [level])
                query = query.filter(
                    or_(
                        ProgressModel.current_level.in_(allowed_levels),
                        ProgressModel.current_level == None
                    )
                )
            
            results = query.limit(limit).all()
            
            learners = []
            for user, progress in results:
                learners.append({
                    'id': user.id,
                    'full_name': user.full_name,
                    'avatar': user.avatar_url,
                    'level': progress.current_level if progress else 'beginner',
                    'xp_points': progress.xp_points if progress else 0,
                    'status': 'online'
                })
            
            return learners
        except Exception as e:
            print(f"[StudyBuddy] Error getting online learners: {e}")
            return []
        finally:
            session.close()
    
    @staticmethod
    def send_invite(from_user_id: int, to_user_id: int, topic: str = None) -> dict:
        """Send practice invite to another user"""
        from api.websocket import connected_users, socketio
        
        session = get_db_session()
        try:
            # Get sender info
            from_user = session.query(UserModel).filter_by(id=from_user_id).first()
            if not from_user:
                return {'success': False, 'error': 'User not found'}
            
            # Check if target is online
            to_user_id_str = str(to_user_id)
            if to_user_id_str not in connected_users:
                return {'success': False, 'error': 'User is offline'}
            
            # Send invite via WebSocket
            target_sid = connected_users[to_user_id_str]['sid']
            socketio.emit('practice_invite_received', {
                'fromUserId': str(from_user_id),
                'fromUserName': from_user.full_name,
                'fromUserAvatar': from_user.avatar_url,
                'topic': topic
            }, room=target_sid)
            
            return {'success': True, 'message': 'Invite sent'}
        except Exception as e:
            print(f"[StudyBuddy] Error sending invite: {e}")
            return {'success': False, 'error': str(e)}
        finally:
            session.close()
    
    @staticmethod
    def respond_to_invite(user_id: int, from_user_id: int, accept: bool) -> dict:
        """Handle response to a practice invite"""
        from api.websocket import connected_users, socketio
        
        session = get_db_session()
        try:
            from_user_id_str = str(from_user_id)
            if from_user_id_str not in connected_users:
                return {'success': False, 'error': 'Inviter is offline'}
            
            from_user_sid = connected_users[from_user_id_str]['sid']
            
            if accept:
                # Create room for practice session
                room_name = f"aesp-practice-{from_user_id}-{user_id}-{int(datetime.now().timestamp())}"
                
                # Get user info
                user = session.query(UserModel).filter_by(id=user_id).first()
                
                # Store match
                StudyBuddyModel._matches[user_id] = {
                    'buddy_id': from_user_id,
                    'room_name': room_name,
                    'created_at': datetime.now()
                }
                StudyBuddyModel._matches[from_user_id] = {
                    'buddy_id': user_id,
                    'room_name': room_name,
                    'created_at': datetime.now()
                }
                
                # Notify inviter
                socketio.emit('invite_accepted', {
                    'userId': str(user_id),
                    'userName': user.full_name if user else 'User',
                    'userAvatar': user.avatar_url if user else None,
                    'roomName': room_name
                }, room=from_user_sid)
                
                return {
                    'success': True,
                    'accepted': True,
                    'room_name': room_name,
                    'buddy_id': from_user_id
                }
            else:
                # Notify inviter that invite was declined
                socketio.emit('invite_declined', {
                    'userId': str(user_id),
                    'reason': 'User declined the invitation'
                }, room=from_user_sid)
                
                return {'success': True, 'accepted': False}
        except Exception as e:
            print(f"[StudyBuddy] Error responding to invite: {e}")
            return {'success': False, 'error': str(e)}
        finally:
            session.close()


# Singleton instance
study_buddy_service = StudyBuddyService()
