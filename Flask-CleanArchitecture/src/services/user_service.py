from datetime import datetime

class UserService:
    """Service for user management operations"""
    
    def __init__(self):
        # Mock data - will be replaced with repository
        self.mock_users = [
            {
                'id': 1,
                'name': 'Nguyễn Văn A',
                'email': 'nguyenvana@email.com',
                'role': 'learner',
                'status': 'active',
                'plan': 'Premium',
                'joined_date': '2024-01-15',
                'last_login': '2024-12-24'
            },
            {
                'id': 2,
                'name': 'Trần Thị B',
                'email': 'tranthib@email.com',
                'role': 'learner',
                'status': 'active',
                'plan': 'Basic',
                'joined_date': '2024-02-20',
                'last_login': '2024-12-23'
            },
            {
                'id': 3,
                'name': 'Lê Văn C',
                'email': 'levanc@email.com',
                'role': 'mentor',
                'status': 'active',
                'plan': 'N/A',
                'joined_date': '2024-03-10',
                'last_login': '2024-12-24'
            },
            {
                'id': 4,
                'name': 'Phạm Thị D',
                'email': 'phamthid@email.com',
                'role': 'learner',
                'status': 'inactive',
                'plan': 'Free',
                'joined_date': '2024-04-05',
                'last_login': '2024-12-10'
            },
        ]
    
    def list_users(self, role=None, status=None, search=None, page=1, per_page=20):
        """
        Get list of users with filtering and pagination
        """
        users = self.mock_users.copy()
        
        # Apply filters
        if role:
            users = [u for u in users if u['role'] == role]
        if status:
            users = [u for u in users if u['status'] == status]
        if search:
            search_lower = search.lower()
            users = [u for u in users if 
                    search_lower in u['name'].lower() or 
                    search_lower in u['email'].lower()]
        
        # Pagination
        total = len(users)
        start = (page - 1) * per_page
        end = start + per_page
        users_page = users[start:end]
        
        return {
            'users': users_page,
            'total': total,
            'page': page,
            'per_page': per_page,
            'total_pages': (total + per_page - 1) // per_page
        }
    
    def get_user(self, user_id):
        """Get user by ID"""
        user = next((u for u in self.mock_users if u['id'] == user_id), None)
        return user
    
    def update_user(self, user_id, data):
        """Update user information"""
        user = self.get_user(user_id)
        if not user:
            return None
        
        # Update fields
        for key in ['name', 'email', 'role', 'status', 'plan']:
            if key in data:
                user[key] = data[key]
        
        return user
    
    def delete_user(self, user_id):
        """Delete user (soft delete in real implementation)"""
        user = self.get_user(user_id)
        if user:
            # In real implementation, we'd set deleted_at field
            # For now, just mark as inactive
            user['status'] = 'deleted'
            return True
        return False
    
    def get_user_stats(self):
        """Get user statistics"""
        total_users = len(self.mock_users)
        active_users = len([u for u in self.mock_users if u['status'] == 'active'])
        learners = len([u for u in self.mock_users if u['role'] == 'learner'])
        mentors = len([u for u in self.mock_users if u['role'] == 'mentor'])
        
        return {
            'total_users': total_users,
            'active_users': active_users,
            'learners': learners,
            'mentors': mentors
        }
