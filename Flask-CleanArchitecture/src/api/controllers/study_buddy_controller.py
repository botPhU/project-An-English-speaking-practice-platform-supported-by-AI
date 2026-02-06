"""
Study Buddy Controller
API endpoints for learner-to-learner matching
"""
from flask import Blueprint, request, jsonify
from services.study_buddy_service import study_buddy_service

study_buddy_bp = Blueprint('study_buddy', __name__, url_prefix='/api/study-buddy')


@study_buddy_bp.route('/find', methods=['GET'])
def find_buddies():
    """Find potential study buddies"""
    user_id = request.args.get('user_id', type=int)
    level = request.args.get('level')
    limit = request.args.get('limit', 10, type=int)
    
    if not user_id:
        return jsonify({'error': 'user_id is required'}), 400
    
    buddies = study_buddy_service.find_potential_buddies(user_id, level, limit)
    return jsonify(buddies), 200


@study_buddy_bp.route('/match', methods=['POST'])
def request_match():
    """Request to be matched with a study buddy"""
    data = request.get_json()
    user_id = data.get('user_id')
    topic = data.get('topic')
    level = data.get('level')
    
    if not user_id:
        return jsonify({'error': 'user_id is required'}), 400
    
    result = study_buddy_service.request_buddy_match(user_id, topic, level)
    return jsonify(result), 200


@study_buddy_bp.route('/status', methods=['GET'])
def check_status():
    """Check match status"""
    user_id = request.args.get('user_id', type=int)
    
    if not user_id:
        return jsonify({'error': 'user_id is required'}), 400
    
    result = study_buddy_service.check_match_status(user_id)
    return jsonify(result), 200


@study_buddy_bp.route('/cancel', methods=['POST'])
def cancel_request():
    """Cancel pending match request"""
    data = request.get_json()
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'user_id is required'}), 400
    
    success = study_buddy_service.cancel_request(user_id)
    return jsonify({'success': success}), 200


@study_buddy_bp.route('/end', methods=['POST'])
def end_session():
    """End a study buddy session"""
    data = request.get_json()
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'user_id is required'}), 400
    
    success = study_buddy_service.end_session(user_id)
    return jsonify({'success': success}), 200


@study_buddy_bp.route('/online-learners', methods=['GET'])
def get_online_learners():
    """Get list of online learners available for practice"""
    user_id = request.args.get('user_id', type=int)
    level = request.args.get('level')
    limit = request.args.get('limit', 20, type=int)
    
    if not user_id:
        return jsonify({'error': 'user_id is required'}), 400
    
    learners = study_buddy_service.get_online_learners(user_id, level, limit)
    return jsonify(learners), 200


@study_buddy_bp.route('/invite', methods=['POST'])
def send_invite():
    """Send practice invite to another user"""
    data = request.get_json()
    from_user_id = data.get('from_user_id')
    to_user_id = data.get('to_user_id')
    topic = data.get('topic')
    
    if not from_user_id or not to_user_id:
        return jsonify({'error': 'from_user_id and to_user_id are required'}), 400
    
    result = study_buddy_service.send_invite(from_user_id, to_user_id, topic)
    return jsonify(result), 200


@study_buddy_bp.route('/invite/respond', methods=['POST'])
def respond_invite():
    """Respond to a practice invite"""
    data = request.get_json()
    user_id = data.get('user_id')
    from_user_id = data.get('from_user_id')
    accept = data.get('accept', False)
    
    if not user_id or not from_user_id:
        return jsonify({'error': 'user_id and from_user_id are required'}), 400
    
    result = study_buddy_service.respond_to_invite(user_id, from_user_id, accept)
    return jsonify(result), 200

