"""
Resource Controller for AESP Platform
API endpoints for managing mentor resources
"""

from flask import Blueprint, request, jsonify

from services.resource_service import ResourceService
from services.auth_service import AuthService

resource_bp = Blueprint('resources', __name__, url_prefix='/api/resources')


@resource_bp.route('/', methods=['GET'])
def get_resources():
    """
    Get public resources with optional filters
    ---
    tags:
      - Resources
    parameters:
      - in: query
        name: category
        type: string
      - in: query
        name: difficulty_level
        type: string
      - in: query
        name: limit
        type: integer
        default: 20
      - in: query
        name: offset
        type: integer
        default: 0
    responses:
      200:
        description: List of resources
    """
    category = request.args.get('category')
    difficulty = request.args.get('difficulty_level')
    limit = request.args.get('limit', 20, type=int)
    offset = request.args.get('offset', 0, type=int)
    
    resources = ResourceService.get_public_resources(
        category=category,
        difficulty_level=difficulty,
        limit=limit,
        offset=offset
    )
    
    return jsonify({
        'resources': resources,
        'count': len(resources)
    }), 200


@resource_bp.route('/mentor/<int:mentor_id>', methods=['GET'])
def get_mentor_resources(mentor_id: int):
    """
    Get all resources by a mentor
    ---
    tags:
      - Resources
    parameters:
      - in: path
        name: mentor_id
        type: integer
        required: true
    responses:
      200:
        description: Mentor's resources
    """
    limit = request.args.get('limit', 20, type=int)
    offset = request.args.get('offset', 0, type=int)
    
    resources = ResourceService.get_mentor_resources(
        mentor_id=mentor_id,
        limit=limit,
        offset=offset
    )
    
    return jsonify({
        'resources': resources,
        'count': len(resources)
    }), 200


@resource_bp.route('/', methods=['POST'])
def create_resource():
    """
    Create a new resource (Mentor only)
    ---
    tags:
      - Resources
    parameters:
      - in: body
        name: body
        schema:
          type: object
          required:
            - mentor_id
            - title
          properties:
            mentor_id:
              type: integer
            title:
              type: string
            description:
              type: string
            resource_type:
              type: string
            file_url:
              type: string
            category:
              type: string
            difficulty_level:
              type: string
            is_public:
              type: boolean
    responses:
      201:
        description: Resource created
    """
    data = request.get_json()
    
    if not data.get('mentor_id') or not data.get('title'):
        return jsonify({'error': 'mentor_id and title are required'}), 400
    
    resource = ResourceService.create_resource(
        mentor_id=data['mentor_id'],
        title=data['title'],
        description=data.get('description'),
        resource_type=data.get('resource_type', 'document'),
        file_url=data.get('file_url'),
        category=data.get('category'),
        difficulty_level=data.get('difficulty_level'),
        is_public=data.get('is_public', False)
    )
    
    return jsonify(resource.to_dict()), 201


@resource_bp.route('/<int:resource_id>', methods=['GET'])
def get_resource(resource_id: int):
    """Get a single resource by ID"""
    resource = ResourceService.get_resource_by_id(resource_id)
    
    if not resource:
        return jsonify({'error': 'Resource not found'}), 404
    
    return jsonify(resource.to_dict()), 200


@resource_bp.route('/<int:resource_id>', methods=['PUT'])
def update_resource(resource_id: int):
    """
    Update a resource (Mentor only - owner)
    ---
    tags:
      - Resources
    """
    data = request.get_json()
    mentor_id = data.get('mentor_id')
    
    if not mentor_id:
        return jsonify({'error': 'mentor_id is required'}), 400
    
    resource = ResourceService.update_resource(
        resource_id=resource_id,
        mentor_id=mentor_id,
        title=data.get('title'),
        description=data.get('description'),
        resource_type=data.get('resource_type'),
        file_url=data.get('file_url'),
        category=data.get('category'),
        difficulty_level=data.get('difficulty_level'),
        is_public=data.get('is_public')
    )
    
    if not resource:
        return jsonify({'error': 'Resource not found or not owned by mentor'}), 404
    
    return jsonify(resource.to_dict()), 200


@resource_bp.route('/<int:resource_id>', methods=['DELETE'])
def delete_resource(resource_id: int):
    """Delete a resource (Mentor only - owner)"""
    mentor_id = request.args.get('mentor_id', type=int)
    
    if not mentor_id:
        return jsonify({'error': 'mentor_id is required'}), 400
    
    success = ResourceService.delete_resource(resource_id, mentor_id)
    
    if success:
        return jsonify({'message': 'Resource deleted'}), 200
    
    return jsonify({'error': 'Resource not found or not owned by mentor'}), 404


@resource_bp.route('/<int:resource_id>/download', methods=['POST'])
def download_resource(resource_id: int):
    """Increment download count and return resource"""
    resource = ResourceService.get_resource_by_id(resource_id)
    
    if not resource:
        return jsonify({'error': 'Resource not found'}), 404
    
    ResourceService.increment_download_count(resource_id)
    
    return jsonify({
        'message': 'Download recorded',
        'file_url': resource.file_url
    }), 200


@resource_bp.route('/search', methods=['GET'])
def search_resources():
    """
    Search resources by keyword
    ---
    tags:
      - Resources
    parameters:
      - in: query
        name: q
        type: string
        required: true
      - in: query
        name: category
        type: string
    responses:
      200:
        description: Search results
    """
    query = request.args.get('q', '')
    category = request.args.get('category')
    limit = request.args.get('limit', 20, type=int)
    
    if not query:
        return jsonify({'error': 'Query parameter q is required'}), 400
    
    resources = ResourceService.search_resources(
        query=query,
        category=category,
        limit=limit
    )
    
    return jsonify({
        'resources': resources,
        'count': len(resources),
        'query': query
    }), 200


# ==================== LEARNER RESOURCE ASSIGNMENTS ====================

@resource_bp.route('/assign', methods=['POST'])
def assign_resource_to_learner():
    """
    Assign a resource/exercise to a learner
    ---
    tags:
      - Resources
    parameters:
      - in: body
        name: body
        schema:
          type: object
          required:
            - resource_id
            - learner_id
            - mentor_id
          properties:
            resource_id:
              type: integer
            learner_id:
              type: integer
            mentor_id:
              type: integer
            due_date:
              type: string
              format: date-time
    responses:
      201:
        description: Resource assigned to learner
    """
    data = request.get_json()
    
    resource_id = data.get('resource_id')
    learner_id = data.get('learner_id')
    mentor_id = data.get('mentor_id')
    
    if not all([resource_id, learner_id, mentor_id]):
        return jsonify({'error': 'resource_id, learner_id, and mentor_id are required'}), 400
    
    result = ResourceService.assign_to_learner(
        resource_id=resource_id,
        learner_id=learner_id,
        mentor_id=mentor_id,
        due_date=data.get('due_date')
    )
    
    if 'error' in result:
        return jsonify(result), 400
    
    return jsonify(result), 201


@resource_bp.route('/learner/<int:learner_id>/assigned', methods=['GET'])
def get_learner_assigned_resources(learner_id: int):
    """
    Get all resources assigned to a learner
    ---
    tags:
      - Resources
    parameters:
      - in: path
        name: learner_id
        type: integer
        required: true
      - in: query
        name: status
        type: string
        description: Filter by status (assigned, in_progress, completed, reviewed)
    responses:
      200:
        description: List of assigned resources
    """
    status = request.args.get('status')
    
    assignments = ResourceService.get_learner_assignments(
        learner_id=learner_id,
        status=status
    )
    
    return jsonify({
        'assignments': assignments,
        'count': len(assignments)
    }), 200


@resource_bp.route('/mentor/<int:mentor_id>/assignments', methods=['GET'])
def get_mentor_assignments(mentor_id: int):
    """
    Get all resource assignments made by a mentor
    ---
    tags:
      - Resources
    """
    learner_id = request.args.get('learner_id', type=int)
    status = request.args.get('status')
    
    assignments = ResourceService.get_mentor_assignments(
        mentor_id=mentor_id,
        learner_id=learner_id,
        status=status
    )
    
    return jsonify({
        'assignments': assignments,
        'count': len(assignments)
    }), 200


@resource_bp.route('/assignment/<int:assignment_id>', methods=['PUT'])
def update_assignment(assignment_id: int):
    """
    Update assignment status, score, or feedback
    ---
    tags:
      - Resources
    parameters:
      - in: body
        name: body
        schema:
          type: object
          properties:
            status:
              type: string
            score:
              type: integer
            mentor_feedback:
              type: string
            learner_notes:
              type: string
    responses:
      200:
        description: Assignment updated
    """
    data = request.get_json()
    
    result = ResourceService.update_assignment(
        assignment_id=assignment_id,
        status=data.get('status'),
        score=data.get('score'),
        mentor_feedback=data.get('mentor_feedback'),
        learner_notes=data.get('learner_notes')
    )
    
    if not result:
        return jsonify({'error': 'Assignment not found'}), 404
    
    return jsonify(result), 200


@resource_bp.route('/assignment/<int:assignment_id>', methods=['DELETE'])
def delete_assignment(assignment_id: int):
    """Remove a resource assignment"""
    mentor_id = request.args.get('mentor_id', type=int)
    
    if not mentor_id:
        return jsonify({'error': 'mentor_id is required'}), 400
    
    success = ResourceService.delete_assignment(assignment_id, mentor_id)
    
    if success:
        return jsonify({'message': 'Assignment deleted'}), 200
    
    return jsonify({'error': 'Assignment not found or not owned by mentor'}), 404

