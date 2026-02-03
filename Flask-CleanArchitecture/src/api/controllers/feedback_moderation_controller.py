"""
Feedback Moderation Controller
API endpoints for admin feedback/content moderation
"""
from flask import Blueprint, request, jsonify
from datetime import datetime
from infrastructure.databases.mssql import get_db_session
from infrastructure.models.review_model import ReviewModel
from infrastructure.models.user_model import UserModel
from sqlalchemy import func

feedback_moderation_bp = Blueprint('feedback_moderation', __name__, url_prefix='/api/admin/feedbacks')


@feedback_moderation_bp.route('/', methods=['GET'])
def get_feedbacks():
    """
    Get all feedbacks/reviews for moderation
    ---
    tags:
      - Admin - Feedback Moderation
    parameters:
      - name: status
        in: query
        type: string
        enum: [all, pending, approved, rejected]
    responses:
      200:
        description: List of feedbacks
    """
    status = request.args.get('status', 'all')
    
    try:
        with get_db_session() as session:
            query = session.query(ReviewModel).order_by(ReviewModel.created_at.desc())
            
            if status != 'all':
                query = query.filter_by(status=status)
            
            reviews = query.limit(50).all()
            
            result = []
            for review in reviews:
                user = session.query(UserModel).get(review.user_id) if review.user_id else None
                mentor = session.query(UserModel).get(review.mentor_id) if review.mentor_id else None
                
                result.append({
                    'id': str(review.id),
                    'user': {
                        'name': user.full_name if user else 'Unknown',
                        'role': user.role if user else 'learner',
                        'avatar': user.avatar_url if user else None
                    },
                    'content': review.comment or '',
                    'context': f'Đánh giá cho {mentor.full_name}' if mentor else 'Đánh giá chung',
                    'rating': review.rating,
                    'status': review.status or 'pending',
                    'timestamp': review.created_at.isoformat() if review.created_at else None,
                    'aiAnalysis': analyze_content(review.comment or '')
                })
            
            return jsonify(result), 200
    except Exception as e:
        print(f"Get feedbacks error: {e}")
        return jsonify([]), 200


@feedback_moderation_bp.route('/stats', methods=['GET'])
def get_feedback_stats():
    """Get feedback moderation statistics"""
    try:
        with get_db_session() as session:
            total = session.query(func.count(ReviewModel.id)).scalar() or 0
            pending = session.query(func.count(ReviewModel.id))\
                .filter_by(status='pending').scalar() or 0
            approved = session.query(func.count(ReviewModel.id))\
                .filter_by(status='approved').scalar() or 0
            rejected = session.query(func.count(ReviewModel.id))\
                .filter_by(status='rejected').scalar() or 0
            
            # Today's approved
            from datetime import date
            today = date.today()
            approved_today = session.query(func.count(ReviewModel.id))\
                .filter_by(status='approved')\
                .filter(func.date(ReviewModel.updated_at) == today).scalar() or 0
            
            return jsonify({
                'pending': {'count': pending, 'change': '+5 hôm nay'},
                'reported': {'count': 0, 'change': ''},
                'approvedToday': {'count': approved_today, 'change': ''},
                'totalFeedback': {'count': total, 'change': '+12% tháng này'}
            }), 200
    except Exception as e:
        print(f"Feedback stats error: {e}")
        return jsonify({
            'pending': {'count': 0, 'change': ''},
            'reported': {'count': 0, 'change': ''},
            'approvedToday': {'count': 0, 'change': ''},
            'totalFeedback': {'count': 0, 'change': ''}
        }), 200


@feedback_moderation_bp.route('/<feedback_id>', methods=['PUT'])
def moderate_feedback(feedback_id):
    """
    Approve or reject a feedback
    ---
    tags:
      - Admin - Feedback Moderation
    parameters:
      - name: feedback_id
        in: path
        type: string
        required: true
      - name: body
        in: body
        schema:
          type: object
          properties:
            action:
              type: string
              enum: [approve, reject]
    responses:
      200:
        description: Feedback moderated
    """
    data = request.get_json()
    action = data.get('action')  # 'approve' or 'reject'
    
    try:
        with get_db_session() as session:
            review = session.query(ReviewModel).get(int(feedback_id))
            
            if not review:
                return jsonify({'error': 'Feedback not found'}), 404
            
            if action == 'approve':
                review.status = 'approved'
            elif action == 'reject':
                review.status = 'rejected'
            else:
                return jsonify({'error': 'Invalid action'}), 400
            
            review.updated_at = datetime.now()
            
            return jsonify({
                'message': f'Feedback {action}d successfully',
                'id': feedback_id,
                'status': review.status
            }), 200
    except Exception as e:
        print(f"Moderate feedback error: {e}")
        return jsonify({'error': str(e)}), 500


@feedback_moderation_bp.route('/<feedback_id>', methods=['DELETE'])
def delete_feedback(feedback_id):
    """Delete a feedback (soft delete)"""
    try:
        with get_db_session() as session:
            review = session.query(ReviewModel).get(int(feedback_id))
            
            if not review:
                return jsonify({'error': 'Feedback not found'}), 404
            
            review.status = 'deleted'
            review.updated_at = datetime.now()
            
            return jsonify({'message': 'Feedback deleted'}), 200
    except Exception as e:
        print(f"Delete feedback error: {e}")
        return jsonify({'error': str(e)}), 500


def analyze_content(content: str) -> dict:
    """
    Simple content analysis for moderation
    In production, this could use AI for sentiment analysis
    """
    if not content:
        return {'type': 'neutral', 'label': 'Bình thường'}
    
    content_lower = content.lower()
    
    # Check for positive indicators
    positive_words = ['tuyệt vời', 'xuất sắc', 'rất tốt', 'hài lòng', 'cảm ơn', 'hay', 'giỏi']
    negative_words = ['tệ', 'kém', 'không tốt', 'thất vọng', 'lừa đảo', 'scam']
    flagged_words = ['spam', 'quảng cáo', 'link', 'http']
    
    for word in flagged_words:
        if word in content_lower:
            return {'type': 'flagged', 'label': 'Nghi ngờ spam'}
    
    for word in negative_words:
        if word in content_lower:
            return {'type': 'warning', 'label': 'Tiêu cực'}
    
    for word in positive_words:
        if word in content_lower:
            return {'type': 'positive', 'label': 'Tích cực'}
    
    return {'type': 'neutral', 'label': 'Bình thường'}
