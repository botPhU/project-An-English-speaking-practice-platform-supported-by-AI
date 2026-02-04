"""
Badge Service for AESP Platform
Business logic for badges and achievements system
"""

from datetime import datetime
from typing import List, Dict, Optional
from sqlalchemy import and_
from infrastructure.databases.mssql import get_db_session
from infrastructure.models.badge_model import BadgeModel, UserBadgeModel, DEFAULT_BADGES
from infrastructure.models.user_model import UserModel
from infrastructure.models.progress_model import ProgressModel
from services.notification_service import NotificationService


class BadgeService:
    """Service for managing badges and achievements"""
    
    def __init__(self):
        self.notification_service = NotificationService()
    
    def get_all_badges(self, category: str = None) -> List[Dict]:
        """Get all available badges, optionally filtered by category"""
        session = get_db_session()
        try:
            query = session.query(BadgeModel).filter(BadgeModel.is_active == True)
            
            if category and category != 'all':
                query = query.filter(BadgeModel.category == category)
            
            badges = query.order_by(BadgeModel.category, BadgeModel.requirement_value).all()
            return [badge.to_dict() for badge in badges]
        finally:
            session.close()
    
    def get_user_badges(self, user_id: int) -> Dict:
        """Get all badges earned by a user"""
        session = get_db_session()
        try:
            # Get earned badges
            earned = session.query(UserBadgeModel).filter(
                UserBadgeModel.user_id == user_id
            ).all()
            
            earned_badge_ids = [ub.badge_id for ub in earned]
            earned_badges = [ub.to_dict() for ub in earned]
            
            # Get all badges
            all_badges = session.query(BadgeModel).filter(
                BadgeModel.is_active == True
            ).all()
            
            # Categorize
            locked_badges = [
                b.to_dict() for b in all_badges 
                if b.id not in earned_badge_ids
            ]
            
            # Calculate stats
            total_points = sum(
                ub.badge.points if ub.badge else 0 
                for ub in earned
            )
            
            return {
                'earned': earned_badges,
                'locked': locked_badges,
                'total_earned': len(earned_badges),
                'total_available': len(all_badges),
                'total_points': total_points,
                'completion_percentage': round(
                    len(earned_badges) / len(all_badges) * 100, 1
                ) if all_badges else 0
            }
        finally:
            session.close()
    
    def check_and_award_badges(self, user_id: int) -> List[Dict]:
        """Check user's progress and award any earned badges"""
        session = get_db_session()
        newly_earned = []
        
        try:
            # Get user's current stats
            progress = session.query(ProgressModel).filter(
                ProgressModel.user_id == user_id
            ).first()
            
            if not progress:
                return []
            
            # Get user's already earned badge IDs
            earned_ids = session.query(UserBadgeModel.badge_id).filter(
                UserBadgeModel.user_id == user_id
            ).all()
            earned_ids = [e[0] for e in earned_ids]
            
            # Get all active badges
            all_badges = session.query(BadgeModel).filter(
                BadgeModel.is_active == True,
                ~BadgeModel.id.in_(earned_ids) if earned_ids else True
            ).all()
            
            for badge in all_badges:
                earned = False
                
                if badge.requirement_type == 'streak_days':
                    earned = (progress.current_streak or 0) >= badge.requirement_value
                    
                elif badge.requirement_type == 'practice_sessions':
                    earned = (progress.total_sessions or 0) >= badge.requirement_value
                    
                elif badge.requirement_type == 'total_score':
                    earned = (progress.total_score or 0) >= badge.requirement_value
                    
                elif badge.requirement_type == 'level_reached':
                    level_map = {'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4, 'C1': 5, 'C2': 6}
                    user_level = level_map.get(progress.current_level or 'A1', 1)
                    earned = user_level >= badge.requirement_value
                
                if earned:
                    # Award badge
                    user_badge = UserBadgeModel(
                        user_id=user_id,
                        badge_id=badge.id,
                        earned_at=datetime.utcnow()
                    )
                    session.add(user_badge)
                    
                    # Add to newly earned list
                    newly_earned.append(badge.to_dict())
                    
                    # Send notification
                    self.notification_service.create_notification(
                        user_id=user_id,
                        title=f'🏆 Huy hiệu mới: {badge.name}',
                        message=badge.description,
                        notification_type='achievement',
                        action_url='/learner/achievements'
                    )
            
            session.commit()
            return newly_earned
            
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()
    
    def get_recent_achievements(self, user_id: int, limit: int = 5) -> List[Dict]:
        """Get user's recently earned badges"""
        session = get_db_session()
        try:
            recent = session.query(UserBadgeModel).filter(
                UserBadgeModel.user_id == user_id
            ).order_by(
                UserBadgeModel.earned_at.desc()
            ).limit(limit).all()
            
            return [ub.to_dict() for ub in recent]
        finally:
            session.close()
    
    def get_badge_progress(self, user_id: int) -> List[Dict]:
        """Get progress toward next badges in each category"""
        session = get_db_session()
        try:
            progress = session.query(ProgressModel).filter(
                ProgressModel.user_id == user_id
            ).first()
            
            if not progress:
                return []
            
            # Get earned badge IDs
            earned_ids = session.query(UserBadgeModel.badge_id).filter(
                UserBadgeModel.user_id == user_id
            ).all()
            earned_ids = [e[0] for e in earned_ids]
            
            # Find next badge in each category
            categories = ['streak', 'practice', 'score', 'level']
            next_badges = []
            
            for cat in categories:
                next_badge = session.query(BadgeModel).filter(
                    BadgeModel.category == cat,
                    BadgeModel.is_active == True,
                    ~BadgeModel.id.in_(earned_ids) if earned_ids else True
                ).order_by(BadgeModel.requirement_value).first()
                
                if next_badge:
                    current_value = 0
                    if next_badge.requirement_type == 'streak_days':
                        current_value = progress.current_streak or 0
                    elif next_badge.requirement_type == 'practice_sessions':
                        current_value = progress.total_sessions or 0
                    elif next_badge.requirement_type == 'total_score':
                        current_value = progress.total_score or 0
                    elif next_badge.requirement_type == 'level_reached':
                        level_map = {'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4, 'C1': 5, 'C2': 6}
                        current_value = level_map.get(progress.current_level or 'A1', 1)
                    
                    percentage = min(100, round(
                        current_value / next_badge.requirement_value * 100, 1
                    ))
                    
                    next_badges.append({
                        'badge': next_badge.to_dict(),
                        'current_value': current_value,
                        'target_value': next_badge.requirement_value,
                        'percentage': percentage,
                        'remaining': max(0, next_badge.requirement_value - current_value)
                    })
            
            return next_badges
            
        finally:
            session.close()
    
    def seed_badges(self) -> int:
        """Seed default badges into database"""
        session = get_db_session()
        count = 0
        
        try:
            for badge_data in DEFAULT_BADGES:
                # Check if badge already exists
                existing = session.query(BadgeModel).filter(
                    BadgeModel.name == badge_data['name']
                ).first()
                
                if not existing:
                    badge = BadgeModel(**badge_data)
                    session.add(badge)
                    count += 1
            
            session.commit()
            return count
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()


# Singleton instance
badge_service = BadgeService()
