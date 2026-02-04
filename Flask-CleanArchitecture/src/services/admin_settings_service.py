class AdminSettingsService:
    """Service for managing global system settings"""
    
    def __init__(self):
        # Mock settings data matching frontend AdminSettings structure
        self.settings = {
            'general': {
                'app_name': 'AESP Learning Platform',
                'admin_email': 'admin@aesp.vn',
                'default_language': 'vi',
                'timezone': 'UTC+7',
                'date_format': 'DD/MM/YYYY'
            },
            'security': {
                'min_password_length': 8,
                'session_timeout': 60,
                'complexity_requirements': {
                    'uppercase': True,
                    'numbers': True,
                    'special_chars': True
                },
                'force_password_change_90d': False,
                'two_factor_auth_required': True
            },
            'integrations': [
                {
                    'id': 'payment',
                    'name': 'Cổng thanh toán (VNPay / Momo)',
                    'status': 'active',
                    'icon': 'payments'
                },
                {
                    'id': 'ai',
                    'name': 'AI Engine (OpenAI / Gemini)',
                    'status': 'active',
                    'icon': 'smart_toy'
                },
                {
                    'id': 'analytics',
                    'name': 'Google Analytics',
                    'status': 'disconnected',
                    'icon': 'monitoring'
                }
            ],
            'performance': {
                'cache_duration_hours': 12,
                'bandwidth_saving_mode': False,
                'debug_mode': False
            }
        }
    
    def get_settings(self):
        """Get all system settings"""
        return self.settings
    
    def update_general_settings(self, data):
        """Update general system settings"""
        for key in self.settings['general']:
            if key in data:
                self.settings['general'][key] = data[key]
        return self.settings['general']
    
    def update_security_settings(self, data):
        """Update security policies"""
        for key in self.settings['security']:
            if key in data:
                self.settings['security'][key] = data[key]
        return self.settings['security']
    
    def update_performance_settings(self, data):
        """Update performance configurations"""
        for key in self.settings['performance']:
            if key in data:
                self.settings['performance'][key] = data[key]
        return self.settings['performance']
    
    def toggle_integration(self, integration_id, active):
        """Enable or disable an integration service"""
        for item in self.settings['integrations']:
            if item['id'] == integration_id:
                item['status'] = 'active' if active else 'disconnected'
                return item
        return None
