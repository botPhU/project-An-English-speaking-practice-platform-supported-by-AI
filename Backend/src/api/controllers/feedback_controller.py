"""
Feedback Controller
API endpoints for mentor feedback system
"""
from flask import Blueprint, request, jsonify
from flasgger import swag_from
from services.mentor_feedback_service import mentor_feedback_service

feedback_bp = Blueprint('feedback', __name__, url_prefix='/api/feedback')


@feedback_bp.route('/', methods=['POST'])
@swag_from({
    'tags': ['Feedback'],
    'summary': 'Create feedback',
    'responses': {'201': {'description': 'Feedback created'}}
})
def create_feedback():
    """Create new feedback from mentor"""
    data = request.get_json()
    
    required = ['mentor_id', 'learner_id']
    if not all(data.get(f) for f in required):
        return jsonify({'error': 'mentor_id and learner_id are required'}), 400
    
    result = mentor_feedback_service.create_feedback(data)
    
    if 'error' in result:
        return jsonify(result), 500
    
    return jsonify(result), 201


@feedback_bp.route('/learner/<int:learner_id>', methods=['GET'])
@swag_from({
    'tags': ['Feedback'],
    'summary': 'Get learner feedbacks',
    'parameters': [
        {'name': 'learner_id', 'in': 'path', 'type': 'integer', 'required': True},
        {'name': 'limit', 'in': 'query', 'type': 'integer', 'required': False}
    ],
    'responses': {'200': {'description': 'List of feedbacks'}}
})
def get_learner_feedbacks(learner_id):
    """Get all feedbacks for a learner"""
    limit = request.args.get('limit', 20, type=int)
    feedbacks = mentor_feedback_service.get_learner_feedbacks(learner_id, limit)
    return jsonify(feedbacks), 200


@feedback_bp.route('/mentor/<int:mentor_id>/sent', methods=['GET'])
@swag_from({
    'tags': ['Feedback'],
    'summary': 'Get mentor sent feedbacks',
    'parameters': [
        {'name': 'mentor_id', 'in': 'path', 'type': 'integer', 'required': True}
    ],
    'responses': {'200': {'description': 'List of sent feedbacks'}}
})
def get_mentor_sent_feedbacks(mentor_id):
    """Get all feedbacks sent by a mentor"""
    limit = request.args.get('limit', 20, type=int)
    feedbacks = mentor_feedback_service.get_mentor_sent_feedbacks(mentor_id, limit)
    return jsonify(feedbacks), 200


@feedback_bp.route('/progress/<int:learner_id>', methods=['GET'])
@swag_from({
    'tags': ['Feedback'],
    'summary': 'Get learner progress for mentor',
    'parameters': [
        {'name': 'learner_id', 'in': 'path', 'type': 'integer', 'required': True}
    ],
    'responses': {'200': {'description': 'Learner progress data'}}
})
def get_learner_progress(learner_id):
    """Get comprehensive progress data for a learner (mentor view)"""
    progress = mentor_feedback_service.get_learner_progress(learner_id)
    return jsonify(progress), 200
