"""
Challenge Controller
API endpoints for challenges and gamification
"""

from flask import Blueprint, request, jsonify
from flasgger import swag_from
from services.challenge_service import ChallengeService

challenge_bp = Blueprint('challenges', __name__, url_prefix='/api/challenges')
service = ChallengeService()


# ==================== CHALLENGES ====================

@challenge_bp.route('/', methods=['GET'])
@swag_from({
    'tags': ['Challenges'],
    'summary': 'Get all challenges',
    'parameters': [
        {'name': 'status', 'in': 'query', 'type': 'string', 'required': False},
        {'name': 'difficulty', 'in': 'query', 'type': 'string', 'required': False}
    ],
    'responses': {'200': {'description': 'List of challenges'}}
})
def get_challenges():
    """Get all available challenges"""
    status = request.args.get('status', 'active')
    difficulty = request.args.get('difficulty', 'all')
    challenges = service.get_challenges(status, difficulty)
    return jsonify(challenges), 200


@challenge_bp.route('/<int:challenge_id>', methods=['GET'])
@swag_from({
    'tags': ['Challenges'],
    'summary': 'Get challenge details',
    'parameters': [{'name': 'challenge_id', 'in': 'path', 'type': 'integer', 'required': True}],
    'responses': {'200': {'description': 'Challenge details'}}
})
def get_challenge(challenge_id):
    """Get details of a specific challenge"""
    challenge = service.get_challenge_details(challenge_id)
    if challenge:
        return jsonify(challenge), 200
    return jsonify({'error': 'Challenge not found'}), 404


@challenge_bp.route('/<int:challenge_id>/join', methods=['POST'])
@swag_from({
    'tags': ['Challenges'],
    'summary': 'Join a challenge',
    'parameters': [{'name': 'challenge_id', 'in': 'path', 'type': 'integer', 'required': True}],
    'responses': {'201': {'description': 'Joined challenge'}}
})
def join_challenge(challenge_id):
    """Join a challenge"""
    data = request.get_json()
    user_id = data.get('user_id')
    result = service.join_challenge(user_id, challenge_id)
    return jsonify({'message': 'Joined challenge successfully', 'participant_id': result}), 201


@challenge_bp.route('/<int:challenge_id>/submit', methods=['POST'])
@swag_from({
    'tags': ['Challenges'],
    'summary': 'Submit challenge entry',
    'parameters': [{'name': 'challenge_id', 'in': 'path', 'type': 'integer', 'required': True}],
    'responses': {'200': {'description': 'Submission result'}}
})
def submit_challenge(challenge_id):
    """Submit an entry for a challenge"""
    data = request.get_json()
    result = service.submit_entry(challenge_id, data)
    return jsonify(result), 200


# ==================== LEADERBOARD ====================

@challenge_bp.route('/leaderboard', methods=['GET'])
@swag_from({
    'tags': ['Challenges'],
    'summary': 'Get leaderboard',
    'parameters': [
        {'name': 'period', 'in': 'query', 'type': 'string', 'required': False},
        {'name': 'limit', 'in': 'query', 'type': 'integer', 'required': False}
    ],
    'responses': {'200': {'description': 'Leaderboard data'}}
})
def get_leaderboard():
    """Get challenge leaderboard"""
    period = request.args.get('period', 'weekly')
    limit = request.args.get('limit', 10, type=int)
    leaderboard = service.get_leaderboard(period, limit)
    return jsonify(leaderboard), 200


# ==================== PROGRESS ====================

@challenge_bp.route('/my-progress', methods=['GET'])
@swag_from({
    'tags': ['Challenges'],
    'summary': 'Get my challenge progress',
    'parameters': [{'name': 'user_id', 'in': 'query', 'type': 'integer', 'required': True}],
    'responses': {'200': {'description': 'User challenge progress'}}
})
def get_my_progress():
    """Get user's challenge progress"""
    user_id = request.args.get('user_id', type=int)
    progress = service.get_user_progress(user_id)
    return jsonify(progress), 200


# ==================== REWARDS ====================

@challenge_bp.route('/rewards', methods=['GET'])
@swag_from({
    'tags': ['Challenges'],
    'summary': 'Get available rewards',
    'responses': {'200': {'description': 'List of rewards'}}
})
def get_rewards():
    """Get available rewards"""
    user_id = request.args.get('user_id', type=int)
    rewards = service.get_available_rewards(user_id)
    return jsonify(rewards), 200


@challenge_bp.route('/rewards/<int:reward_id>/claim', methods=['POST'])
@swag_from({
    'tags': ['Challenges'],
    'summary': 'Claim a reward',
    'parameters': [{'name': 'reward_id', 'in': 'path', 'type': 'integer', 'required': True}],
    'responses': {'200': {'description': 'Reward claimed'}}
})
def claim_reward(reward_id):
    """Claim a reward"""
    data = request.get_json()
    user_id = data.get('user_id')
    result = service.claim_reward(user_id, reward_id)
    if result:
        return jsonify({'message': 'Reward claimed successfully'}), 200
    return jsonify({'error': 'Cannot claim reward'}), 400
