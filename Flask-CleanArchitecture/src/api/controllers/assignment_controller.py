"""
Mentor Assignment Controller
API endpoints for 1-to-1 mentor-learner assignments
"""
from flask import Blueprint, request, jsonify
from flasgger import swag_from
from services.mentor_assignment_service import mentor_assignment_service

assignment_bp = Blueprint('assignments', __name__, url_prefix='/api/assignments')


# ==================== ADMIN ENDPOINTS ====================

@assignment_bp.route('/', methods=['GET'])
@swag_from({
    'tags': ['Assignments'],
    'summary': 'Get all assignments',
    'parameters': [
        {'name': 'status', 'in': 'query', 'type': 'string', 'required': False}
    ],
    'responses': {'200': {'description': 'List of assignments'}}
})
def get_all_assignments():
    """Get all mentor-learner assignments (admin only)"""
    status = request.args.get('status')
    assignments = mentor_assignment_service.get_all_assignments(status)
    return jsonify(assignments), 200


@assignment_bp.route('/', methods=['POST'])
@swag_from({
    'tags': ['Assignments'],
    'summary': 'Create assignment',
    'responses': {'201': {'description': 'Assignment created'}}
})
def create_assignment():
    """Create a new 1-to-1 mentor-learner assignment"""
    data = request.get_json()
    mentor_id = data.get('mentor_id')
    learner_id = data.get('learner_id')
    admin_id = data.get('admin_id')
    notes = data.get('notes')
    
    if not all([mentor_id, learner_id, admin_id]):
        return jsonify({'error': 'mentor_id, learner_id, and admin_id are required'}), 400
    
    result = mentor_assignment_service.create_assignment(mentor_id, learner_id, admin_id, notes)
    
    if 'error' in result:
        return jsonify(result), 400
    
    return jsonify(result), 201


@assignment_bp.route('/<int:assignment_id>', methods=['DELETE'])
@swag_from({
    'tags': ['Assignments'],
    'summary': 'End assignment',
    'parameters': [
        {'name': 'assignment_id', 'in': 'path', 'type': 'integer', 'required': True}
    ],
    'responses': {'200': {'description': 'Assignment ended'}}
})
def end_assignment(assignment_id):
    """End an assignment"""
    success = mentor_assignment_service.end_assignment(assignment_id)
    if success:
        return jsonify({'message': 'Assignment ended'}), 200
    return jsonify({'error': 'Assignment not found'}), 404


@assignment_bp.route('/unassigned-mentors', methods=['GET'])
@swag_from({
    'tags': ['Assignments'],
    'summary': 'Get unassigned mentors',
    'responses': {'200': {'description': 'List of available mentors'}}
})
def get_unassigned_mentors():
    """Get mentors without active assignments"""
    mentors = mentor_assignment_service.get_unassigned_mentors()
    return jsonify(mentors), 200


@assignment_bp.route('/unassigned-learners', methods=['GET'])
@swag_from({
    'tags': ['Assignments'],
    'summary': 'Get unassigned learners',
    'responses': {'200': {'description': 'List of available learners'}}
})
def get_unassigned_learners():
    """Get learners without active assignments"""
    learners = mentor_assignment_service.get_unassigned_learners()
    return jsonify(learners), 200


# ==================== MENTOR ENDPOINTS ====================

@assignment_bp.route('/mentor/my-learner', methods=['GET'])
@swag_from({
    'tags': ['Assignments'],
    'summary': 'Get mentor assigned learner',
    'parameters': [
        {'name': 'mentor_id', 'in': 'query', 'type': 'integer', 'required': True}
    ],
    'responses': {'200': {'description': 'Assigned learner info'}}
})
def get_mentor_learner():
    """Get the learner assigned to current mentor"""
    mentor_id = request.args.get('mentor_id', type=int)
    if not mentor_id:
        return jsonify({'error': 'mentor_id is required'}), 400
    
    assignment = mentor_assignment_service.get_mentor_learner(mentor_id)
    if assignment:
        return jsonify(assignment), 200
    return jsonify({'message': 'No learner assigned'}), 200


# ==================== LEARNER ENDPOINTS ====================

@assignment_bp.route('/learner/my-mentor', methods=['GET'])
@swag_from({
    'tags': ['Assignments'],
    'summary': 'Get learner assigned mentor',
    'parameters': [
        {'name': 'learner_id', 'in': 'query', 'type': 'integer', 'required': True}
    ],
    'responses': {'200': {'description': 'Assigned mentor info'}}
})
def get_learner_mentor():
    """Get the mentor assigned to current learner"""
    learner_id = request.args.get('learner_id', type=int)
    if not learner_id:
        return jsonify({'error': 'learner_id is required'}), 400
    
    assignment = mentor_assignment_service.get_learner_mentor(learner_id)
    if assignment:
        return jsonify(assignment), 200
    return jsonify({'message': 'No mentor assigned'}), 200
