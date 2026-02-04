"""
Message Service
Business logic for messaging between users
"""
from datetime import datetime
from typing import List, Dict, Optional
from sqlalchemy import or_, and_, desc, func
from infrastructure.databases.mssql import get_db_session
from infrastructure.models.message_model import MessageModel
from infrastructure.models.user_model import UserModel


class MessageService:
    """Service for handling user messages"""
    
    def get_conversations(self, user_id: int) -> List[Dict]:
        """
        Get list of conversations for a user
        Returns unique users the user has chatted with, with last message
        """
        session = get_db_session()
        try:
            # Subquery to get the latest message ID for each conversation
            subquery = session.query(
                func.max(MessageModel.id).label('max_id'),
                func.least(MessageModel.sender_id, MessageModel.receiver_id).label('user1'),
                func.greatest(MessageModel.sender_id, MessageModel.receiver_id).label('user2')
            ).filter(
                or_(
                    MessageModel.sender_id == user_id,
                    MessageModel.receiver_id == user_id
                )
            ).group_by(
                func.least(MessageModel.sender_id, MessageModel.receiver_id),
                func.greatest(MessageModel.sender_id, MessageModel.receiver_id)
            ).subquery()
            
            # Get the actual messages
            messages = session.query(MessageModel).join(
                subquery,
                MessageModel.id == subquery.c.max_id
            ).order_by(desc(MessageModel.created_at)).all()
            
            conversations = []
            for msg in messages:
                other_user_id = msg.receiver_id if msg.sender_id == user_id else msg.sender_id
                other_user = session.query(UserModel).filter(UserModel.id == other_user_id).first()
                
                # Count unread messages from this user
                unread_count = session.query(func.count(MessageModel.id)).filter(
                    MessageModel.sender_id == other_user_id,
                    MessageModel.receiver_id == user_id,
                    MessageModel.is_read == False
                ).scalar()
                
                conversations.append({
                    'user_id': other_user_id,
                    'user_name': other_user.full_name if other_user else 'Unknown',
                    'avatar': other_user.avatar_url if other_user else None,
                    'last_message': msg.content[:50] + '...' if len(msg.content) > 50 else msg.content,
                    'last_message_time': msg.created_at.isoformat() if msg.created_at else None,
                    'unread_count': unread_count or 0,
                    'is_mine': msg.sender_id == user_id
                })
            
            return conversations
        except Exception as e:
            print(f"[MessageService] Error getting conversations: {e}")
            return []
        finally:
            session.close()
    
    def get_messages(self, user_id: int, other_user_id: int, limit: int = 50, offset: int = 0) -> List[Dict]:
        """Get messages between two users"""
        session = get_db_session()
        try:
            messages = session.query(MessageModel).filter(
                or_(
                    and_(MessageModel.sender_id == user_id, MessageModel.receiver_id == other_user_id),
                    and_(MessageModel.sender_id == other_user_id, MessageModel.receiver_id == user_id)
                )
            ).order_by(desc(MessageModel.created_at)).offset(offset).limit(limit).all()
            
            # Return in chronological order
            return [msg.to_dict() for msg in reversed(messages)]
        except Exception as e:
            print(f"[MessageService] Error getting messages: {e}")
            return []
        finally:
            session.close()
    
    def send_message(self, sender_id: int, receiver_id: int, content: str) -> Optional[Dict]:
        """Send a message"""
        session = get_db_session()
        try:
            message = MessageModel(
                sender_id=sender_id,
                receiver_id=receiver_id,
                content=content,
                is_read=False,
                created_at=datetime.now()
            )
            session.add(message)
            session.commit()
            session.refresh(message)
            return message.to_dict()
        except Exception as e:
            session.rollback()
            print(f"[MessageService] Error sending message: {e}")
            return None
        finally:
            session.close()
    
    def mark_as_read(self, message_id: int, user_id: int) -> bool:
        """Mark a message as read"""
        session = get_db_session()
        try:
            message = session.query(MessageModel).filter(
                MessageModel.id == message_id,
                MessageModel.receiver_id == user_id
            ).first()
            
            if message:
                message.is_read = True
                message.read_at = datetime.now()
                session.commit()
                return True
            return False
        except Exception as e:
            session.rollback()
            print(f"[MessageService] Error marking as read: {e}")
            return False
        finally:
            session.close()
    
    def mark_all_read(self, user_id: int, other_user_id: int) -> int:
        """Mark all messages from other_user as read"""
        session = get_db_session()
        try:
            count = session.query(MessageModel).filter(
                MessageModel.sender_id == other_user_id,
                MessageModel.receiver_id == user_id,
                MessageModel.is_read == False
            ).update({
                'is_read': True,
                'read_at': datetime.now()
            })
            session.commit()
            return count
        except Exception as e:
            session.rollback()
            print(f"[MessageService] Error marking all as read: {e}")
            return 0
        finally:
            session.close()
    
    def get_unread_count(self, user_id: int) -> int:
        """Get total unread message count for a user"""
        session = get_db_session()
        try:
            count = session.query(func.count(MessageModel.id)).filter(
                MessageModel.receiver_id == user_id,
                MessageModel.is_read == False
            ).scalar()
            return count or 0
        except Exception as e:
            print(f"[MessageService] Error getting unread count: {e}")
            return 0
        finally:
            session.close()


# Singleton instance
message_service = MessageService()
