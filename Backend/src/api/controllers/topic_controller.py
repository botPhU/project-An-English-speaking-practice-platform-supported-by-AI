"""
Topic Controller for AESP Platform
API endpoints for conversation topics and scenarios
"""

from flask import Blueprint, request, jsonify

from services.topic_service import TopicService

topic_bp = Blueprint('topics', __name__, url_prefix='/api/topics')


@topic_bp.route('/', methods=['GET'])
def get_topics():
    """
    Get all topics with optional filters
    ---
    tags:
      - Topics
    parameters:
      - in: query
        name: category
        type: string
      - in: query
        name: difficulty_level
        type: string
    responses:
      200:
        description: List of topics
    """
    category = request.args.get('category')
    difficulty = request.args.get('difficulty_level')
    
    topics = TopicService.get_all_topics(
        category=category,
        difficulty_level=difficulty
    )
    
    return jsonify({
        'topics': topics,
        'count': len(topics)
    }), 200


@topic_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all topic categories"""
    categories = TopicService.get_categories()
    return jsonify({'categories': categories}), 200


@topic_bp.route('/<int:topic_id>', methods=['GET'])
def get_topic(topic_id: int):
    """Get a single topic by ID"""
    topic = TopicService.get_topic_by_id(topic_id)
    
    if not topic:
        return jsonify({'error': 'Topic not found'}), 404
    
    return jsonify(topic), 200


@topic_bp.route('/', methods=['POST'])
def create_topic():
    """
    Create a new topic (Admin only)
    ---
    tags:
      - Topics
    parameters:
      - in: body
        name: body
        schema:
          type: object
          required:
            - name
          properties:
            name:
              type: string
            category:
              type: string
            description:
              type: string
            difficulty_level:
              type: string
    responses:
      201:
        description: Topic created
    """
    data = request.get_json()
    
    if not data.get('name'):
        return jsonify({'error': 'name is required'}), 400
    
    topic = TopicService.create_topic(
        name=data['name'],
        category=data.get('category'),
        description=data.get('description'),
        difficulty_level=data.get('difficulty_level'),
        sample_questions=data.get('sample_questions'),
        vocabulary_list=data.get('vocabulary_list')
    )
    
    return jsonify(topic), 201


@topic_bp.route('/<int:topic_id>', methods=['PUT'])
def update_topic(topic_id: int):
    """Update a topic (Admin only)"""
    data = request.get_json()
    
    topic = TopicService.update_topic(
        topic_id=topic_id,
        name=data.get('name'),
        category=data.get('category'),
        description=data.get('description'),
        difficulty_level=data.get('difficulty_level'),
        sample_questions=data.get('sample_questions'),
        vocabulary_list=data.get('vocabulary_list'),
        is_active=data.get('is_active')
    )
    
    if not topic:
        return jsonify({'error': 'Topic not found'}), 404
    
    return jsonify(topic), 200


@topic_bp.route('/<int:topic_id>', methods=['DELETE'])
def delete_topic(topic_id: int):
    """Delete a topic (Admin only) - soft delete"""
    success = TopicService.delete_topic(topic_id)
    
    if success:
        return jsonify({'message': 'Topic deleted'}), 200
    
    return jsonify({'error': 'Topic not found'}), 404


# ==================== SCENARIOS ====================

@topic_bp.route('/<int:topic_id>/scenarios', methods=['GET'])
def get_topic_scenarios(topic_id: int):
    """Get all scenarios for a topic"""
    scenarios = TopicService.get_topic_scenarios(topic_id)
    
    return jsonify({
        'topic_id': topic_id,
        'scenarios': scenarios,
        'count': len(scenarios)
    }), 200


@topic_bp.route('/scenarios/<int:scenario_id>', methods=['GET'])
def get_scenario(scenario_id: int):
    """Get a single scenario by ID"""
    scenario = TopicService.get_scenario_by_id(scenario_id)
    
    if not scenario:
        return jsonify({'error': 'Scenario not found'}), 404
    
    return jsonify(scenario), 200


@topic_bp.route('/<int:topic_id>/scenarios', methods=['POST'])
def create_scenario(topic_id: int):
    """
    Create a new scenario for a topic
    ---
    tags:
      - Topics
    """
    data = request.get_json()
    
    if not data.get('name'):
        return jsonify({'error': 'name is required'}), 400
    
    scenario = TopicService.create_scenario(
        topic_id=topic_id,
        name=data['name'],
        description=data.get('description'),
        context=data.get('context'),
        ai_role=data.get('ai_role'),
        user_role=data.get('user_role'),
        difficulty_level=data.get('difficulty_level'),
        suggested_vocabulary=data.get('suggested_vocabulary'),
        sample_dialog=data.get('sample_dialog'),
        tips=data.get('tips')
    )
    
    return jsonify(scenario), 201
