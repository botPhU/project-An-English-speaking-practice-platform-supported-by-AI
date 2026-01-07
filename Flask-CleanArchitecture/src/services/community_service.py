"""
Community Service
Business logic for community features - Real Database Implementation
"""
from datetime import datetime
from infrastructure.databases.mssql import get_db_session
from infrastructure.models.user_model import UserModel
from infrastructure.models.community_models import (
    PeerInvitationModel, PeerSessionModel, ReviewModel, QuickMatchModel
)


class CommunityService:
    """Service for learner community features"""

    # ==================== ONLINE LEARNERS ====================

    def get_online_learners(self, level='all'):
        """Get list of online learners from database"""
        try:
            with get_db_session() as session:
                query = session.query(UserModel).filter_by(role='learner', status=True)
                users = query.all()
                
                learners = []
                for u in users:
                    learner_data = {
                        'id': u.id,
                        'name': u.full_name or u.user_name,
                        'level': 'A2',  # Could be from progress table
                        'avatar': (u.user_name[:2].upper() if u.user_name else 'XX'),
                        'status': 'online',
                        'topic': 'Tổng quát'
                    }
                    if level == 'all' or learner_data['level'].startswith(level):
                        learners.append(learner_data)
                return learners if learners else []
        except Exception as e:
            print(f"Online learners error: {e}")
            return []

    # ==================== INVITATIONS ====================

    def send_invitation(self, sender_id, receiver_id, topic):
        """Send practice invitation"""
        try:
            with get_db_session() as session:
                invitation = PeerInvitationModel(
                    sender_id=sender_id,
                    receiver_id=receiver_id,
                    topic=topic,
                    status='pending',
                    created_at=datetime.now()
                )
                session.add(invitation)
                session.flush()
                return invitation.id
        except Exception as e:
            print(f"Send invitation error: {e}")
            return 0

    def get_invitations(self, user_id):
        """Get invitations for a user from database"""
        try:
            with get_db_session() as session:
                invitations = session.query(PeerInvitationModel)\
                    .filter_by(receiver_id=user_id, status='pending')\
                    .order_by(PeerInvitationModel.created_at.desc())\
                    .all()
                
                result = []
                for inv in invitations:
                    sender = session.query(UserModel).get(inv.sender_id)
                    result.append({
                        'id': inv.id,
                        'from_user': sender.full_name if sender else 'Unknown',
                        'topic': inv.topic,
                        'sent_at': self._format_time_ago(inv.created_at),
                        'status': inv.status
                    })
                return result
        except Exception as e:
            print(f"Get invitations error: {e}")
            return []

    def respond_to_invitation(self, invitation_id, action):
        """Respond to an invitation"""
        try:
            with get_db_session() as session:
                invitation = session.query(PeerInvitationModel).get(invitation_id)
                if not invitation:
                    return None
                    
                invitation.status = 'accepted' if action == 'accept' else 'declined'
                invitation.responded_at = datetime.now()
                
                if action == 'accept':
                    # Create peer session
                    peer_session = PeerSessionModel(
                        participant1_id=invitation.sender_id,
                        participant2_id=invitation.receiver_id,
                        topic=invitation.topic,
                        status='scheduled',
                        created_at=datetime.now()
                    )
                    session.add(peer_session)
                    session.flush()
                    return peer_session.id
                return None
        except Exception as e:
            print(f"Respond to invitation error: {e}")
            return None

    # ==================== QUICK MATCH ====================

    def find_quick_match(self, user_id, level, topic):
        """Find a random practice partner"""
        try:
            with get_db_session() as session:
                match = QuickMatchModel(
                    user_id=user_id,
                    requested_level=level,
                    requested_topic=topic,
                    status='searching',
                    created_at=datetime.now()
                )
                session.add(match)
                session.flush()
                
                return {
                    'status': 'searching',
                    'match_id': match.id,
                    'estimated_time': '30 seconds'
                }
        except Exception as e:
            print(f"Quick match error: {e}")
            return {'status': 'error', 'match_id': 0}

    def get_match_status(self, match_id):
        """Get match status from database"""
        try:
            with get_db_session() as session:
                match = session.query(QuickMatchModel).get(match_id)
                if not match:
                    return {'status': 'not_found'}
                
                result = {
                    'match_id': match.id,
                    'status': match.status
                }
                
                if match.matched_user_id:
                    partner = session.query(UserModel).get(match.matched_user_id)
                    result['partner'] = {
                        'id': partner.id if partner else 0,
                        'name': partner.full_name if partner else 'Unknown',
                        'level': 'A2',
                        'avatar': partner.user_name[:2].upper() if partner else 'XX'
                    }
                    result['session_id'] = match.session_id
                
                return result
        except Exception as e:
            print(f"Match status error: {e}")
            return {'status': 'error'}

    # ==================== PEER PRACTICE SESSIONS ====================

    def create_peer_session(self, data):
        """Create a new peer practice session"""
        try:
            with get_db_session() as session:
                peer_session = PeerSessionModel(
                    participant1_id=data.get('participant1_id'),
                    participant2_id=data.get('participant2_id'),
                    topic=data.get('topic'),
                    status='scheduled',
                    scheduled_at=datetime.now(),
                    created_at=datetime.now()
                )
                session.add(peer_session)
                session.flush()
                return peer_session.id
        except Exception as e:
            print(f"Create peer session error: {e}")
            return 0

    def get_session_details(self, session_id):
        """Get session details from database"""
        try:
            with get_db_session() as session:
                peer_session = session.query(PeerSessionModel).get(session_id)
                if not peer_session:
                    return {'error': 'Session not found'}
                
                p1 = session.query(UserModel).get(peer_session.participant1_id)
                p2 = session.query(UserModel).get(peer_session.participant2_id)
                
                return {
                    'id': peer_session.id,
                    'participants': [
                        {'id': p1.id if p1 else 0, 'name': p1.full_name if p1 else 'Unknown', 'avatar': p1.user_name[:2].upper() if p1 else 'XX'},
                        {'id': p2.id if p2 else 0, 'name': p2.full_name if p2 else 'Unknown', 'avatar': p2.user_name[:2].upper() if p2 else 'XX'}
                    ],
                    'topic': peer_session.topic,
                    'status': peer_session.status,
                    'started_at': peer_session.started_at.isoformat() if peer_session.started_at else None,
                    'duration': peer_session.duration_minutes or 0
                }
        except Exception as e:
            print(f"Session details error: {e}")
            return {'error': str(e)}

    def complete_session(self, session_id, data):
        """Complete a peer practice session"""
        try:
            with get_db_session() as session:
                peer_session = session.query(PeerSessionModel).get(session_id)
                if not peer_session:
                    return 0
                
                peer_session.status = 'completed'
                peer_session.ended_at = datetime.now()
                peer_session.duration_minutes = data.get('duration', 0)
                xp_earned = min(data.get('duration', 0) * 2, 100)  # 2 XP per minute, max 100
                peer_session.xp_earned = xp_earned
                
                return xp_earned
        except Exception as e:
            print(f"Complete session error: {e}")
            return 0

    # ==================== REVIEWS & RATINGS ====================

    def get_pending_reviews(self, user_id):
        """Get sessions pending review from database"""
        try:
            with get_db_session() as session:
                # Get completed peer sessions without reviews
                peer_sessions = session.query(PeerSessionModel)\
                    .filter(
                        (PeerSessionModel.participant1_id == user_id) |
                        (PeerSessionModel.participant2_id == user_id)
                    )\
                    .filter_by(status='completed')\
                    .all()
                
                pending = []
                for ps in peer_sessions:
                    # Check if user has reviewed this session
                    existing_review = session.query(ReviewModel)\
                        .filter_by(reviewer_id=user_id, session_id=ps.id, session_type='peer')\
                        .first()
                    
                    if not existing_review:
                        partner_id = ps.participant2_id if ps.participant1_id == user_id else ps.participant1_id
                        partner = session.query(UserModel).get(partner_id)
                        pending.append({
                            'id': ps.id,
                            'partner': partner.full_name if partner else 'Unknown',
                            'date': ps.ended_at.strftime('%d/%m/%Y') if ps.ended_at else '',
                            'topic': ps.topic,
                            'type': 'peer'
                        })
                return pending
        except Exception as e:
            print(f"Pending reviews error: {e}")
            return []

    def create_review(self, data):
        """Create a review"""
        try:
            with get_db_session() as session:
                review = ReviewModel(
                    reviewer_id=data.get('reviewer_id'),
                    reviewed_id=data.get('reviewed_id'),
                    session_id=data.get('session_id'),
                    session_type=data.get('session_type', 'peer'),
                    rating=data.get('rating'),
                    comment=data.get('comment'),
                    is_anonymous=data.get('is_anonymous', False),
                    created_at=datetime.now()
                )
                session.add(review)
                session.flush()
                return review.id
        except Exception as e:
            print(f"Create review error: {e}")
            return 0

    def get_mentor_reviews(self, mentor_id, page=1):
        """Get reviews for a mentor from database"""
        try:
            with get_db_session() as session:
                from sqlalchemy import func
                
                # Get total and average
                total = session.query(func.count(ReviewModel.id))\
                    .filter_by(reviewed_id=mentor_id, session_type='mentor').scalar() or 0
                avg_rating = session.query(func.avg(ReviewModel.rating))\
                    .filter_by(reviewed_id=mentor_id, session_type='mentor').scalar() or 0
                
                # Get paginated reviews
                per_page = 10
                reviews = session.query(ReviewModel)\
                    .filter_by(reviewed_id=mentor_id, session_type='mentor')\
                    .order_by(ReviewModel.created_at.desc())\
                    .offset((page - 1) * per_page)\
                    .limit(per_page)\
                    .all()
                
                review_list = []
                for r in reviews:
                    reviewer = session.query(UserModel).get(r.reviewer_id)
                    review_list.append({
                        'id': r.id,
                        'user': reviewer.full_name if reviewer and not r.is_anonymous else 'Anonymous',
                        'rating': r.rating,
                        'comment': r.comment,
                        'date': r.created_at.strftime('%d/%m/%Y') if r.created_at else ''
                    })
                
                return {
                    'mentor_id': mentor_id,
                    'total': total,
                    'average_rating': round(float(avg_rating), 1),
                    'reviews': review_list,
                    'page': page,
                    'per_page': per_page
                }
        except Exception as e:
            print(f"Get mentor reviews error: {e}")
            return {'mentor_id': mentor_id, 'total': 0, 'average_rating': 0, 'reviews': []}

    def _format_time_ago(self, dt):
        """Format datetime as time ago string"""
        if not dt:
            return ''
        delta = datetime.now() - dt
        if delta.seconds < 60:
            return 'vừa xong'
        elif delta.seconds < 3600:
            return f'{delta.seconds // 60} phút trước'
        elif delta.days < 1:
            return f'{delta.seconds // 3600} giờ trước'
        else:
            return f'{delta.days} ngày trước'
