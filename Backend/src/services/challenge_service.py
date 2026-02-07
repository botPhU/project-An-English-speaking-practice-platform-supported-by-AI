"""
Challenge Service
Business logic for challenges and gamification - Real Database Implementation
"""
from datetime import datetime
import json
from infrastructure.databases.mssql import get_db_session
from infrastructure.models.user_model import UserModel
from infrastructure.models.progress_model import ProgressModel
from infrastructure.models.challenge_models import (
    ChallengeModel, UserChallengeModel, LeaderboardEntryModel, RewardModel, UserRewardModel
)


class ChallengeService:
    """Service for challenges and gamification"""

    # ==================== CHALLENGES ====================

    def get_challenges(self, status='active', difficulty='all'):
        """Get all challenges from database"""
        try:
            with get_db_session() as session:
                query = session.query(ChallengeModel).filter_by(is_active=True)
                
                if status != 'all':
                    query = query.filter_by(status=status)
                if difficulty != 'all':
                    query = query.filter_by(difficulty=difficulty)
                
                challenges = query.order_by(ChallengeModel.ends_at.asc()).all()
                
                result = []
                for c in challenges:
                    result.append({
                        'id': c.id,
                        'title': c.title,
                        'description': c.description,
                        'difficulty': c.difficulty,
                        'status': c.status,
                        'participants': 0,  # Could count from UserChallengeModel
                        'xp_reward': c.xp_reward,
                        'badge': c.badge_name,
                        'ends_at': c.ends_at.isoformat() if c.ends_at else None,
                        'progress': {'current': 0, 'target': c.target_value}
                    })
                return result
        except Exception as e:
            print(f"Get challenges error: {e}")
            return []

    def get_challenge_details(self, challenge_id):
        """Get challenge details from database"""
        try:
            with get_db_session() as session:
                challenge = session.query(ChallengeModel).get(challenge_id)
                if not challenge:
                    return {'error': 'Challenge not found'}
                
                rules = []
                if challenge.rules:
                    try:
                        rules = json.loads(challenge.rules)
                    except json.JSONDecodeError:
                        rules = [challenge.rules]
                
                return {
                    'id': challenge.id,
                    'title': challenge.title,
                    'description': challenge.description,
                    'rules': rules,
                    'difficulty': challenge.difficulty,
                    'xp_reward': challenge.xp_reward,
                    'target_value': challenge.target_value,
                    'badge': challenge.badge_name,
                    'starts_at': challenge.starts_at.isoformat() if challenge.starts_at else None,
                    'ends_at': challenge.ends_at.isoformat() if challenge.ends_at else None,
                    'prizes': [
                        {'rank': '1st', 'reward': f'{challenge.xp_reward * 2} XP + Premium Badge'},
                        {'rank': '2nd', 'reward': f'{challenge.xp_reward} XP + Silver Badge'},
                        {'rank': '3rd', 'reward': f'{challenge.xp_reward // 2} XP + Bronze Badge'}
                    ]
                }
        except Exception as e:
            print(f"Challenge details error: {e}")
            return {'error': str(e)}

    def join_challenge(self, user_id, challenge_id):
        """Join a challenge"""
        try:
            with get_db_session() as session:
                # Check if already joined
                existing = session.query(UserChallengeModel)\
                    .filter_by(user_id=user_id, challenge_id=challenge_id).first()
                if existing:
                    return existing.id
                
                user_challenge = UserChallengeModel(
                    user_id=user_id,
                    challenge_id=challenge_id,
                    current_progress=0,
                    status='active',
                    joined_at=datetime.now()
                )
                session.add(user_challenge)
                session.flush()
                return user_challenge.id
        except Exception as e:
            print(f"Join challenge error: {e}")
            return 0

    def submit_entry(self, challenge_id, data):
        """Submit an entry for a challenge"""
        try:
            with get_db_session() as session:
                user_id = data.get('user_id')
                user_challenge = session.query(UserChallengeModel)\
                    .filter_by(user_id=user_id, challenge_id=challenge_id, status='active').first()
                
                if not user_challenge:
                    return {'success': False, 'error': 'Not joined this challenge'}
                
                challenge = session.query(ChallengeModel).get(challenge_id)
                
                # Update progress
                progress_increment = data.get('progress', 1)
                user_challenge.current_progress += progress_increment
                
                # Check if completed
                completed = user_challenge.current_progress >= (challenge.target_value if challenge else 0)
                if completed:
                    user_challenge.status = 'completed'
                    user_challenge.completed_at = datetime.now()
                    user_challenge.xp_earned = challenge.xp_reward if challenge else 0
                    
                    # Update user's XP
                    progress = session.query(ProgressModel).filter_by(user_id=user_id).first()
                    if progress:
                        progress.xp_points = (progress.xp_points or 0) + user_challenge.xp_earned
                
                return {
                    'success': True,
                    'score': data.get('score', 0),
                    'xp_earned': user_challenge.xp_earned if completed else 0,
                    'progress_update': {
                        'current': user_challenge.current_progress,
                        'target': challenge.target_value if challenge else 0
                    },
                    'completed': completed
                }
        except Exception as e:
            print(f"Submit entry error: {e}")
            return {'success': False, 'error': str(e)}

    # ==================== LEADERBOARD ====================

    def get_leaderboard(self, period='weekly', limit=10):
        """Get leaderboard from database"""
        try:
            with get_db_session() as session:
                from sqlalchemy import desc
                
                # Get users ordered by XP
                users_with_progress = session.query(UserModel, ProgressModel)\
                    .outerjoin(ProgressModel, UserModel.id == ProgressModel.user_id)\
                    .filter(UserModel.role == 'learner')\
                    .order_by(desc(ProgressModel.xp_points))\
                    .limit(limit)\
                    .all()
                
                leaders = []
                for idx, (user, progress) in enumerate(users_with_progress, 1):
                    leaders.append({
                        'rank': idx,
                        'user': user.full_name or user.user_name,
                        'avatar': user.user_name[:2].upper() if user.user_name else 'XX',
                        'xp': progress.xp_points if progress else 0,
                        'level': progress.current_level if progress else 'beginner'
                    })
                
                return {
                    'period': period,
                    'updated_at': datetime.now().isoformat(),
                    'leaders': leaders,
                    'my_rank': 0,  # Would need current user_id to calculate
                    'my_xp': 0
                }
        except Exception as e:
            print(f"Leaderboard error: {e}")
            return {'period': period, 'leaders': []}

    # ==================== PROGRESS ====================

    def get_user_progress(self, user_id):
        """Get user's challenge progress from database"""
        try:
            with get_db_session() as session:
                from sqlalchemy import func
                
                # Count challenges
                total_joined = session.query(func.count(UserChallengeModel.id))\
                    .filter_by(user_id=user_id).scalar() or 0
                completed = session.query(func.count(UserChallengeModel.id))\
                    .filter_by(user_id=user_id, status='completed').scalar() or 0
                active = session.query(func.count(UserChallengeModel.id))\
                    .filter_by(user_id=user_id, status='active').scalar() or 0
                
                # Total XP from challenges
                total_xp = session.query(func.sum(UserChallengeModel.xp_earned))\
                    .filter_by(user_id=user_id).scalar() or 0
                
                # Get progress data
                progress = session.query(ProgressModel).filter_by(user_id=user_id).first()
                
                # Get badges
                user_rewards = session.query(UserRewardModel)\
                    .filter_by(user_id=user_id, is_active=True).all()
                badges = [ur.reward.name for ur in user_rewards if ur.reward and ur.reward.category == 'badge']
                
                return {
                    'user_id': user_id,
                    'total_challenges_joined': total_joined,
                    'challenges_completed': completed,
                    'active_challenges': active,
                    'total_xp_earned': total_xp,
                    'badges_earned': badges,
                    'current_streak': progress.current_streak if progress else 0,
                    'best_streak': progress.longest_streak if progress else 0
                }
        except Exception as e:
            print(f"User challenge progress error: {e}")
            return {'user_id': user_id, 'total_challenges_joined': 0}

    # ==================== REWARDS ====================

    def get_available_rewards(self, user_id):
        """Get available rewards from database"""
        try:
            with get_db_session() as session:
                # Get user's XP/points
                progress = session.query(ProgressModel).filter_by(user_id=user_id).first()
                user_points = progress.xp_points if progress else 0
                
                # Get all active rewards
                rewards = session.query(RewardModel).filter_by(is_active=True).all()
                
                reward_list = []
                for r in rewards:
                    reward_list.append({
                        'id': r.id,
                        'name': r.name,
                        'description': r.description,
                        'cost': r.cost,
                        'category': r.category,
                        'icon': r.icon,
                        'available': user_points >= r.cost and (r.stock == -1 or r.stock > 0)
                    })
                
                return {
                    'user_points': user_points,
                    'rewards': reward_list
                }
        except Exception as e:
            print(f"Get rewards error: {e}")
            return {'user_points': 0, 'rewards': []}

    def claim_reward(self, user_id, reward_id):
        """Claim a reward"""
        try:
            with get_db_session() as session:
                reward = session.query(RewardModel).get(reward_id)
                if not reward or not reward.is_active:
                    return False
                
                # Check user has enough points
                progress = session.query(ProgressModel).filter_by(user_id=user_id).first()
                if not progress or (progress.xp_points or 0) < reward.cost:
                    return False
                
                # Check stock
                if reward.stock != -1 and reward.stock <= 0:
                    return False
                
                # Deduct points
                progress.xp_points = (progress.xp_points or 0) - reward.cost
                
                # Update stock
                if reward.stock != -1:
                    reward.stock -= 1
                
                # Create user reward record
                user_reward = UserRewardModel(
                    user_id=user_id,
                    reward_id=reward_id,
                    claimed_at=datetime.now(),
                    is_active=True
                )
                session.add(user_reward)
                
                return True
        except Exception as e:
            print(f"Claim reward error: {e}")
            return False
