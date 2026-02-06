"""
Package Service - Manages package/subscription data
Uses database instead of mock data
"""
from datetime import datetime
from infrastructure.databases.mssql import get_db_session
from infrastructure.models.package_model import PackageModel
import json


class PackageService:
    """Service for package/subscription management using database"""
    
    def __init__(self):
        pass
    
    def list_packages(self, status=None):
        """Get all packages from database"""
        try:
            with get_db_session() as session:
                query = session.query(PackageModel)
                
                if status:
                    if status == 'active':
                        query = query.filter_by(is_active=True)
                    elif status == 'inactive':
                        query = query.filter_by(is_active=False)
                
                packages = query.order_by(PackageModel.id).all()
                
                result = []
                for p in packages:
                    features = []
                    if p.features:
                        try:
                            features = json.loads(p.features) if isinstance(p.features, str) else p.features
                        except:
                            features = [p.features] if p.features else []
                    
                    result.append({
                        'id': p.id,
                        'name': p.name,
                        'slug': p.name.lower().replace(' ', '-'),
                        'description': p.description or '',
                        'price': float(p.price) if p.price else 0,
                        'duration_days': p.duration_days,
                        'duration_months': (p.duration_days or 30) // 30,
                        'has_mentor': p.has_mentor,
                        'has_ai_advanced': p.has_ai_advanced,
                        'max_sessions_per_month': p.max_sessions_per_month,
                        'features': features,
                        'status': 'active' if p.is_active else 'inactive',
                        'is_active': p.is_active,
                        'sales_count': 0,  # Could be calculated from purchases
                        'created_at': p.created_at.isoformat() if p.created_at else None
                    })
                
                return result
        except Exception as e:
            print(f"List packages error: {e}")
            # Return fallback mock data if database fails
            return self._get_fallback_packages()
    
    def get_package(self, package_id):
        """Get package by ID from database"""
        try:
            with get_db_session() as session:
                p = session.query(PackageModel).get(package_id)
                
                if not p:
                    return None
                
                features = []
                if p.features:
                    try:
                        features = json.loads(p.features) if isinstance(p.features, str) else p.features
                    except:
                        features = [p.features] if p.features else []
                
                return {
                    'id': p.id,
                    'name': p.name,
                    'slug': p.name.lower().replace(' ', '-'),
                    'description': p.description or '',
                    'price': float(p.price) if p.price else 0,
                    'duration_days': p.duration_days,
                    'duration_months': (p.duration_days or 30) // 30,
                    'has_mentor': p.has_mentor,
                    'has_ai_advanced': p.has_ai_advanced,
                    'max_sessions_per_month': p.max_sessions_per_month,
                    'features': features,
                    'status': 'active' if p.is_active else 'inactive',
                    'is_active': p.is_active,
                    'created_at': p.created_at.isoformat() if p.created_at else None
                }
        except Exception as e:
            print(f"Get package error: {e}")
            return None
    
    def create_package(self, data):
        """Create new package in database"""
        try:
            with get_db_session() as session:
                features_str = json.dumps(data.get('features', []))
                
                package = PackageModel(
                    name=data.get('name'),
                    description=data.get('description'),
                    price=data.get('price', 0),
                    duration_days=data.get('duration_days') or (data.get('duration_months', 1) * 30),
                    has_mentor=data.get('has_mentor', False),
                    has_ai_advanced=data.get('has_ai_advanced', False),
                    max_sessions_per_month=data.get('max_sessions_per_month', 10),
                    features=features_str,
                    is_active=data.get('status') != 'inactive',
                    created_at=datetime.now(),
                    updated_at=datetime.now()
                )
                session.add(package)
                session.flush()
                
                return self.get_package(package.id)
        except Exception as e:
            print(f"Create package error: {e}")
            return None
    
    def update_package(self, package_id, data):
        """Update package in database"""
        try:
            with get_db_session() as session:
                package = session.query(PackageModel).get(package_id)
                if not package:
                    return None
                
                if 'name' in data:
                    package.name = data['name']
                if 'description' in data:
                    package.description = data['description']
                if 'price' in data:
                    package.price = data['price']
                if 'duration_days' in data:
                    package.duration_days = data['duration_days']
                if 'duration_months' in data:
                    package.duration_days = data['duration_months'] * 30
                if 'has_mentor' in data:
                    package.has_mentor = data['has_mentor']
                if 'has_ai_advanced' in data:
                    package.has_ai_advanced = data['has_ai_advanced']
                if 'max_sessions_per_month' in data:
                    package.max_sessions_per_month = data['max_sessions_per_month']
                if 'features' in data:
                    package.features = json.dumps(data['features'])
                if 'status' in data:
                    package.is_active = data['status'] == 'active'
                if 'is_active' in data:
                    package.is_active = data['is_active']
                
                package.updated_at = datetime.now()
                
                return self.get_package(package_id)
        except Exception as e:
            print(f"Update package error: {e}")
            return None
    
    def delete_package(self, package_id):
        """Soft delete package (set inactive)"""
        try:
            with get_db_session() as session:
                package = session.query(PackageModel).get(package_id)
                if package:
                    package.is_active = False
                    package.updated_at = datetime.now()
                    return True
                return False
        except Exception as e:
            print(f"Delete package error: {e}")
            return False
    
    def _get_fallback_packages(self):
        """Fallback mock packages if database fails"""
        return [
            {
                'id': 1,
                'name': 'Basic Monthly',
                'slug': 'basic-monthly',
                'price': 149000,
                'duration_months': 1,
                'duration_days': 30,
                'features': ['AI Speaking Practice', 'Basic Lessons', 'Progress Tracking'],
                'status': 'active',
                'is_active': True,
                'has_mentor': False,
                'has_ai_advanced': False,
                'sales_count': 850,
                'created_at': '2024-01-01'
            },
            {
                'id': 2,
                'name': 'Premium Monthly',
                'slug': 'premium-monthly',
                'price': 299000,
                'duration_months': 1,
                'duration_days': 30,
                'features': ['All Basic Features', 'Mentor Support', 'Advanced Lessons', 'Certificates'],
                'status': 'active',
                'is_active': True,
                'has_mentor': True,
                'has_ai_advanced': True,
                'sales_count': 1240,
                'created_at': '2024-01-01'
            }
        ]
