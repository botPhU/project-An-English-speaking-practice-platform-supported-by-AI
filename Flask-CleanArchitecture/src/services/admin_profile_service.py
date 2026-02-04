from datetime import datetime

class AdminProfileService:
    """Service for managing admin profile information"""
    
    def __init__(self):
        # Mock data for initial implementation
        self.profile_data = {
            'id': 'admin-1',
            'first_name': 'Nguyễn Văn',
            'last_name': 'Admin',
            'email': 'admin@aesp.vn',
            'phone': '+84 909 123 456',
            'location': 'Hồ Chí Minh, Việt Nam',
            'role': 'Super Admin',
            'bio': 'Quản trị viên chính của hệ thống AESP. Phụ trách quản lý người dùng và nội dung bài học.',
            'avatar_url': 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3Uf0ceXbbDi_oOnnaLHBpHGenOlfTkmw6ESU3eV8dqSkojjfYB6cDFROPdQ4yKxJf_1ew2iiqeYStsEIcm2zQq1wjDXf2pG6Iu8r50crXELsYd-nkuEEUod_NMp_Vkshro70YiNf8aDL608hPw6mu-0aoVbTTDd9PYP1A_DeAgHLZRIRjPZUsdHkYN8Ya2vvN6ZMuP_UFR976E56Z4dhdRvUcxkcPhqU6jJvOZN5YwudboROjY3Htx4-QTosoi4cvDeiAHBKhfLs',
            'status': 'active',
            'last_login': datetime.now().isoformat()
        }
    
    def get_profile(self):
        """Get the current admin profile data"""
        return self.profile_data
    
    def update_profile(self, data):
        """Update admin profile information"""
        # In a real implementation, this would update the database
        for key in ['first_name', 'last_name', 'email', 'phone', 'location', 'bio']:
            if key in data:
                self.profile_data[key] = data[key]
        return self.profile_data
    
    def change_password(self, current_password, new_password):
        """Change admin password"""
        # Logic for password change would go here (validation, hashing, DB update)
        # Mock success for now
        return True, "Mật khẩu đã được thay đổi thành công."
