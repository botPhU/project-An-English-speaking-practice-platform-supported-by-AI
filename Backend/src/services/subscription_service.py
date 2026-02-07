"""
Subscription Service
Business logic for subscription management - Real Database Implementation
"""
from datetime import datetime, timedelta
import json
from infrastructure.databases.mssql import get_db_session
from infrastructure.models.user_model import UserModel
from infrastructure.models.subscription_models import (
    SubscriptionPlanModel, UserSubscriptionModel, PaymentHistoryModel
)


class SubscriptionService:
    """Service for subscription management"""

    # ==================== PLANS ====================

    def get_all_plans(self):
        """Get all available subscription plans from database"""
        try:
            with get_db_session() as session:
                plans = session.query(SubscriptionPlanModel)\
                    .filter_by(is_active=True)\
                    .order_by(SubscriptionPlanModel.sort_order)\
                    .all()
                
                result = []
                for p in plans:
                    features = []
                    limitations = []
                    
                    if p.features:
                        try:
                            features = json.loads(p.features)
                        except json.JSONDecodeError:
                            features = [p.features]
                    
                    if p.limitations:
                        try:
                            limitations = json.loads(p.limitations)
                        except json.JSONDecodeError:
                            limitations = [p.limitations]
                    
                    plan_data = {
                        'id': p.id,
                        'name': p.name,
                        'price': p.price,
                        'currency': p.currency,
                        'period': p.period,
                        'features': features,
                        'popular': p.is_popular,
                        'mentor_sessions': p.mentor_sessions
                    }
                    
                    if limitations:
                        plan_data['limitations'] = limitations
                    if p.original_price:
                        plan_data['original_price'] = p.original_price
                    if p.discount_percent:
                        plan_data['discount'] = f'{p.discount_percent}%'
                    
                    result.append(plan_data)
                
                return result if result else []
        except Exception as e:
            print(f"Get plans error: {e}")
            return []

    # ==================== USER SUBSCRIPTION ====================

    def get_user_subscription(self, user_id):
        """Get user's current subscription from database"""
        try:
            with get_db_session() as session:
                subscription = session.query(UserSubscriptionModel)\
                    .filter_by(user_id=user_id)\
                    .filter(UserSubscriptionModel.status.in_(['active', 'paused']))\
                    .order_by(UserSubscriptionModel.created_at.desc())\
                    .first()
                
                if not subscription:
                    # Return default free plan info
                    return {
                        'id': 0,
                        'user_id': user_id,
                        'plan': {'id': 0, 'name': 'Free', 'price': 0},
                        'status': 'free',
                        'started_at': None,
                        'expires_at': None,
                        'auto_renew': False,
                        'mentor_sessions_remaining': 0
                    }
                
                plan = session.query(SubscriptionPlanModel).get(subscription.plan_id)
                
                return {
                    'id': subscription.id,
                    'user_id': user_id,
                    'plan': {
                        'id': plan.id if plan else 0,
                        'name': plan.name if plan else 'Unknown',
                        'price': plan.price if plan else 0
                    },
                    'status': subscription.status,
                    'started_at': subscription.started_at.isoformat() if subscription.started_at else None,
                    'expires_at': subscription.expires_at.isoformat() if subscription.expires_at else None,
                    'auto_renew': subscription.auto_renew,
                    'payment_method': subscription.payment_method,
                    'mentor_sessions_remaining': subscription.mentor_sessions_remaining or 0
                }
        except Exception as e:
            print(f"Get user subscription error: {e}")
            return {'user_id': user_id, 'status': 'error', 'error': str(e)}

    def create_subscription(self, user_id, plan_id, payment_method):
        """Create a new subscription"""
        try:
            with get_db_session() as session:
                plan = session.query(SubscriptionPlanModel).get(plan_id)
                if not plan:
                    return 0
                
                # Calculate expiry date
                if plan.period == 'year':
                    expires_at = datetime.now() + timedelta(days=365)
                else:
                    expires_at = datetime.now() + timedelta(days=30)
                
                # Cancel any existing active subscription
                existing = session.query(UserSubscriptionModel)\
                    .filter_by(user_id=user_id, status='active').first()
                if existing:
                    existing.status = 'upgraded'
                    existing.cancelled_at = datetime.now()
                
                # Create new subscription
                subscription = UserSubscriptionModel(
                    user_id=user_id,
                    plan_id=plan_id,
                    status='active',
                    started_at=datetime.now(),
                    expires_at=expires_at,
                    auto_renew=True,
                    payment_method=payment_method,
                    mentor_sessions_remaining=plan.mentor_sessions or 0,
                    created_at=datetime.now()
                )
                session.add(subscription)
                session.flush()
                
                # Create payment record
                payment = PaymentHistoryModel(
                    user_id=user_id,
                    subscription_id=subscription.id,
                    amount=plan.price,
                    currency=plan.currency,
                    payment_method=payment_method,
                    status='completed',
                    description=f'Subscription: {plan.name}',
                    paid_at=datetime.now(),
                    created_at=datetime.now()
                )
                session.add(payment)
                
                return subscription.id
        except Exception as e:
            print(f"Create subscription error: {e}")
            return 0

    def upgrade_subscription(self, user_id, new_plan_id):
        """Upgrade to a higher plan"""
        try:
            with get_db_session() as session:
                current_sub = session.query(UserSubscriptionModel)\
                    .filter_by(user_id=user_id, status='active').first()
                
                new_plan = session.query(SubscriptionPlanModel).get(new_plan_id)
                if not new_plan:
                    return False
                
                if current_sub:
                    # Mark old as upgraded
                    current_sub.status = 'upgraded'
                    current_sub.cancelled_at = datetime.now()
                
                # Create new subscription
                expires_at = datetime.now() + timedelta(days=365 if new_plan.period == 'year' else 30)
                
                new_subscription = UserSubscriptionModel(
                    user_id=user_id,
                    plan_id=new_plan_id,
                    status='active',
                    started_at=datetime.now(),
                    expires_at=expires_at,
                    auto_renew=True,
                    payment_method=current_sub.payment_method if current_sub else 'credit_card',
                    mentor_sessions_remaining=new_plan.mentor_sessions or 0,
                    created_at=datetime.now()
                )
                session.add(new_subscription)
                
                return True
        except Exception as e:
            print(f"Upgrade subscription error: {e}")
            return False

    def cancel_subscription(self, user_id, reason):
        """Cancel current subscription"""
        try:
            with get_db_session() as session:
                subscription = session.query(UserSubscriptionModel)\
                    .filter_by(user_id=user_id, status='active').first()
                
                if not subscription:
                    return None
                
                subscription.status = 'cancelled'
                subscription.cancelled_at = datetime.now()
                subscription.cancel_reason = reason
                subscription.auto_renew = False
                
                # Return effective date (end of billing period)
                effective_date = subscription.expires_at or (datetime.now() + timedelta(days=30))
                return effective_date.strftime('%Y-%m-%d')
        except Exception as e:
            print(f"Cancel subscription error: {e}")
            return None

    # ==================== HISTORY ====================

    def get_subscription_history(self, user_id):
        """Get subscription history from database"""
        try:
            with get_db_session() as session:
                from sqlalchemy import func
                
                subscriptions = session.query(UserSubscriptionModel)\
                    .filter_by(user_id=user_id)\
                    .order_by(UserSubscriptionModel.created_at.desc())\
                    .all()
                
                history = []
                for sub in subscriptions:
                    plan = session.query(SubscriptionPlanModel).get(sub.plan_id)
                    history.append({
                        'id': sub.id,
                        'plan': plan.name if plan else 'Unknown',
                        'price': plan.price if plan else 0,
                        'started_at': sub.started_at.strftime('%Y-%m-%d') if sub.started_at else None,
                        'ended_at': sub.cancelled_at.strftime('%Y-%m-%d') if sub.cancelled_at else None,
                        'status': sub.status
                    })
                
                # Calculate total spent
                total_spent = session.query(func.sum(PaymentHistoryModel.amount))\
                    .filter_by(user_id=user_id, status='completed').scalar() or 0
                
                # Get member since
                first_sub = session.query(UserSubscriptionModel)\
                    .filter_by(user_id=user_id)\
                    .order_by(UserSubscriptionModel.created_at.asc())\
                    .first()
                
                return {
                    'user_id': user_id,
                    'history': history,
                    'total_spent': float(total_spent),
                    'member_since': first_sub.started_at.strftime('%Y-%m-%d') if first_sub and first_sub.started_at else None
                }
        except Exception as e:
            print(f"Subscription history error: {e}")
            return {'user_id': user_id, 'history': [], 'total_spent': 0}
