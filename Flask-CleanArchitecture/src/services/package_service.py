from datetime import datetime

class PackageService:
    """Service for package/subscription management"""
    
    def __init__(self):
        # Mock packages data
        self.mock_packages = [
            {
                'id': 1,
                'name': 'Basic Monthly',
                'slug': 'basic-monthly',
                'price': 149000,
                'duration_months': 1,
                'features': ['AI Speaking Practice', 'Basic Lessons', 'Progress Tracking'],
                'status': 'active',
                'sales_count': 850,
                'created_at': '2024-01-01'
            },
            {
                'id': 2,
                'name': 'Premium Monthly',
                'slug': 'premium-monthly',
                'price': 299000,
                'duration_months': 1,
                'features': ['All Basic Features', 'Mentor Support', 'Advanced Lessons', 'Certificates'],
                'status': 'active',
                'sales_count': 1240,
                'created_at': '2024-01-01'
            },
            {
                'id': 3,
                'name': 'Premium 6 Months',
                'slug': 'premium-6months',
                'price': 1499000,
                'duration_months': 6,
                'features': ['All Premium Features', '15% Discount', 'Priority Support'],
                'status': 'active',
                'sales_count': 320,
                'created_at': '2024-01-01'
            },
            {
                'id': 4,
                'name': 'Enterprise',
                'slug': 'enterprise',
                'price': 12000000,
                'duration_months': 12,
                'features': ['All Features', 'Custom Training', 'Dedicated Support', 'API Access'],
                'status': 'active',
                'sales_count': 15,
                'created_at': '2024-02-01'
            },
        ]
    
    def list_packages(self, status=None):
        """Get all packages"""
        packages = self.mock_packages.copy()
        if status:
            packages = [p for p in packages if p['status'] == status]
        return packages
    
    def get_package(self, package_id):
        """Get package by ID"""
        return next((p for p in self.mock_packages if p['id'] == package_id), None)
    
    def create_package(self, data):
        """Create new package"""
        new_package = {
            'id': max(p['id'] for p in self.mock_packages) + 1,
            'created_at': datetime.now().isoformat(),
            'sales_count': 0,
            **data
        }
        self.mock_packages.append(new_package)
        return new_package
    
    def update_package(self, package_id, data):
        """Update package"""
        package = self.get_package(package_id)
        if not package:
            return None
        
        for key in ['name', 'slug', 'price', 'duration_months', 'features', 'status']:
            if key in data:
                package[key] = data[key]
        
        return package
    
    def delete_package(self, package_id):
        """Delete package"""
        package = self.get_package(package_id)
        if package:
            package['status'] = 'deleted'
            return True
        return False
