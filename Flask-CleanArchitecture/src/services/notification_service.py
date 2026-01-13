"""
Notification Service for AESP Platform
Business logic for managing user notifications
"""

from datetime import datetime
from typing import List, Optional, Dict, Any

from infrastructure.models.notification_model import NotificationModel
from infrastructure.databases.mssql import session


class NotificationService:
    """Service for managing user notifications"""
    
    @staticmethod
    def create_notification(
        user_id: int,
        title: str,
        message: str = None,
        notification_type: str = 'system',
        action_url: str = None
    ) -> NotificationModel:
        """
        Create a new notification for a user
        
        Args:
            user_id: Target user ID
            title: Notification title
            message: Notification message
            notification_type: Type of notification
            action_url: URL to navigate when clicked
            
        Returns:
            Created notification
        """
        notification = NotificationModel(
            user_id=user_id,
            title=title,
            message=message,
            notification_type=notification_type,
            action_url=action_url,
            is_read=False,
            created_at=datetime.now()
        )
        
        session.add(notification)
        session.commit()
        
        return notification
    
    @staticmethod
    def get_user_notifications(
        user_id: int,
        limit: int = 20,
        offset: int = 0,
        unread_only: bool = False
    ) -> List[Dict[str, Any]]:
        """
        Get notifications for a user
        
        Args:
            user_id: User ID
            limit: Max notifications to return
            offset: Pagination offset
            unread_only: If True, only return unread
            
        Returns:
            List of notification dicts
        """
        query = session.query(NotificationModel).filter(
            NotificationModel.user_id == user_id
        )
        
        if unread_only:
            query = query.filter(NotificationModel.is_read == False)
        
        notifications = query.order_by(
            NotificationModel.created_at.desc()
        ).offset(offset).limit(limit).all()
        
        return [n.to_dict() for n in notifications]
    
    @staticmethod
    def get_unread_count(user_id: int) -> int:
        """Get count of unread notifications for a user"""
        return session.query(NotificationModel).filter(
            NotificationModel.user_id == user_id,
            NotificationModel.is_read == False
        ).count()
    
    @staticmethod
    def mark_as_read(notification_id: int, user_id: int = None) -> bool:
        """
        Mark a notification as read
        
        Args:
            notification_id: Notification ID
            user_id: Optional user ID for verification
            
        Returns:
            True if successful
        """
        query = session.query(NotificationModel).filter(
            NotificationModel.id == notification_id
        )
        
        if user_id:
            query = query.filter(NotificationModel.user_id == user_id)
        
        notification = query.first()
        
        if notification:
            notification.is_read = True
            session.commit()
            return True
        
        return False
    
    @staticmethod
    def mark_all_as_read(user_id: int) -> int:
        """
        Mark all notifications as read for a user
        
        Args:
            user_id: User ID
            
        Returns:
            Number of notifications marked as read
        """
        count = session.query(NotificationModel).filter(
            NotificationModel.user_id == user_id,
            NotificationModel.is_read == False
        ).update({'is_read': True})
        
        session.commit()
        return count
    
    @staticmethod
    def delete_notification(notification_id: int, user_id: int = None) -> bool:
        """
        Delete a notification
        
        Args:
            notification_id: Notification ID
            user_id: Optional user ID for verification
            
        Returns:
            True if deleted
        """
        query = session.query(NotificationModel).filter(
            NotificationModel.id == notification_id
        )
        
        if user_id:
            query = query.filter(NotificationModel.user_id == user_id)
        
        notification = query.first()
        
        if notification:
            session.delete(notification)
            session.commit()
            return True
        
        return False
    
    @staticmethod
    def send_bulk_notification(
        user_ids: List[int],
        title: str,
        message: str = None,
        notification_type: str = 'system'
    ) -> int:
        """
        Send notification to multiple users
        
        Args:
            user_ids: List of user IDs
            title: Notification title
            message: Notification message
            notification_type: Type of notification
            
        Returns:
            Number of notifications created
        """
        now = datetime.now()
        notifications = [
            NotificationModel(
                user_id=uid,
                title=title,
                message=message,
                notification_type=notification_type,
                is_read=False,
                created_at=now
            )
            for uid in user_ids
        ]
        
        session.bulk_save_objects(notifications)
        session.commit()
        
        return len(notifications)
    
    # Predefined notification templates
    @staticmethod
    def notify_welcome(user_id: int):
        """Send welcome notification to new user"""
        return NotificationService.create_notification(
            user_id=user_id,
            title="Chào mừng đến AESP!",
            message="Bắt đầu hành trình học tiếng Anh của bạn ngay hôm nay.",
            notification_type="system",
            action_url="/learner/dashboard"
        )
    
    @staticmethod
    def notify_assessment_reminder(user_id: int):
        """Remind user to complete assessment"""
        return NotificationService.create_notification(
            user_id=user_id,
            title="Hoàn thành bài đánh giá",
            message="Làm bài test để xác định trình độ của bạn.",
            notification_type="reminder",
            action_url="/learner/assessment"
        )
    
    @staticmethod
    def notify_session_completed(user_id: int, score: float):
        """Notify user about completed practice session"""
        return NotificationService.create_notification(
            user_id=user_id,
            title="Phiên luyện tập hoàn thành!",
            message=f"Bạn đã hoàn thành phiên luyện tập với điểm {score:.1f}/100.",
            notification_type="achievement",
            action_url="/learner/progress"
        )
    
    @staticmethod
    def notify_mentor_feedback(user_id: int, mentor_name: str):
        """Notify learner about new feedback from mentor"""
        return NotificationService.create_notification(
            user_id=user_id,
            title="Phản hồi mới từ Mentor",
            message=f"{mentor_name} đã gửi phản hồi cho bạn.",
            notification_type="feedback",
            action_url="/learner/feedback"
        )

    @staticmethod
    def notify_mentor_practice_started(mentor_id: int, learner_name: str, topic: str, session_id: int):
        """Notify mentor when their assigned learner starts a practice session"""
        return NotificationService.create_notification(
            user_id=mentor_id,
            title="🎙️ Học viên bắt đầu luyện tập",
            message=f"{learner_name} đã bắt đầu phiên luyện tập chủ đề '{topic}'. Bạn có thể xem và đánh giá sau khi hoàn thành.",
            notification_type="session",
            action_url=f"/mentor/feedback"
        )
    
    @staticmethod
    def notify_mentor_session_completed(mentor_id: int, learner_name: str, session_id: int, overall_score: float = None):
        """Notify mentor when their learner completes a practice session"""
        score_text = f" với điểm {overall_score:.0f}/100" if overall_score else ""
        return NotificationService.create_notification(
            user_id=mentor_id,
            title="✅ Học viên hoàn thành luyện tập",
            message=f"{learner_name} đã hoàn thành phiên luyện tập{score_text}. Bạn có thể nghe ghi âm và cho phản hồi.",
            notification_type="session",
            action_url=f"/mentor/feedback"
        )

    @staticmethod
    def send_broadcast(admin_id: int, target_role: str, title: str, message: str) -> int:
        """
        Send broadcast notification to all users of a specific role
        
        Args:
            admin_id: Admin who sends the broadcast
            target_role: 'all', 'learner', or 'mentor'
            title: Notification title
            message: Notification message
            
        Returns:
            Number of notifications sent
        """
        from infrastructure.models.user_model import UserModel
        
        query = session.query(UserModel.id)
        if target_role != 'all':
            query = query.filter(UserModel.role == target_role)
        
        user_ids = [u.id for u in query.all()]
        
        if not user_ids:
            return 0
        
        return NotificationService.send_bulk_notification(
            user_ids=user_ids,
            title=title,
            message=message,
            notification_type='announcement'
        )

    @staticmethod
    def notify_video_call_invite(user_id: int, caller_name: str, room_name: str):
        """Notify user about incoming video call"""
        return NotificationService.create_notification(
            user_id=user_id,
            title="📹 Cuộc gọi video đến",
            message=f"{caller_name} đang gọi cho bạn.",
            notification_type="call",
            action_url=f"/video/{room_name}"
        )

    @staticmethod
    def notify_assignment(learner_id: int, mentor_name: str):
        """Notify learner about new mentor assignment"""
        return NotificationService.create_notification(
            user_id=learner_id,
            title="🎓 Bạn có mentor mới!",
            message=f"{mentor_name} đã được gán làm mentor của bạn.",
            notification_type="assignment",
            action_url="/learner/community"
        )

    @staticmethod
    def notify_mentor_new_learner(mentor_id: int, learner_name: str):
        """Notify mentor about new learner assignment"""
        return NotificationService.create_notification(
            user_id=mentor_id,
            title="👨‍🎓 Học viên mới!",
            message=f"{learner_name} đã được gán cho bạn hướng dẫn.",
            notification_type="assignment",
            action_url="/mentor/dashboard"
        )

