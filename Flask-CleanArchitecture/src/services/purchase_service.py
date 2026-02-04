from infrastructure.models.purchase_model import PurchaseModel
from infrastructure.models.package_model import PackageModel
from infrastructure.databases.mssql import session as db_session
from datetime import datetime, timedelta

class PurchaseService:
    """Service for Purchase/Subscription business logic"""
    
    def __init__(self):
        pass
    
    def _get_session(self):
        return db_session
    
    # ==================== PACKAGES ====================
    def get_all_packages(self, active_only: bool = True):
        """Get all available packages"""
        session = self._get_session()
        try:
            query = session.query(PackageModel)
            if active_only:
                query = query.filter_by(is_active=True)
            packages = query.all()
            return packages
        finally:
            session.close()
    
    def get_package_by_id(self, package_id: int):
        """Get package by ID"""
        session = self._get_session()
        try:
            package = session.query(PackageModel).get(package_id)
            return package
        finally:
            session.close()
    
    # ==================== PURCHASES ====================
    def get_user_purchases(self, user_id: int):
        """Get all purchases for a user"""
        session = self._get_session()
        try:
            purchases = session.query(PurchaseModel)\
                .filter_by(user_id=user_id)\
                .order_by(PurchaseModel.created_at.desc())\
                .all()
            return purchases
        finally:
            session.close()
    
    def get_active_subscription(self, user_id: int):
        """Get user's active subscription"""
        session = self._get_session()
        try:
            now = datetime.now()
            active = session.query(PurchaseModel)\
                .filter_by(user_id=user_id, status='completed')\
                .filter(PurchaseModel.end_date > now)\
                .first()
            return active
        finally:
            session.close()
    
    def create_purchase(self, user_id: int, package_id: int, payment_method: str = None):
        """Create a new purchase"""
        session = self._get_session()
        try:
            package = session.query(PackageModel).get(package_id)
            if not package:
                return None
            
            purchase = PurchaseModel(
                user_id=user_id,
                package_id=package_id,
                amount=package.price,
                status='pending',
                payment_method=payment_method,
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            session.add(purchase)
            session.commit()
            return purchase
        finally:
            session.close()
    
    def complete_purchase(self, purchase_id: int, transaction_id: str = None):
        """Complete a purchase after payment"""
        session = self._get_session()
        try:
            purchase = session.query(PurchaseModel).get(purchase_id)
            if purchase:
                package = session.query(PackageModel).get(purchase.package_id)
                
                purchase.status = 'completed'
                purchase.transaction_id = transaction_id
                purchase.start_date = datetime.now()
                purchase.end_date = datetime.now() + timedelta(days=package.duration_days)
                purchase.updated_at = datetime.now()
                session.commit()
            return purchase
        finally:
            session.close()
    
    def cancel_purchase(self, purchase_id: int):
        """Cancel a pending purchase"""
        session = self._get_session()
        try:
            purchase = session.query(PurchaseModel).get(purchase_id)
            if purchase and purchase.status == 'pending':
                purchase.status = 'cancelled'
                purchase.updated_at = datetime.now()
                session.commit()
            return purchase
        finally:
            session.close()
    
    # ==================== SUBSCRIPTION MANAGEMENT ====================
    def upgrade_subscription(self, user_id: int, new_package_id: int):
        """Upgrade to a new package"""
        # Cancel current subscription and create new one
        current = self.get_active_subscription(user_id)
        if current:
            # Prorate refund calculation could be added here
            pass
        return self.create_purchase(user_id, new_package_id)
    
    def check_subscription_status(self, user_id: int):
        """Check if user has active subscription"""
        active = self.get_active_subscription(user_id)
        if active:
            return {
                'is_active': True,
                'package_id': active.package_id,
                'expires_at': active.end_date,
                'days_remaining': (active.end_date - datetime.now()).days
            }
        return {'is_active': False}
    
    # ==================== ADMIN STATS ====================
    def get_purchase_stats(self):
        """Get purchase statistics for admin"""
        session = self._get_session()
        try:
            total = session.query(PurchaseModel).count()
            completed = session.query(PurchaseModel).filter_by(status='completed').count()
            pending = session.query(PurchaseModel).filter_by(status='pending').count()
            
            # Calculate revenue
            from sqlalchemy import func
            revenue = session.query(func.sum(PurchaseModel.amount))\
                .filter_by(status='completed')\
                .scalar() or 0
            
            return {
                'total_purchases': total,
                'completed': completed,
                'pending': pending,
                'total_revenue': revenue
            }
        finally:
            session.close()
