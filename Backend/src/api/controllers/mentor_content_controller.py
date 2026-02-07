"""
Mentor Content Controller
API endpoints for mentor teaching content and guidance
"""

from flask import Blueprint, request, jsonify
from flasgger import swag_from
from services.mentor_content_service import MentorContentService

mentor_content_bp = Blueprint('mentor_content', __name__, url_prefix='/api/mentor/content')
service = MentorContentService()


# ==================== CONFIDENCE BUILDING ====================

@mentor_content_bp.route('/confidence/techniques', methods=['GET'])
@swag_from({
    'tags': ['Mentor Content'],
    'summary': 'Get confidence building techniques',
    'responses': {'200': {'description': 'List of techniques'}}
})
def get_confidence_techniques():
    """Get all confidence building techniques"""
    techniques = service.get_confidence_techniques()
    return jsonify(techniques), 200


@mentor_content_bp.route('/confidence/activities', methods=['GET'])
@swag_from({
    'tags': ['Mentor Content'],
    'summary': 'Get confidence building activities',
    'responses': {'200': {'description': 'List of activities'}}
})
def get_confidence_activities():
    """Get confidence building activities"""
    activities = service.get_confidence_activities()
    return jsonify(activities), 200


@mentor_content_bp.route('/confidence/assign', methods=['POST'])
@swag_from({
    'tags': ['Mentor Content'],
    'summary': 'Assign activity to learner',
    'responses': {'201': {'description': 'Activity assigned'}}
})
def assign_confidence_activity():
    """Assign a confidence building activity to a learner"""
    data = request.get_json()
    mentor_id = data.get('mentor_id')
    learner_id = data.get('learner_id')
    activity_id = data.get('activity_id')
    result = service.assign_activity(mentor_id, learner_id, activity_id)
    return jsonify({'message': 'Activity assigned', 'id': result}), 201


@mentor_content_bp.route('/confidence/progress/<int:learner_id>', methods=['GET'])
@swag_from({
    'tags': ['Mentor Content'],
    'summary': 'Get learner confidence progress',
    'parameters': [{'name': 'learner_id', 'in': 'path', 'type': 'integer', 'required': True}],
    'responses': {'200': {'description': 'Confidence progress data'}}
})
def get_confidence_progress(learner_id):
    """Get confidence progress for a learner"""
    progress = service.get_learner_confidence_progress(learner_id)
    return jsonify(progress), 200


# ==================== CLEAR EXPRESSION ====================

@mentor_content_bp.route('/expression/tips', methods=['GET'])
@swag_from({
    'tags': ['Mentor Content'],
    'summary': 'Get clear expression tips',
    'responses': {'200': {'description': 'List of expression tips'}}
})
def get_expression_tips():
    """Get tips for clear expression"""
    tips = service.get_expression_tips()
    return jsonify(tips), 200


@mentor_content_bp.route('/expression/exercises', methods=['GET'])
@swag_from({
    'tags': ['Mentor Content'],
    'summary': 'Get expression exercises',
    'responses': {'200': {'description': 'List of exercises'}}
})
def get_expression_exercises():
    """Get expression practice exercises"""
    level = request.args.get('level', 'all')
    exercises = service.get_expression_exercises(level)
    return jsonify(exercises), 200


@mentor_content_bp.route('/expression/feedback', methods=['POST'])
@swag_from({
    'tags': ['Mentor Content'],
    'summary': 'Provide expression feedback',
    'responses': {'201': {'description': 'Feedback saved'}}
})
def provide_expression_feedback():
    """Provide feedback on learner's expression"""
    data = request.get_json()
    feedback = service.save_expression_feedback(data)
    return jsonify({'message': 'Feedback saved', 'id': feedback}), 201


# ==================== GRAMMAR CORRECTION ====================

@mentor_content_bp.route('/grammar/common-errors', methods=['GET'])
@swag_from({
    'tags': ['Mentor Content'],
    'summary': 'Get common grammar errors',
    'responses': {'200': {'description': 'List of common errors'}}
})
def get_common_grammar_errors():
    """Get list of common grammar errors"""
    errors = service.get_common_grammar_errors()
    return jsonify(errors), 200


@mentor_content_bp.route('/grammar/analyze', methods=['POST'])
@swag_from({
    'tags': ['Mentor Content'],
    'summary': 'Analyze text for grammar errors',
    'responses': {'200': {'description': 'Grammar analysis result'}}
})
def analyze_grammar():
    """Analyze text for grammar errors"""
    data = request.get_json()
    text = data.get('text', '')
    result = service.analyze_grammar(text)
    return jsonify(result), 200


@mentor_content_bp.route('/grammar/learner/<int:learner_id>/errors', methods=['GET'])
@swag_from({
    'tags': ['Mentor Content'],
    'summary': 'Get learner grammar error history',
    'parameters': [{'name': 'learner_id', 'in': 'path', 'type': 'integer', 'required': True}],
    'responses': {'200': {'description': 'Error history'}}
})
def get_learner_grammar_errors(learner_id):
    """Get grammar error history for a learner"""
    errors = service.get_learner_grammar_history(learner_id)
    return jsonify(errors), 200


# ==================== PRONUNCIATION ====================

@mentor_content_bp.route('/pronunciation/common-errors', methods=['GET'])
@swag_from({
    'tags': ['Mentor Content'],
    'summary': 'Get common pronunciation errors',
    'responses': {'200': {'description': 'List of pronunciation errors'}}
})
def get_common_pronunciation_errors():
    """Get list of common pronunciation errors"""
    errors = service.get_common_pronunciation_errors()
    return jsonify(errors), 200


@mentor_content_bp.route('/pronunciation/ipa-guide', methods=['GET'])
@swag_from({
    'tags': ['Mentor Content'],
    'summary': 'Get IPA pronunciation guide',
    'responses': {'200': {'description': 'IPA guide data'}}
})
def get_ipa_guide():
    """Get IPA pronunciation guide"""
    guide = service.get_ipa_guide()
    return jsonify(guide), 200


# ==================== VOCABULARY / WORD USAGE ====================

@mentor_content_bp.route('/vocabulary/collocations', methods=['GET'])
@swag_from({
    'tags': ['Mentor Content'],
    'summary': 'Get collocations list',
    'responses': {'200': {'description': 'List of collocations'}}
})
def get_collocations():
    """Get list of common collocations"""
    category = request.args.get('category', 'all')
    collocations = service.get_collocations(category)
    return jsonify(collocations), 200


@mentor_content_bp.route('/vocabulary/idioms', methods=['GET'])
@swag_from({
    'tags': ['Mentor Content'],
    'summary': 'Get idioms list',
    'responses': {'200': {'description': 'List of idioms'}}
})
def get_idioms():
    """Get list of idioms"""
    level = request.args.get('level', 'all')
    idioms = service.get_idioms(level)
    return jsonify(idioms), 200


@mentor_content_bp.route('/vocabulary/common-mistakes', methods=['GET'])
@swag_from({
    'tags': ['Mentor Content'],
    'summary': 'Get common word usage mistakes',
    'responses': {'200': {'description': 'List of common mistakes'}}
})
def get_word_usage_mistakes():
    """Get common word usage mistakes"""
    mistakes = service.get_common_word_mistakes()
    return jsonify(mistakes), 200


# ==================== CONVERSATION TOPICS ====================

@mentor_content_bp.route('/topics/categories', methods=['GET'])
@swag_from({
    'tags': ['Mentor Content'],
    'summary': 'Get conversation topic categories',
    'responses': {'200': {'description': 'List of categories'}}
})
def get_topic_categories():
    """Get conversation topic categories"""
    categories = service.get_topic_categories()
    return jsonify(categories), 200


@mentor_content_bp.route('/topics/<category>/scenarios', methods=['GET'])
@swag_from({
    'tags': ['Mentor Content'],
    'summary': 'Get scenarios for a category',
    'parameters': [{'name': 'category', 'in': 'path', 'type': 'string', 'required': True}],
    'responses': {'200': {'description': 'List of scenarios'}}
})
def get_topic_scenarios(category):
    """Get conversation scenarios for a category"""
    scenarios = service.get_scenarios_by_category(category)
    return jsonify(scenarios), 200


@mentor_content_bp.route('/topics/assign', methods=['POST'])
@swag_from({
    'tags': ['Mentor Content'],
    'summary': 'Assign topic to learner',
    'responses': {'201': {'description': 'Topic assigned'}}
})
def assign_topic():
    """Assign a conversation topic to a learner"""
    data = request.get_json()
    result = service.assign_topic(data)
    return jsonify({'message': 'Topic assigned', 'id': result}), 201


# ==================== REAL LIFE SITUATIONS ====================

@mentor_content_bp.route('/situations', methods=['GET'])
@swag_from({
    'tags': ['Mentor Content'],
    'summary': 'Get real life situations',
    'responses': {'200': {'description': 'List of situations'}}
})
def get_situations():
    """Get list of real life practice situations"""
    category = request.args.get('category', 'all')
    situations = service.get_real_life_situations(category)
    return jsonify(situations), 200


@mentor_content_bp.route('/situations/<int:situation_id>/scripts', methods=['GET'])
@swag_from({
    'tags': ['Mentor Content'],
    'summary': 'Get scripts for a situation',
    'parameters': [{'name': 'situation_id', 'in': 'path', 'type': 'integer', 'required': True}],
    'responses': {'200': {'description': 'List of scripts'}}
})
def get_situation_scripts(situation_id):
    """Get practice scripts for a situation"""
    scripts = service.get_situation_scripts(situation_id)
    return jsonify(scripts), 200
