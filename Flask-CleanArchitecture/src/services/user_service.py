"""
User Service - Manages user data operations
Fetches data from database instead of mock data
"""

from datetime import datetime
from infrastructure.models.user_model import UserModel
from infrastructure.databases.mssql import session
from sqlalchemy import or_, func


class UserService:
    """Service for user management operations using database"""
    
    def list_users(self, role=None, status=None, search=None, page=1, per_page=20):
        """
        Get list of users with filtering and pagination from database
        """
        query = session.query(UserModel)
        
        # Apply filters
        if role and role != 'all':
            query = query.filter(UserModel.role == role)
        
        if status and status != 'all':
            if status == 'active':
                query = query.filter(UserModel.status == True)
            elif status == 'inactive':
                query = query.filter(UserModel.status == False)
        
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                or_(
                    UserModel.full_name.ilike(search_term),
                    UserModel.user_name.ilike(search_term),
                    UserModel.email.ilike(search_term)
                )
            )
        
        # Get total count before pagination
        total = query.count()
        
        # Apply pagination
        offset = (page - 1) * per_page
        users_query = query.offset(offset).limit(per_page).all()
        
        # Convert to dictionary format
        users = []
        for user in users_query:
            users.append({
                'id': user.id,
                'name': user.full_name or user.user_name,
                'user_name': user.user_name,
                'email': user.email or '',
                'role': user.role or 'learner',
                'status': 'active' if user.status else 'inactive',
                'is_active': user.status,
                'avatar': user.avatar_url,
                'created_at': user.created_at.isoformat() if user.created_at else None,
                'last_active': user.updated_at.isoformat() if user.updated_at else 'N/A',
                'online_status': 'offline'  # Will be updated by WebSocket
            })
        
        return {
            'users': users,
            'total': total,
            'page': page,
            'per_page': per_page,
            'total_pages': (total + per_page - 1) // per_page if total > 0 else 0
        }
    
    def get_user(self, user_id):
        """Get user by ID from database"""
        user = session.query(UserModel).filter_by(id=user_id).first()
        if not user:
            return None
        
        return {
            'id': user.id,
            'name': user.full_name or user.user_name,
            'user_name': user.user_name,
            'email': user.email,
            'role': user.role or 'learner',
            'status': 'active' if user.status else 'inactive',
            'is_active': user.status,
            'avatar': user.avatar_url,
            'phone_number': user.phone_number,
            'date_of_birth': user.date_of_birth.isoformat() if user.date_of_birth else None,
            'gender': user.gender,
            'address': user.address,
            'city': user.city,
            'country': user.country,
            'bio': user.bio,
            'created_at': user.created_at.isoformat() if user.created_at else None,
            'updated_at': user.updated_at.isoformat() if user.updated_at else None
        }
    
    def update_user(self, user_id, data):
        """Update user information in database"""
        user = session.query(UserModel).filter_by(id=user_id).first()
        if not user:
            return None
        
        try:
            # Update allowed fields
            if 'full_name' in data or 'name' in data:
                user.full_name = data.get('full_name') or data.get('name')
            if 'email' in data:
                user.email = data['email']
            if 'role' in data:
                user.role = data['role']
            if 'status' in data:
                user.status = data['status'] == 'active' or data['status'] == True
            if 'phone_number' in data:
                user.phone_number = data['phone_number']
            if 'avatar_url' in data:
                user.avatar_url = data['avatar_url']
            
            user.updated_at = datetime.now()
            session.commit()
            
            return self.get_user(user_id)
        except Exception as e:
            session.rollback()
            raise e
    
    def enable_user(self, user_id):
        """Enable (activate) a user"""
        user = session.query(UserModel).filter_by(id=user_id).first()
        if not user:
            return None
        
        try:
            user.status = True
            user.updated_at = datetime.now()
            session.commit()
            return self.get_user(user_id)
        except Exception as e:
            session.rollback()
            raise e
    
    def disable_user(self, user_id):
        """Disable (deactivate) a user"""
        user = session.query(UserModel).filter_by(id=user_id).first()
        if not user:
            return None
        
        try:
            user.status = False
            user.updated_at = datetime.now()
            session.commit()
            return self.get_user(user_id)
        except Exception as e:
            session.rollback()
            raise e
    
    def delete_user(self, user_id):
        """Delete user (soft delete by disabling)"""
        return self.disable_user(user_id) is not None
    
    def get_user_stats(self):
        """Get user statistics from database"""
        try:
            total_users = session.query(func.count(UserModel.id)).scalar() or 0
            active_users = session.query(func.count(UserModel.id)).filter(UserModel.status == True).scalar() or 0
            learners = session.query(func.count(UserModel.id)).filter(UserModel.role == 'learner').scalar() or 0
            mentors = session.query(func.count(UserModel.id)).filter(UserModel.role == 'mentor').scalar() or 0
            
            return {
                'total_users': total_users,
                'active_users': active_users,
                'active_learners': learners,
                'total_mentors': mentors,
                'users_change': '+0%',
                'learners_change': '+0%',
                'mentors_change': '+0%'
            }
        except Exception as e:
            print(f"Error getting user stats: {e}")
            return {
                'total_users': 0,
                'active_users': 0,
                'active_learners': 0,
                'total_mentors': 0
            }
