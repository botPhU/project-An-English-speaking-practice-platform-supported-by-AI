"""
Badge Controller for AESP Platform
API endpoints for badges and achievements system
"""

from flask import Blueprint, request, jsonify
from flasgger import swag_from
from services.badge_service import badge_service

badge_bp = Blueprint('badges', __name__, url_prefix='/api/badges')


@badge_bp.route('/', methods=['GET'])
@swag_from({
    'tags': ['Badges'],
    'summary': 'Get all available badges',
    'parameters': [
        {'name': 'category', 'in': 'query', 'type': 'string', 'required': False,
         'description': 'Filter by category: streak, practice, score, level, special'}
    ],
    'responses': {
        '200': {
            'description': 'List of all badges',
            'schema': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'id': {'type': 'integer'},
                        'name': {'type': 'string'},
                        'description': {'type': 'string'},
                        'icon': {'type': 'string'},
                        'category': {'type': 'string'},
                        'rarity': {'type': 'string'},
                        'points': {'type': 'integer'}
                    }
                }
            }
        }
    }
})
def get_all_badges():
    """Get all available badges"""
    category = request.args.get('category', None)
    badges = badge_service.get_all_badges(category)
    return jsonify(badges), 200


@badge_bp.route('/user/<int:user_id>', methods=['GET'])
@swag_from({
    'tags': ['Badges'],
    'summary': 'Get user badges',
    'parameters': [
        {'name': 'user_id', 'in': 'path', 'type': 'integer', 'required': True}
    ],
    'responses': {
        '200': {
            'description': 'User badges with earned/locked status',
            'schema': {
                'type': 'object',
                'properties': {
                    'earned': {'type': 'array'},
                    'locked': {'type': 'array'},
                    'total_earned': {'type': 'integer'},
                    'total_available': {'type': 'integer'},
                    'total_points': {'type': 'integer'},
                    'completion_percentage': {'type': 'number'}
                }
            }
        }
    }
})
def get_user_badges(user_id):
    """Get all badges for a specific user"""
    result = badge_service.get_user_badges(user_id)
    return jsonify(result), 200


@badge_bp.route('/user/<int:user_id>/check', methods=['POST'])
@swag_from({
    'tags': ['Badges'],
    'summary': 'Check and award badges',
    'parameters': [
        {'name': 'user_id', 'in': 'path', 'type': 'integer', 'required': True}
    ],
    'responses': {
        '200': {
            'description': 'Newly earned badges',
            'schema': {
                'type': 'object',
                'properties': {
                    'newly_earned': {'type': 'array'},
                    'count': {'type': 'integer'}
                }
            }
        }
    }
})
def check_badges(user_id):
    """Check user progress and award any new badges"""
    newly_earned = badge_service.check_and_award_badges(user_id)
    return jsonify({
        'newly_earned': newly_earned,
        'count': len(newly_earned)
    }), 200


@badge_bp.route('/user/<int:user_id>/recent', methods=['GET'])
@swag_from({
    'tags': ['Badges'],
    'summary': 'Get recent achievements',
    'parameters': [
        {'name': 'user_id', 'in': 'path', 'type': 'integer', 'required': True},
        {'name': 'limit', 'in': 'query', 'type': 'integer', 'required': False, 'default': 5}
    ],
    'responses': {
        '200': {'description': 'Recent achievements'}
    }
})
def get_recent_achievements(user_id):
    """Get user's recently earned badges"""
    limit = request.args.get('limit', 5, type=int)
    recent = badge_service.get_recent_achievements(user_id, limit)
    return jsonify(recent), 200


@badge_bp.route('/user/<int:user_id>/progress', methods=['GET'])
@swag_from({
    'tags': ['Badges'],
    'summary': 'Get badge progress',
    'parameters': [
        {'name': 'user_id', 'in': 'path', 'type': 'integer', 'required': True}
    ],
    'responses': {
        '200': {
            'description': 'Progress toward next badges',
            'schema': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'badge': {'type': 'object'},
                        'current_value': {'type': 'integer'},
                        'target_value': {'type': 'integer'},
                        'percentage': {'type': 'number'}
                    }
                }
            }
        }
    }
})
def get_badge_progress(user_id):
    """Get user's progress toward next badges"""
    progress = badge_service.get_badge_progress(user_id)
    return jsonify(progress), 200


@badge_bp.route('/seed', methods=['POST'])
@swag_from({
    'tags': ['Badges'],
    'summary': 'Seed default badges (admin only)',
    'responses': {
        '200': {'description': 'Number of badges seeded'}
    }
})
def seed_badges():
    """Seed default badges into database"""
    try:
        count = badge_service.seed_badges()
        return jsonify({
            'message': f'Successfully seeded {count} badges',
            'count': count
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
