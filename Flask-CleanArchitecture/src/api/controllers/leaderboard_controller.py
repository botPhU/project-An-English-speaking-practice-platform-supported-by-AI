"""
Leaderboard Controller
API endpoints for leaderboard and ranking system
"""

from flask import Blueprint, request, jsonify
from flasgger import swag_from
from services.challenge_service import ChallengeService
from infrastructure.databases.mssql import get_db_session
from infrastructure.models.user_model import UserModel
from infrastructure.models.progress_model import ProgressModel
from sqlalchemy import func, desc

leaderboard_bp = Blueprint('leaderboard', __name__, url_prefix='/api/leaderboard')
challenge_service = ChallengeService()


@leaderboard_bp.route('/', methods=['GET'])
@swag_from({
    'tags': ['Leaderboard'],
    'summary': 'Get global leaderboard',
    'parameters': [
        {'name': 'period', 'in': 'query', 'type': 'string', 'required': False, 
         'description': 'weekly, monthly, or all-time', 'default': 'weekly'},
        {'name': 'limit', 'in': 'query', 'type': 'integer', 'required': False, 'default': 10}
    ],
    'responses': {
        '200': {
            'description': 'Leaderboard data with rankings',
            'schema': {
                'type': 'object',
                'properties': {
                    'period': {'type': 'string'},
                    'entries': {
                        'type': 'array',
                        'items': {
                            'type': 'object',
                            'properties': {
                                'rank': {'type': 'integer'},
                                'user_id': {'type': 'integer'},
                                'username': {'type': 'string'},
                                'avatar': {'type': 'string'},
                                'total_score': {'type': 'integer'},
                                'level': {'type': 'string'},
                                'streak': {'type': 'integer'}
                            }
                        }
                    }
                }
            }
        }
    }
})
def get_leaderboard():
    """Get global leaderboard with rankings"""
    period = request.args.get('period', 'weekly')
    limit = request.args.get('limit', 10, type=int)
    
    leaderboard = challenge_service.get_leaderboard(period, limit)
    
    return jsonify({
        'period': period,
        'entries': leaderboard,
        'total_users': len(leaderboard)
    }), 200


@leaderboard_bp.route('/my-rank', methods=['GET'])
@swag_from({
    'tags': ['Leaderboard'],
    'summary': 'Get current user rank',
    'parameters': [
        {'name': 'user_id', 'in': 'query', 'type': 'integer', 'required': True},
        {'name': 'period', 'in': 'query', 'type': 'string', 'required': False, 'default': 'weekly'}
    ],
    'responses': {
        '200': {
            'description': 'User rank information',
            'schema': {
                'type': 'object',
                'properties': {
                    'rank': {'type': 'integer'},
                    'total_score': {'type': 'integer'},
                    'percentile': {'type': 'number'},
                    'next_rank_score': {'type': 'integer'}
                }
            }
        }
    }
})
def get_my_rank():
    """Get current user's rank in leaderboard"""
    user_id = request.args.get('user_id', type=int)
    period = request.args.get('period', 'weekly')
    
    if not user_id:
        return jsonify({'error': 'user_id is required'}), 400
    
    # Get full leaderboard to calculate rank
    leaderboard = challenge_service.get_leaderboard(period, limit=1000)
    
    user_rank = None
    user_score = 0
    next_rank_score = None
    
    for idx, entry in enumerate(leaderboard):
        if entry.get('user_id') == user_id:
            user_rank = idx + 1
            user_score = entry.get('total_score', 0)
            if idx > 0:
                next_rank_score = leaderboard[idx - 1].get('total_score', 0)
            break
    
    if user_rank is None:
        # User not in leaderboard yet
        return jsonify({
            'rank': len(leaderboard) + 1,
            'total_score': 0,
            'percentile': 0,
            'next_rank_score': leaderboard[-1].get('total_score', 10) if leaderboard else 10,
            'message': 'Start practicing to appear on the leaderboard!'
        }), 200
    
    total_users = len(leaderboard)
    percentile = ((total_users - user_rank) / total_users * 100) if total_users > 0 else 0
    
    return jsonify({
        'rank': user_rank,
        'total_score': user_score,
        'percentile': round(percentile, 1),
        'next_rank_score': next_rank_score,
        'users_ahead': user_rank - 1,
        'users_behind': total_users - user_rank
    }), 200


@leaderboard_bp.route('/top-streaks', methods=['GET'])
@swag_from({
    'tags': ['Leaderboard'],
    'summary': 'Get top learning streaks',
    'parameters': [
        {'name': 'limit', 'in': 'query', 'type': 'integer', 'required': False, 'default': 10}
    ],
    'responses': {
        '200': {'description': 'Top streaks list'}
    }
})
def get_top_streaks():
    """Get users with top learning streaks"""
    limit = request.args.get('limit', 10, type=int)
    
    session = get_db_session()
    try:
        top_streaks = session.query(
            UserModel.id,
            UserModel.username,
            UserModel.avatar,
            ProgressModel.current_streak
        ).join(
            ProgressModel, UserModel.id == ProgressModel.user_id
        ).filter(
            ProgressModel.current_streak > 0
        ).order_by(
            desc(ProgressModel.current_streak)
        ).limit(limit).all()
        
        result = []
        for idx, (user_id, username, avatar, streak) in enumerate(top_streaks):
            result.append({
                'rank': idx + 1,
                'user_id': user_id,
                'username': username,
                'avatar': avatar,
                'streak': streak
            })
        
        return jsonify({'entries': result}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        session.close()


@leaderboard_bp.route('/categories', methods=['GET'])
@swag_from({
    'tags': ['Leaderboard'],
    'summary': 'Get leaderboard by category',
    'parameters': [
        {'name': 'category', 'in': 'query', 'type': 'string', 'required': True,
         'description': 'pronunciation, grammar, vocabulary, or overall'},
        {'name': 'limit', 'in': 'query', 'type': 'integer', 'required': False, 'default': 10}
    ],
    'responses': {
        '200': {'description': 'Category-specific leaderboard'}
    }
})
def get_category_leaderboard():
    """Get leaderboard for specific skill category"""
    category = request.args.get('category', 'overall')
    limit = request.args.get('limit', 10, type=int)
    
    session = get_db_session()
    try:
        # Map category to score field
        score_fields = {
            'pronunciation': ProgressModel.pronunciation_score,
            'grammar': ProgressModel.grammar_score,
            'vocabulary': ProgressModel.vocabulary_score,
            'overall': ProgressModel.total_score
        }
        
        score_field = score_fields.get(category, ProgressModel.total_score)
        
        top_users = session.query(
            UserModel.id,
            UserModel.username,
            UserModel.avatar,
            score_field.label('score')
        ).join(
            ProgressModel, UserModel.id == ProgressModel.user_id
        ).filter(
            score_field > 0
        ).order_by(
            desc(score_field)
        ).limit(limit).all()
        
        result = []
        for idx, (user_id, username, avatar, score) in enumerate(top_users):
            result.append({
                'rank': idx + 1,
                'user_id': user_id,
                'username': username,
                'avatar': avatar,
                'score': score,
                'category': category
            })
        
        return jsonify({
            'category': category,
            'entries': result
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        session.close()
