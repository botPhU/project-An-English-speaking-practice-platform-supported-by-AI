"""
Policy Controller for AESP Platform
API endpoints for system policies
"""

from flask import Blueprint, request, jsonify
from datetime import datetime

from services.policy_service import PolicyService

policy_bp = Blueprint('policies', __name__, url_prefix='/api/policies')


@policy_bp.route('/', methods=['GET'])
def get_policies():
    """
    Get all policies with optional filters
    ---
    tags:
      - Policies
    parameters:
      - in: query
        name: type
        type: string
        description: Policy type (terms, privacy, refund, usage)
      - in: query
        name: active_only
        type: boolean
        default: true
    responses:
      200:
        description: List of policies
    """
    policy_type = request.args.get('type')
    active_only = request.args.get('active_only', 'true').lower() == 'true'
    
    policies = PolicyService.get_all_policies(
        policy_type=policy_type,
        active_only=active_only
    )
    
    return jsonify({
        'policies': policies,
        'count': len(policies)
    }), 200


@policy_bp.route('/types', methods=['GET'])
def get_policy_types():
    """Get all policy types"""
    types = PolicyService.get_policy_types()
    return jsonify({'types': types}), 200


@policy_bp.route('/<int:policy_id>', methods=['GET'])
def get_policy(policy_id: int):
    """Get a single policy by ID"""
    policy = PolicyService.get_policy_by_id(policy_id)
    
    if not policy:
        return jsonify({'error': 'Policy not found'}), 404
    
    return jsonify(policy), 200


@policy_bp.route('/type/<policy_type>', methods=['GET'])
def get_policy_by_type(policy_type: str):
    """
    Get active policy by type
    ---
    tags:
      - Policies
    parameters:
      - in: path
        name: policy_type
        type: string
        required: true
        description: terms, privacy, refund, usage
    responses:
      200:
        description: Policy document
      404:
        description: Policy not found
    """
    policy = PolicyService.get_policy_by_type(policy_type)
    
    if not policy:
        return jsonify({'error': f'No active {policy_type} policy found'}), 404
    
    return jsonify(policy), 200


@policy_bp.route('/', methods=['POST'])
def create_policy():
    """
    Create a new policy (Admin only)
    ---
    tags:
      - Policies
    parameters:
      - in: body
        name: body
        schema:
          type: object
          required:
            - title
            - content
          properties:
            title:
              type: string
            content:
              type: string
            policy_type:
              type: string
            version:
              type: string
            effective_date:
              type: string
              format: date
    responses:
      201:
        description: Policy created
    """
    data = request.get_json()
    
    if not data.get('title') or not data.get('content'):
        return jsonify({'error': 'title and content are required'}), 400
    
    effective_date = None
    if data.get('effective_date'):
        try:
            effective_date = datetime.fromisoformat(data['effective_date'])
        except:
            pass
    
    policy = PolicyService.create_policy(
        title=data['title'],
        content=data['content'],
        policy_type=data.get('policy_type'),
        version=data.get('version'),
        effective_date=effective_date,
        created_by=data.get('created_by')
    )
    
    return jsonify(policy), 201


@policy_bp.route('/<int:policy_id>', methods=['PUT'])
def update_policy(policy_id: int):
    """Update a policy (Admin only)"""
    data = request.get_json()
    
    effective_date = None
    if data.get('effective_date'):
        try:
            effective_date = datetime.fromisoformat(data['effective_date'])
        except:
            pass
    
    policy = PolicyService.update_policy(
        policy_id=policy_id,
        title=data.get('title'),
        content=data.get('content'),
        policy_type=data.get('policy_type'),
        version=data.get('version'),
        is_active=data.get('is_active'),
        effective_date=effective_date
    )
    
    if not policy:
        return jsonify({'error': 'Policy not found'}), 404
    
    return jsonify(policy), 200


@policy_bp.route('/<int:policy_id>', methods=['DELETE'])
def delete_policy(policy_id: int):
    """Delete a policy (Admin only) - soft delete"""
    success = PolicyService.delete_policy(policy_id)
    
    if success:
        return jsonify({'message': 'Policy deleted'}), 200
    
    return jsonify({'error': 'Policy not found'}), 404
