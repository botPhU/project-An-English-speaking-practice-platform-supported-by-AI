from flask import Blueprint, request, jsonify
from flasgger import swag_from
from services.mentor_service import MentorService

mentor_bp = Blueprint('mentor', __name__, url_prefix='/api/mentor')
mentor_service = MentorService()

# ==================== DASHBOARD ====================
@mentor_bp.route('/dashboard/<int:mentor_id>', methods=['GET'])
@swag_from({
    'tags': ['Mentor'],
    'summary': 'Get mentor dashboard statistics',
    'parameters': [{'name': 'mentor_id', 'in': 'path', 'type': 'integer', 'required': True}],
    'responses': {'200': {'description': 'Dashboard data'}}
})
def get_dashboard(mentor_id):
    """Get mentor dashboard data"""
    stats = mentor_service.get_dashboard_stats(mentor_id)
    return jsonify(stats), 200

# ==================== LEARNERS ====================
@mentor_bp.route('/learners/<int:mentor_id>', methods=['GET'])
@swag_from({
    'tags': ['Mentor'],
    'summary': 'Get assigned learners',
    'parameters': [{'name': 'mentor_id', 'in': 'path', 'type': 'integer', 'required': True}],
    'responses': {'200': {'description': 'List of learners'}}
})
def get_learners(mentor_id):
    """Get learners assigned to this mentor"""
    learners = mentor_service.get_assigned_learners(mentor_id)
    return jsonify([{
        'id': l.id,
        'user_name': l.user_name,
        'full_name': l.full_name,
        'email': l.email
    } for l in learners]), 200

@mentor_bp.route('/learners/<int:mentor_id>/<int:learner_id>/sessions', methods=['GET'])
@swag_from({
    'tags': ['Mentor'],
    'summary': 'Get sessions with a learner',
    'responses': {'200': {'description': 'List of sessions'}}
})
def get_learner_sessions(mentor_id, learner_id):
    """Get sessions with a specific learner"""
    sessions = mentor_service.get_learner_sessions(mentor_id, learner_id)
    return jsonify([{
        'id': s.id,
        'session_type': s.session_type,
        'topic': s.topic,
        'overall_score': s.overall_score,
        'is_completed': s.is_completed,
        'created_at': str(s.created_at) if s.created_at else None
    } for s in sessions]), 200

# ==================== FEEDBACK ====================
@mentor_bp.route('/feedback/session/<int:session_id>', methods=['POST'])
@swag_from({
    'tags': ['Mentor'],
    'summary': 'Provide feedback for a session',
    'responses': {'200': {'description': 'Feedback saved'}}
})
def provide_session_feedback(session_id):
    """Provide feedback for a practice session"""
    data = request.get_json()
    mentor_id = data.get('mentor_id')
    feedback_data = data.get('feedback')
    mentor_service.provide_feedback(mentor_id, session_id, feedback_data)
    return jsonify({'message': 'Feedback provided'}), 200

@mentor_bp.route('/feedback/learner', methods=['POST'])
@swag_from({
    'tags': ['Mentor'],
    'summary': 'Create general feedback for a learner',
    'responses': {'201': {'description': 'Feedback created'}}
})
def create_learner_feedback():
    """Create general feedback for a learner"""
    data = request.get_json()
    mentor_id = data.get('mentor_id')
    learner_id = data.get('learner_id')
    feedback = mentor_service.create_learner_feedback(mentor_id, learner_id, data)
    return jsonify({'id': feedback.id, 'message': 'Feedback created'}), 201

# ==================== ASSESSMENT ====================
@mentor_bp.route('/assess', methods=['POST'])
@swag_from({
    'tags': ['Mentor'],
    'summary': 'Assess a learner',
    'responses': {'201': {'description': 'Assessment created'}}
})
def assess_learner():
    """Assess a learner's proficiency"""
    data = request.get_json()
    mentor_id = data.get('mentor_id')
    learner_id = data.get('learner_id')
    assessment_data = data.get('assessment')
    assessment = mentor_service.assess_learner(mentor_id, learner_id, assessment_data)
    return jsonify({
        'id': assessment.id,
        'level': assessment.determined_level,
        'message': 'Assessment completed'
    }), 201

# ==================== RESOURCES ====================
@mentor_bp.route('/resources/<int:mentor_id>', methods=['GET'])
@swag_from({
    'tags': ['Mentor'],
    'summary': 'Get mentor resources',
    'responses': {'200': {'description': 'List of resources'}}
})
def get_resources(mentor_id):
    """Get mentor's shared resources"""
    resources = mentor_service.get_resources(mentor_id)
    return jsonify(resources), 200

@mentor_bp.route('/resources', methods=['POST'])
@swag_from({
    'tags': ['Mentor'],
    'summary': 'Share a resource',
    'responses': {'201': {'description': 'Resource shared'}}
})
def share_resource():
    """Share a resource with learners"""
    data = request.get_json()
    mentor_id = data.get('mentor_id')
    resource = mentor_service.share_resource(mentor_id, data)
    return jsonify({'message': 'Resource shared'}), 201


# ==================== REVIEWS ====================
@mentor_bp.route('/reviews', methods=['POST'])
@swag_from({
    'tags': ['Mentor'],
    'summary': 'Submit a review for a mentor',
    'responses': {'201': {'description': 'Review submitted'}}
})
def submit_review():
    """Submit a review for a mentor (by learner)"""
    db_session = None
    try:
        from infrastructure.models.review_model import ReviewModel
        from infrastructure.databases.mssql import SessionLocal
        from datetime import datetime
        
        data = request.get_json()
        
        # Validate required fields
        if not data.get('learner_id') or not data.get('mentor_id'):
            return jsonify({'error': 'learner_id và mentor_id là bắt buộc'}), 400
        if not data.get('rating') or not (1 <= data.get('rating') <= 5):
            return jsonify({'error': 'rating phải từ 1 đến 5'}), 400
        
        # Create new session for this request
        db_session = SessionLocal()
        
        review = ReviewModel(
            learner_id=data.get('learner_id'),
            mentor_id=data.get('mentor_id'),
            reviewer_id=data.get('learner_id'),  # learner is the reviewer
            reviewed_id=data.get('mentor_id'),   # mentor is being reviewed
            session_id=data.get('session_id'),
            session_type='mentor',
            booking_id=data.get('booking_id'),
            rating=data.get('rating'),
            comment=data.get('comment'),
            created_at=datetime.now()
        )
        
        db_session.add(review)
        db_session.commit()
        
        review_id = review.id
        
        return jsonify({
            'id': review_id,
            'message': 'Đánh giá đã được gửi thành công!'
        }), 201
        
    except Exception as e:
        if db_session:
            db_session.rollback()
        print(f"[SUBMIT_REVIEW] Error: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        if db_session:
            db_session.close()


@mentor_bp.route('/reviews/<int:mentor_id>', methods=['GET'])
@swag_from({
    'tags': ['Mentor'],
    'summary': 'Get reviews for a mentor',
    'responses': {'200': {'description': 'List of reviews'}}
})
def get_mentor_reviews(mentor_id):
    """Get all reviews for a mentor"""
    try:
        from infrastructure.models.review_model import ReviewModel
        from infrastructure.databases.mssql import session as db_session
        from sqlalchemy import func
        
        reviews = db_session.query(ReviewModel)\
            .filter_by(mentor_id=mentor_id)\
            .order_by(ReviewModel.created_at.desc())\
            .limit(20)\
            .all()
        
        # Get average rating
        avg_result = db_session.query(
            func.avg(ReviewModel.rating),
            func.count(ReviewModel.id)
        ).filter_by(mentor_id=mentor_id).first()
        
        avg_rating = round(float(avg_result[0]), 1) if avg_result[0] else None
        total_reviews = avg_result[1] if avg_result[1] else 0
        
        return jsonify({
            'reviews': [r.to_dict() for r in reviews],
            'avg_rating': avg_rating,
            'total_reviews': total_reviews
        }), 200
        
    except Exception as e:
        print(f"[GET_REVIEWS] Error: {e}")
        return jsonify({'reviews': [], 'avg_rating': None, 'total_reviews': 0}), 200

