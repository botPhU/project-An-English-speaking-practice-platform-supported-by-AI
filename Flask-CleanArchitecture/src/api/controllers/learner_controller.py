from flask import Blueprint, request, jsonify
from flasgger import swag_from
from services.learner_service import LearnerService

learner_bp = Blueprint('learner', __name__, url_prefix='/api/learner')
learner_service = LearnerService()

# ==================== DASHBOARD ====================
@learner_bp.route('/dashboard/<int:user_id>', methods=['GET'])
@swag_from({
    'tags': ['Learner'],
    'summary': 'Get learner dashboard statistics',
    'parameters': [{'name': 'user_id', 'in': 'path', 'type': 'integer', 'required': True}],
    'responses': {'200': {'description': 'Dashboard data'}}
})
def get_dashboard(user_id):
    """Get learner dashboard data"""
    stats = learner_service.get_dashboard_stats(user_id)
    return jsonify(stats), 200

# ==================== PROGRESS ====================
@learner_bp.route('/progress/<int:user_id>', methods=['GET'])
@swag_from({
    'tags': ['Learner'],
    'summary': 'Get learner progress',
    'parameters': [{'name': 'user_id', 'in': 'path', 'type': 'integer', 'required': True}],
    'responses': {'200': {'description': 'Progress data'}}
})
def get_progress(user_id):
    """Get learner's progress data"""
    progress = learner_service.get_progress(user_id)
    if progress:
        return jsonify({
            'overall_score': progress.overall_score,
            'vocabulary_score': progress.vocabulary_score,
            'grammar_score': progress.grammar_score,
            'pronunciation_score': progress.pronunciation_score,
            'fluency_score': progress.fluency_score,
            'current_level': progress.current_level,
            'current_streak': progress.current_streak,
            'xp_points': progress.xp_points,
            'total_sessions': progress.total_sessions
        }), 200
    return jsonify({'error': 'Progress not found'}), 404

@learner_bp.route('/progress/<int:user_id>', methods=['PUT'])
@swag_from({
    'tags': ['Learner'],
    'summary': 'Update learner progress',
    'parameters': [{'name': 'user_id', 'in': 'path', 'type': 'integer', 'required': True}],
    'responses': {'200': {'description': 'Updated progress'}}
})
def update_progress(user_id):
    """Update learner's progress"""
    data = request.get_json()
    progress = learner_service.update_progress(user_id, data)
    return jsonify({'message': 'Progress updated'}), 200

# ==================== PRACTICE SESSIONS ====================
@learner_bp.route('/sessions/<int:user_id>', methods=['GET'])
@swag_from({
    'tags': ['Learner'],
    'summary': 'Get practice sessions',
    'parameters': [{'name': 'user_id', 'in': 'path', 'type': 'integer', 'required': True}],
    'responses': {'200': {'description': 'List of sessions'}}
})
def get_sessions(user_id):
    """Get learner's practice session history"""
    limit = request.args.get('limit', 10, type=int)
    sessions = learner_service.get_practice_sessions(user_id, limit)
    return jsonify([{
        'id': s.id,
        'session_type': s.session_type,
        'topic': s.topic,
        'overall_score': s.overall_score,
        'pronunciation_score': s.pronunciation_score,
        'grammar_score': s.grammar_score,
        'vocabulary_score': s.vocabulary_score,
        'fluency_score': s.fluency_score,
        'ai_feedback': s.ai_feedback,
        'pronunciation_errors': s.pronunciation_errors,
        'grammar_errors': s.grammar_errors,
        'vocabulary_suggestions': s.vocabulary_suggestions,
        'is_completed': s.is_completed,
        'created_at': str(s.created_at) if s.created_at else None
    } for s in sessions]), 200

@learner_bp.route('/sessions', methods=['POST'])
@swag_from({
    'tags': ['Learner'],
    'summary': 'Start a new practice session',
    'responses': {'201': {'description': 'Session created'}}
})
def create_session():
    """Start a new practice session"""
    data = request.get_json()
    user_id = data.get('user_id')
    session = learner_service.create_practice_session(user_id, data)
    return jsonify({'id': session.id, 'message': 'Session started'}), 201

@learner_bp.route('/sessions/<int:session_id>/complete', methods=['POST'])
@swag_from({
    'tags': ['Learner'],
    'summary': 'Complete a practice session',
    'responses': {'200': {'description': 'Session completed'}}
})
def complete_session(session_id):
    """Complete a practice session with scores"""
    scores = request.get_json()
    session = learner_service.complete_practice_session(session_id, scores)
    return jsonify({'message': 'Session completed'}), 200

# ==================== ASSESSMENTS ====================
@learner_bp.route('/assessments/<int:user_id>', methods=['GET'])
@swag_from({
    'tags': ['Learner'],
    'summary': 'Get all assessments',
    'parameters': [{'name': 'user_id', 'in': 'path', 'type': 'integer', 'required': True}],
    'responses': {'200': {'description': 'List of assessments'}}
})
def get_assessments(user_id):
    """Get all assessments for a learner"""
    assessments = learner_service.get_assessments(user_id)
    return jsonify([{
        'id': a.id,
        'type': a.assessment_type,
        'overall_score': a.overall_score,
        'level': a.determined_level,
        'is_completed': a.is_completed,
        'completed_at': str(a.completed_at) if a.completed_at else None
    } for a in assessments]), 200

@learner_bp.route('/assessments', methods=['POST'])
@swag_from({
    'tags': ['Learner'],
    'summary': 'Start a new assessment',
    'responses': {'201': {'description': 'Assessment created'}}
})
def create_assessment():
    """Create a new assessment"""
    data = request.get_json()
    user_id = data.get('user_id')
    assessment_type = data.get('type', 'initial')
    assessment = learner_service.create_assessment(user_id, assessment_type)
    return jsonify({'id': assessment.id, 'message': 'Assessment started'}), 201

@learner_bp.route('/assessments/<int:assessment_id>/complete', methods=['POST'])
@swag_from({
    'tags': ['Learner'],
    'summary': 'Complete an assessment',
    'responses': {'200': {'description': 'Assessment completed'}}
})
def complete_assessment(assessment_id):
    """Complete an assessment with results"""
    results = request.get_json()
    assessment = learner_service.complete_assessment(assessment_id, results)
    return jsonify({
        'message': 'Assessment completed',
        'level': assessment.determined_level if assessment else None
    }), 200


# ==================== PROFILE ====================
@learner_bp.route('/profile/<int:user_id>', methods=['GET'])
@swag_from({
    'tags': ['Learner'],
    'summary': 'Get learner profile',
    'parameters': [{'name': 'user_id', 'in': 'path', 'type': 'integer', 'required': True}],
    'responses': {'200': {'description': 'Profile data'}}
})
def get_profile(user_id):
    """Get learner's profile"""
    profile = learner_service.get_profile(user_id)
    return jsonify(profile), 200


@learner_bp.route('/profile/<int:user_id>', methods=['PUT'])
@swag_from({
    'tags': ['Learner'],
    'summary': 'Update learner profile',
    'parameters': [{'name': 'user_id', 'in': 'path', 'type': 'integer', 'required': True}],
    'responses': {'200': {'description': 'Profile updated'}}
})
def update_profile(user_id):
    """Update learner's profile"""
    data = request.get_json()
    profile = learner_service.update_profile(user_id, data)
    return jsonify({'message': 'Profile updated'}), 200


@learner_bp.route('/profile/<int:user_id>/learning-goals', methods=['PUT'])
@swag_from({
    'tags': ['Learner'],
    'summary': 'Update learning goals',
    'responses': {'200': {'description': 'Learning goals updated'}}
})
def update_learning_goals(user_id):
    """Update learner's learning goals and preferences"""
    data = request.get_json()
    result = learner_service.update_learning_goals(user_id, data)
    return jsonify({'message': 'Learning goals updated'}), 200


@learner_bp.route('/profile/<int:user_id>/voice-calibration', methods=['POST'])
@swag_from({
    'tags': ['Learner'],
    'summary': 'Update voice calibration',
    'responses': {'200': {'description': 'Voice calibration updated'}}
})
def update_voice_calibration(user_id):
    """Update voice calibration for AI"""
    data = request.get_json()
    result = learner_service.update_voice_calibration(user_id, data)
    return jsonify({'message': 'Voice calibration updated'}), 200


# ==================== AI ROLEPLAY / TOPICS ====================
@learner_bp.route('/topics', methods=['GET'])
@swag_from({
    'tags': ['Learner'],
    'summary': 'Get all AI roleplay topics',
    'parameters': [
        {'name': 'category', 'in': 'query', 'type': 'string', 'required': False}
    ],
    'responses': {'200': {'description': 'List of topics'}}
})
def get_topics():
    """Get all available AI roleplay topics"""
    category = request.args.get('category', 'all')
    topics = learner_service.get_topics(category)
    return jsonify(topics), 200


@learner_bp.route('/topics/daily-challenge', methods=['GET'])
@swag_from({
    'tags': ['Learner'],
    'summary': 'Get daily challenge topic',
    'responses': {'200': {'description': 'Daily challenge data'}}
})
def get_daily_challenge():
    """Get daily challenge topic"""
    challenge = learner_service.get_daily_challenge()
    return jsonify(challenge), 200


@learner_bp.route('/topics/<int:topic_id>/start', methods=['POST'])
@swag_from({
    'tags': ['Learner'],
    'summary': 'Start AI roleplay session',
    'parameters': [{'name': 'topic_id', 'in': 'path', 'type': 'integer', 'required': True}],
    'responses': {'201': {'description': 'Session started'}}
})
def start_topic_session(topic_id):
    """Start an AI roleplay session for a topic"""
    data = request.get_json()
    user_id = data.get('user_id')
    session = learner_service.start_topic_session(user_id, topic_id)
    return jsonify({'session_id': session, 'message': 'Session started'}), 201


# ==================== ACHIEVEMENTS ====================
@learner_bp.route('/achievements/<int:user_id>', methods=['GET'])
@swag_from({
    'tags': ['Learner'],
    'summary': 'Get learner achievements',
    'parameters': [{'name': 'user_id', 'in': 'path', 'type': 'integer', 'required': True}],
    'responses': {'200': {'description': 'List of achievements'}}
})
def get_achievements(user_id):
    """Get learner's achievements and badges"""
    achievements = learner_service.get_achievements(user_id)
    return jsonify(achievements), 200


# ==================== MENTOR BOOKING ====================
@learner_bp.route('/mentors', methods=['GET'])
@swag_from({
    'tags': ['Learner'],
    'summary': 'Get available mentors',
    'responses': {'200': {'description': 'List of mentors'}}
})
def get_available_mentors():
    """Get list of available mentors for booking"""
    specialty = request.args.get('specialty', 'all')
    mentors = learner_service.get_available_mentors(specialty)
    return jsonify(mentors), 200


@learner_bp.route('/mentors/<int:mentor_id>/book', methods=['POST'])
@swag_from({
    'tags': ['Learner'],
    'summary': 'Book a mentor session',
    'parameters': [{'name': 'mentor_id', 'in': 'path', 'type': 'integer', 'required': True}],
    'responses': {'201': {'description': 'Session booked'}}
})
def book_mentor(mentor_id):
    """Book a session with a mentor"""
    data = request.get_json()
    user_id = data.get('user_id')
    date_time = data.get('date_time')
    booking = learner_service.book_mentor_session(user_id, mentor_id, date_time)
    return jsonify({'booking_id': booking, 'message': 'Session booked'}), 201


@learner_bp.route('/mentor-sessions/<int:user_id>', methods=['GET'])
@swag_from({
    'tags': ['Learner'],
    'summary': 'Get booked mentor sessions',
    'parameters': [{'name': 'user_id', 'in': 'path', 'type': 'integer', 'required': True}],
    'responses': {'200': {'description': 'List of booked sessions'}}
})
def get_mentor_sessions(user_id):
    """Get learner's booked mentor sessions"""
    sessions = learner_service.get_mentor_sessions(user_id)
    return jsonify(sessions), 200


# ==================== SETTINGS ====================
@learner_bp.route('/settings/<int:user_id>', methods=['GET'])
@swag_from({
    'tags': ['Learner'],
    'summary': 'Get learner settings',
    'parameters': [{'name': 'user_id', 'in': 'path', 'type': 'integer', 'required': True}],
    'responses': {'200': {'description': 'Settings data'}}
})
def get_settings(user_id):
    """Get learner's settings"""
    settings = learner_service.get_settings(user_id)
    return jsonify(settings), 200


@learner_bp.route('/settings/<int:user_id>', methods=['PUT'])
@swag_from({
    'tags': ['Learner'],
    'summary': 'Update learner settings',
    'parameters': [{'name': 'user_id', 'in': 'path', 'type': 'integer', 'required': True}],
    'responses': {'200': {'description': 'Settings updated'}}
})
def update_settings(user_id):
    """Update learner's settings"""
    data = request.get_json()
    settings = learner_service.update_settings(user_id, data)
    return jsonify({'message': 'Settings updated'}), 200


@learner_bp.route('/settings/<int:user_id>/privacy', methods=['PUT'])
@swag_from({
    'tags': ['Learner'],
    'summary': 'Update privacy settings',
    'responses': {'200': {'description': 'Privacy settings updated'}}
})
def update_privacy_settings(user_id):
    """Update learner's privacy settings"""
    data = request.get_json()
    result = learner_service.update_privacy_settings(user_id, data)
    return jsonify({'message': 'Privacy settings updated'}), 200

