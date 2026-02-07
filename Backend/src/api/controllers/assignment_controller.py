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
    'summary': 'Get mentor assigned learners (supports multiple)',
    'parameters': [
        {'name': 'mentor_id', 'in': 'query', 'type': 'integer', 'required': True}
    ],
    'responses': {'200': {'description': 'List of assigned learners'}}
})
def get_mentor_learner():
    """Get ALL learners assigned to current mentor (1-to-many)"""
    mentor_id = request.args.get('mentor_id', type=int)
    print(f"[API] get_mentor_learner called with mentor_id={mentor_id}")
    if not mentor_id:
        print("[API] Missing mentor_id")
        return jsonify({'error': 'mentor_id is required'}), 400
    
    assignments = mentor_assignment_service.get_mentor_learner(mentor_id)
    print(f"[API] Found {len(assignments)} assignments for mentor {mentor_id}")
    return jsonify(assignments), 200


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


# ==================== SYNC/FIX ENDPOINTS ====================

@assignment_bp.route('/sync-from-bookings', methods=['POST'])
@swag_from({
    'tags': ['Assignments'],
    'summary': 'Sync assignments from confirmed bookings',
    'responses': {'200': {'description': 'Assignments synced'}}
})
def sync_from_bookings():
    """Create missing assignments from confirmed bookings"""
    try:
        from infrastructure.databases.mssql import get_db_session
        from infrastructure.models.mentor_booking_model import MentorBookingModel
        from infrastructure.models.mentor_assignment_model import MentorAssignmentModel
        from datetime import datetime
        
        created = []
        reactivated = []
        
        with get_db_session() as session:
            # Get all confirmed bookings
            bookings = session.query(MentorBookingModel).filter(
                MentorBookingModel.status == 'confirmed'
            ).all()
            
            print(f"[SYNC] Found {len(bookings)} confirmed bookings")
            
            for b in bookings:
                # Check if assignment exists
                existing = session.query(MentorAssignmentModel).filter(
                    MentorAssignmentModel.mentor_id == b.mentor_id,
                    MentorAssignmentModel.learner_id == b.learner_id
                ).first()
                
                if not existing:
                    new_assignment = MentorAssignmentModel(
                        mentor_id=b.mentor_id,
                        learner_id=b.learner_id,
                        assigned_by=b.mentor_id,
                        status='active',
                        notes=f"Auto-synced from booking #{b.id}",
                        assigned_at=datetime.now()
                    )
                    session.add(new_assignment)
                    created.append({'booking_id': b.id, 'mentor_id': b.mentor_id, 'learner_id': b.learner_id})
                    print(f"[SYNC] Created: mentor {b.mentor_id} -> learner {b.learner_id}")
                elif existing.status != 'active':
                    existing.status = 'active'
                    existing.updated_at = datetime.now()
                    reactivated.append({'assignment_id': existing.id, 'learner_id': b.learner_id})
                    print(f"[SYNC] Reactivated: learner {b.learner_id}")
        
        return jsonify({
            'message': 'Sync completed',
            'created': created,
            'reactivated': reactivated
        }), 200
        
    except Exception as e:
        import traceback
        print(f"[SYNC ERROR] {e}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500



@assignment_bp.route('/debug/db-config', methods=['GET'])
def get_db_config():
    """Debug endpoint to check DB config"""
    import os
    from config import Config
    
    # Mask password
    uri = Config.DATABASE_URI
    safe_uri = uri
    if '@' in uri:
        parts = uri.split('@')
        safe_uri = '***@' + parts[-1]
    
    return jsonify({
        'database_uri_masked': safe_uri,
        'has_mentor_assignments': True, 
        'env_file': os.environ.get('DOTENV_PATH', 'unknown')
    }), 200
