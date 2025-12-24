from datetime import datetime, timedelta

class AdminService:
    """Service for admin dashboard and statistics"""
    
    def __init__(self):
        pass
    
    def get_dashboard_stats(self):
        """
        Get dashboard statistics including users, revenue, lessons, mentors
        Returns mock data for now - will be replaced with real DB queries
        """
        # Mock data matching frontend Dashboard page
        stats = {
            'total_users': 1247,
            'users_change': '+12%',
            'total_revenue': 45600000,  # VND
            'revenue_change': '+8%',
            'ai_lessons': 3891,
            'lessons_change': '+15%',
            'active_mentors': 48,
            'mentors_change': '+3%',
            'last_updated': datetime.now().isoformat()
        }
        return stats
    
    def get_recent_activities(self, limit=10):
        """
        Get recent system activities
        Returns mock data - will be replaced with real activity logs
        """
        activities = [
            {
                'id': 1,
                'type': 'user_registration',
                'user': 'Nguyễn Văn A',
                'action': 'đã đăng ký tài khoản mới',
                'timestamp': (datetime.now() - timedelta(minutes=5)).isoformat(),
                'icon': 'person_add',
                'color': 'primary'
            },
            {
                'id': 2,
                'type': 'package_purchase',
                'user': 'Trần Thị B',
                'action': 'đã mua gói Premium 1 tháng',
                'timestamp': (datetime.now() - timedelta(minutes=15)).isoformat(),
                'icon': 'shopping_cart',
                'color': 'success'
            },
            {
                'id': 3,
                'type': 'mentor_application',
                'user': 'Lê Văn C',
                'action': 'đã nộp đơn đăng ký làm mentor',
                'timestamp': (datetime.now() - timedelta(hours=1)).isoformat(),
                'icon': 'verified',
                'color': 'info'
            },
            {
                'id': 4,
                'type': 'feedback_submitted',
                'user': 'Phạm Thị D',
                'action': 'đã gửi phản hồi về bài học',
                'timestamp': (datetime.now() - timedelta(hours=2)).isoformat(),
                'icon': 'chat_bubble',
                'color': 'warning'
            },
            {
                'id': 5,
                'type': 'support_ticket',
                'user': 'Hoàng Văn E',
                'action': 'đã tạo ticket hỗ trợ',
                'timestamp': (datetime.now() - timedelta(hours=3)).isoformat(),
                'icon': 'support_agent',
                'color': 'danger'
            },
        ]
        return activities[:limit]
    
    def get_revenue_chart_data(self, period='30days'):
        """
        Get revenue chart data for specified period
        Returns mock data - will query from transactions table
        """
        # Mock weekly revenue data
        weekly_data = [
            {'week': 'Tuần 1', 'revenue': 8500000, 'date': '01/12'},
            {'week': 'Tuần 2', 'revenue': 9200000, 'date': '08/12'},
            {'week': 'Tuần 3', 'revenue': 7800000, 'date': '15/12'},
            {'week': 'Tuần 4', 'revenue': 10500000, 'date': '22/12'},
        ]
        return weekly_data
    
    def get_user_growth_data(self, period='30days'):
        """
        Get user growth data
        Returns mock data - will query from users table
        """
        growth_data = [
            {'date': '01/12', 'count': 1120},
            {'date': '08/12', 'count': 1165},
            {'date': '15/12', 'count': 1198},
            {'date': '22/12', 'count': 1247},
        ]
        return growth_data
