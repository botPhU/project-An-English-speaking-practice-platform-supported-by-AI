"""
Subscription Controller
API endpoints for subscription management
"""

from flask import Blueprint, request, jsonify
from flasgger import swag_from
from services.subscription_service import SubscriptionService

subscription_bp = Blueprint('subscriptions', __name__, url_prefix='/api/subscriptions')
service = SubscriptionService()


# ==================== PLANS ====================

@subscription_bp.route('/plans', methods=['GET'])
@swag_from({
    'tags': ['Subscriptions'],
    'summary': 'Get available subscription plans',
    'responses': {'200': {'description': 'List of plans'}}
})
def get_plans():
    """Get all available subscription plans"""
    plans = service.get_all_plans()
    return jsonify(plans), 200


# ==================== USER SUBSCRIPTION ====================

@subscription_bp.route('/my-subscription', methods=['GET'])
@swag_from({
    'tags': ['Subscriptions'],
    'summary': 'Get current subscription',
    'parameters': [{'name': 'user_id', 'in': 'query', 'type': 'integer', 'required': True}],
    'responses': {'200': {'description': 'Current subscription details'}}
})
def get_my_subscription():
    """Get user's current subscription"""
    user_id = request.args.get('user_id', type=int)
    subscription = service.get_user_subscription(user_id)
    if subscription:
        return jsonify(subscription), 200
    return jsonify({'message': 'No active subscription', 'plan': 'free'}), 200


@subscription_bp.route('/', methods=['POST'])
@swag_from({
    'tags': ['Subscriptions'],
    'summary': 'Subscribe to a plan',
    'responses': {'201': {'description': 'Subscription created'}}
})
def create_subscription():
    """Create a new subscription"""
    data = request.get_json()
    user_id = data.get('user_id')
    plan_id = data.get('plan_id')
    payment_method = data.get('payment_method')
    
    subscription = service.create_subscription(user_id, plan_id, payment_method)
    return jsonify({
        'message': 'Subscription created successfully',
        'subscription_id': subscription,
        'status': 'active'
    }), 201


@subscription_bp.route('/upgrade', methods=['PUT'])
@swag_from({
    'tags': ['Subscriptions'],
    'summary': 'Upgrade subscription plan',
    'responses': {'200': {'description': 'Subscription upgraded'}}
})
def upgrade_subscription():
    """Upgrade to a higher plan"""
    data = request.get_json()
    user_id = data.get('user_id')
    new_plan_id = data.get('plan_id')
    
    result = service.upgrade_subscription(user_id, new_plan_id)
    if result:
        return jsonify({
            'message': 'Subscription upgraded successfully',
            'new_plan': new_plan_id
        }), 200
    return jsonify({'error': 'Cannot upgrade subscription'}), 400


@subscription_bp.route('/cancel', methods=['DELETE'])
@swag_from({
    'tags': ['Subscriptions'],
    'summary': 'Cancel subscription',
    'responses': {'200': {'description': 'Subscription cancelled'}}
})
def cancel_subscription():
    """Cancel current subscription"""
    data = request.get_json()
    user_id = data.get('user_id')
    reason = data.get('reason', '')
    
    result = service.cancel_subscription(user_id, reason)
    if result:
        return jsonify({
            'message': 'Subscription cancelled',
            'effective_date': result
        }), 200
    return jsonify({'error': 'Cannot cancel subscription'}), 400


# ==================== HISTORY ====================

@subscription_bp.route('/history', methods=['GET'])
@swag_from({
    'tags': ['Subscriptions'],
    'summary': 'Get subscription history',
    'parameters': [{'name': 'user_id', 'in': 'query', 'type': 'integer', 'required': True}],
    'responses': {'200': {'description': 'Subscription history'}}
})
def get_subscription_history():
    """Get user's subscription history"""
    user_id = request.args.get('user_id', type=int)
    history = service.get_subscription_history(user_id)
    return jsonify(history), 200
