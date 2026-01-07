"""
Community Controller
API endpoints for learner community features
"""

from flask import Blueprint, request, jsonify
from flasgger import swag_from
from services.community_service import CommunityService

community_bp = Blueprint('community', __name__, url_prefix='/api/community')
service = CommunityService()


# ==================== ONLINE LEARNERS ====================

@community_bp.route('/online-learners', methods=['GET'])
@swag_from({
    'tags': ['Community'],
    'summary': 'Get online learners',
    'parameters': [
        {'name': 'level', 'in': 'query', 'type': 'string', 'required': False}
    ],
    'responses': {'200': {'description': 'List of online learners'}}
})
def get_online_learners():
    """Get list of learners currently online"""
    level = request.args.get('level', 'all')
    learners = service.get_online_learners(level)
    return jsonify(learners), 200


# ==================== INVITATIONS ====================

@community_bp.route('/invite/<int:learner_id>', methods=['POST'])
@swag_from({
    'tags': ['Community'],
    'summary': 'Send practice invitation',
    'parameters': [{'name': 'learner_id', 'in': 'path', 'type': 'integer', 'required': True}],
    'responses': {'201': {'description': 'Invitation sent'}}
})
def send_invitation(learner_id):
    """Send practice invitation to another learner"""
    data = request.get_json()
    sender_id = data.get('sender_id')
    topic = data.get('topic', '')
    invitation = service.send_invitation(sender_id, learner_id, topic)
    return jsonify({'message': 'Invitation sent', 'id': invitation}), 201


@community_bp.route('/my-invitations', methods=['GET'])
@swag_from({
    'tags': ['Community'],
    'summary': 'Get my invitations',
    'parameters': [{'name': 'user_id', 'in': 'query', 'type': 'integer', 'required': True}],
    'responses': {'200': {'description': 'List of invitations'}}
})
def get_my_invitations():
    """Get invitations received"""
    user_id = request.args.get('user_id', type=int)
    invitations = service.get_invitations(user_id)
    return jsonify(invitations), 200


@community_bp.route('/invitations/<int:invitation_id>/respond', methods=['PUT'])
@swag_from({
    'tags': ['Community'],
    'summary': 'Respond to invitation',
    'parameters': [{'name': 'invitation_id', 'in': 'path', 'type': 'integer', 'required': True}],
    'responses': {'200': {'description': 'Response recorded'}}
})
def respond_invitation(invitation_id):
    """Accept or decline an invitation"""
    data = request.get_json()
    action = data.get('action')  # 'accept' or 'decline'
    result = service.respond_to_invitation(invitation_id, action)
    return jsonify({'message': f'Invitation {action}ed', 'session_id': result}), 200


# ==================== QUICK MATCH ====================

@community_bp.route('/quick-match', methods=['POST'])
@swag_from({
    'tags': ['Community'],
    'summary': 'Find quick practice partner',
    'responses': {'200': {'description': 'Match result'}}
})
def quick_match():
    """Find a random practice partner"""
    data = request.get_json()
    user_id = data.get('user_id')
    level = data.get('level')
    topic = data.get('topic')
    match = service.find_quick_match(user_id, level, topic)
    return jsonify(match), 200


@community_bp.route('/match-status/<int:match_id>', methods=['GET'])
@swag_from({
    'tags': ['Community'],
    'summary': 'Get match status',
    'parameters': [{'name': 'match_id', 'in': 'path', 'type': 'integer', 'required': True}],
    'responses': {'200': {'description': 'Match status'}}
})
def get_match_status(match_id):
    """Get status of a match"""
    status = service.get_match_status(match_id)
    return jsonify(status), 200


# ==================== PEER PRACTICE SESSIONS ====================

@community_bp.route('/sessions', methods=['POST'])
@swag_from({
    'tags': ['Community'],
    'summary': 'Create peer practice session',
    'responses': {'201': {'description': 'Session created'}}
})
def create_session():
    """Create a new peer practice session"""
    data = request.get_json()
    session = service.create_peer_session(data)
    return jsonify({'message': 'Session created', 'id': session}), 201


@community_bp.route('/sessions/<int:session_id>', methods=['GET'])
@swag_from({
    'tags': ['Community'],
    'summary': 'Get session details',
    'parameters': [{'name': 'session_id', 'in': 'path', 'type': 'integer', 'required': True}],
    'responses': {'200': {'description': 'Session details'}}
})
def get_session(session_id):
    """Get details of a peer session"""
    session = service.get_session_details(session_id)
    return jsonify(session), 200


@community_bp.route('/sessions/<int:session_id>/complete', methods=['POST'])
@swag_from({
    'tags': ['Community'],
    'summary': 'Complete peer session',
    'parameters': [{'name': 'session_id', 'in': 'path', 'type': 'integer', 'required': True}],
    'responses': {'200': {'description': 'Session completed'}}
})
def complete_session(session_id):
    """Complete a peer practice session"""
    data = request.get_json()
    result = service.complete_session(session_id, data)
    return jsonify({'message': 'Session completed', 'xp_earned': result}), 200


# ==================== REVIEWS & RATINGS ====================

@community_bp.route('/reviews/pending', methods=['GET'])
@swag_from({
    'tags': ['Community'],
    'summary': 'Get pending reviews',
    'parameters': [{'name': 'user_id', 'in': 'query', 'type': 'integer', 'required': True}],
    'responses': {'200': {'description': 'List of pending reviews'}}
})
def get_pending_reviews():
    """Get sessions pending review"""
    user_id = request.args.get('user_id', type=int)
    reviews = service.get_pending_reviews(user_id)
    return jsonify(reviews), 200


@community_bp.route('/reviews', methods=['POST'])
@swag_from({
    'tags': ['Community'],
    'summary': 'Create review',
    'responses': {'201': {'description': 'Review created'}}
})
def create_review():
    """Create a new review"""
    data = request.get_json()
    review = service.create_review(data)
    return jsonify({'message': 'Review submitted', 'id': review}), 201


@community_bp.route('/reviews/mentor/<int:mentor_id>', methods=['GET'])
@swag_from({
    'tags': ['Community'],
    'summary': 'Get mentor reviews',
    'parameters': [{'name': 'mentor_id', 'in': 'path', 'type': 'integer', 'required': True}],
    'responses': {'200': {'description': 'List of reviews'}}
})
def get_mentor_reviews(mentor_id):
    """Get all reviews for a mentor"""
    page = request.args.get('page', 1, type=int)
    reviews = service.get_mentor_reviews(mentor_id, page)
    return jsonify(reviews), 200
