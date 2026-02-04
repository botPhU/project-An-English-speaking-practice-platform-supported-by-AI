from flask import Blueprint, request, jsonify
from flasgger import swag_from
from services.purchase_service import PurchaseService

purchase_bp = Blueprint('purchase', __name__, url_prefix='/api/purchase')
purchase_service = PurchaseService()

# ==================== PACKAGES ====================
@purchase_bp.route('/packages', methods=['GET'])
@swag_from({
    'tags': ['Purchase'],
    'summary': 'Get all available packages',
    'responses': {'200': {'description': 'List of packages'}}
})
def get_packages():
    """Get all available packages"""
    active_only = request.args.get('active_only', 'true').lower() == 'true'
    packages = purchase_service.get_all_packages(active_only)
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'description': p.description,
        'price': p.price,
        'duration_days': p.duration_days,
        'has_mentor': p.has_mentor,
        'has_ai_advanced': p.has_ai_advanced,
        'max_sessions_per_month': p.max_sessions_per_month,
        'features': p.features
    } for p in packages]), 200

@purchase_bp.route('/packages/<int:package_id>', methods=['GET'])
@swag_from({
    'tags': ['Purchase'],
    'summary': 'Get package by ID',
    'responses': {'200': {'description': 'Package details'}}
})
def get_package(package_id):
    """Get package by ID"""
    package = purchase_service.get_package_by_id(package_id)
    if package:
        return jsonify({
            'id': package.id,
            'name': package.name,
            'description': package.description,
            'price': package.price,
            'duration_days': package.duration_days,
            'has_mentor': package.has_mentor,
            'has_ai_advanced': package.has_ai_advanced,
            'max_sessions_per_month': package.max_sessions_per_month,
            'features': package.features
        }), 200
    return jsonify({'error': 'Package not found'}), 404

# ==================== PURCHASES ====================
@purchase_bp.route('/user/<int:user_id>', methods=['GET'])
@swag_from({
    'tags': ['Purchase'],
    'summary': 'Get user purchases',
    'responses': {'200': {'description': 'List of purchases'}}
})
def get_user_purchases(user_id):
    """Get all purchases for a user"""
    purchases = purchase_service.get_user_purchases(user_id)
    return jsonify([{
        'id': p.id,
        'package_id': p.package_id,
        'amount': p.amount,
        'status': p.status,
        'payment_method': p.payment_method,
        'start_date': str(p.start_date) if p.start_date else None,
        'end_date': str(p.end_date) if p.end_date else None,
        'created_at': str(p.created_at) if p.created_at else None
    } for p in purchases]), 200

@purchase_bp.route('/', methods=['POST'])
@swag_from({
    'tags': ['Purchase'],
    'summary': 'Create a new purchase',
    'responses': {'201': {'description': 'Purchase created'}}
})
def create_purchase():
    """Create a new purchase"""
    data = request.get_json()
    user_id = data.get('user_id')
    package_id = data.get('package_id')
    payment_method = data.get('payment_method')
    
    purchase = purchase_service.create_purchase(user_id, package_id, payment_method)
    if purchase:
        return jsonify({
            'id': purchase.id,
            'amount': purchase.amount,
            'status': purchase.status,
            'message': 'Purchase created. Awaiting payment.'
        }), 201
    return jsonify({'error': 'Failed to create purchase'}), 400

@purchase_bp.route('/<int:purchase_id>/complete', methods=['POST'])
@swag_from({
    'tags': ['Purchase'],
    'summary': 'Complete a purchase',
    'responses': {'200': {'description': 'Purchase completed'}}
})
def complete_purchase(purchase_id):
    """Complete a purchase after payment"""
    data = request.get_json()
    transaction_id = data.get('transaction_id')
    
    purchase = purchase_service.complete_purchase(purchase_id, transaction_id)
    if purchase:
        return jsonify({
            'id': purchase.id,
            'status': purchase.status,
            'start_date': str(purchase.start_date),
            'end_date': str(purchase.end_date),
            'message': 'Purchase completed successfully'
        }), 200
    return jsonify({'error': 'Failed to complete purchase'}), 400

@purchase_bp.route('/<int:purchase_id>/cancel', methods=['POST'])
@swag_from({
    'tags': ['Purchase'],
    'summary': 'Cancel a purchase',
    'responses': {'200': {'description': 'Purchase cancelled'}}
})
def cancel_purchase(purchase_id):
    """Cancel a pending purchase"""
    purchase = purchase_service.cancel_purchase(purchase_id)
    return jsonify({'message': 'Purchase cancelled'}), 200

# ==================== SUBSCRIPTION ====================
@purchase_bp.route('/subscription/<int:user_id>', methods=['GET'])
@swag_from({
    'tags': ['Purchase'],
    'summary': 'Check subscription status',
    'responses': {'200': {'description': 'Subscription status'}}
})
def check_subscription(user_id):
    """Check if user has active subscription"""
    status = purchase_service.check_subscription_status(user_id)
    return jsonify(status), 200

@purchase_bp.route('/subscription/upgrade', methods=['POST'])
@swag_from({
    'tags': ['Purchase'],
    'summary': 'Upgrade subscription',
    'responses': {'201': {'description': 'Upgrade initiated'}}
})
def upgrade_subscription():
    """Upgrade to a new package"""
    data = request.get_json()
    user_id = data.get('user_id')
    new_package_id = data.get('package_id')
    
    purchase = purchase_service.upgrade_subscription(user_id, new_package_id)
    if purchase:
        return jsonify({
            'id': purchase.id,
            'message': 'Subscription upgrade initiated'
        }), 201
    return jsonify({'error': 'Failed to upgrade'}), 400

# ==================== ADMIN STATS ====================
@purchase_bp.route('/stats', methods=['GET'])
@swag_from({
    'tags': ['Purchase'],
    'summary': 'Get purchase statistics (Admin)',
    'responses': {'200': {'description': 'Purchase stats'}}
})
def get_stats():
    """Get purchase statistics for admin"""
    stats = purchase_service.get_purchase_stats()
    return jsonify(stats), 200
