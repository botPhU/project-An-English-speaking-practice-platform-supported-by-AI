"""
Mentor Application Controller
API endpoints for mentor application and admin review
"""

from flask import Blueprint, request, jsonify
from datetime import datetime
from infrastructure.databases.mssql import get_db_session
from infrastructure.models.mentor_application_model import MentorApplicationModel
import json

mentor_application_bp = Blueprint('mentor_application', __name__, url_prefix='/api/mentor-application')


@mentor_application_bp.route('/submit', methods=['POST'])
def submit_application():
    """Submit a new mentor application"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required = ['full_name', 'email', 'english_level', 'motivation']
        for field in required:
            if not data.get(field):
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        with get_db_session() as session:
            # Check if email already has pending application
            existing = session.query(MentorApplicationModel).filter_by(
                email=data['email'],
                status='pending'
            ).first()
            
            if existing:
                return jsonify({
                    'error': 'You already have a pending application',
                    'application_id': existing.id
                }), 400
            
            # Create application
            application = MentorApplicationModel(
                user_id=data.get('user_id'),
                full_name=data['full_name'],
                email=data['email'],
                phone=data.get('phone'),
                date_of_birth=datetime.fromisoformat(data['date_of_birth']) if data.get('date_of_birth') else None,
                current_job=data.get('current_job'),
                company=data.get('company'),
                years_experience=data.get('years_experience', 0),
                education_level=data.get('education_level'),
                major=data.get('major'),
                university=data.get('university'),
                english_certificates=json.dumps(data.get('english_certificates', [])),
                native_language=data.get('native_language'),
                english_level=data['english_level'],
                teaching_experience=data.get('teaching_experience'),
                specializations=json.dumps(data.get('specializations', [])),
                target_students=json.dumps(data.get('target_students', [])),
                available_hours_per_week=data.get('available_hours_per_week', 10),
                preferred_schedule=json.dumps(data.get('preferred_schedule', {})),
                motivation=data['motivation'],
                teaching_style=data.get('teaching_style'),
                cv_file_path=data.get('cv_file_path'),
                certificate_files=json.dumps(data.get('certificate_files', [])),
                video_intro_url=data.get('video_intro_url'),
                status='pending'
            )
            
            session.add(application)
            session.commit()
            
            return jsonify({
                'success': True,
                'message': 'Application submitted successfully',
                'application_id': application.id,
                'status': 'pending'
            }), 201
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@mentor_application_bp.route('/status/<int:application_id>', methods=['GET'])
def get_application_status(application_id):
    """Get application status"""
    try:
        with get_db_session() as session:
            application = session.query(MentorApplicationModel).filter_by(id=application_id).first()
            
            if not application:
                return jsonify({'error': 'Application not found'}), 404
            
            return jsonify({
                'application_id': application.id,
                'status': application.status,
                'submitted_at': application.created_at.isoformat() if application.created_at else None,
                'reviewed_at': application.reviewed_at.isoformat() if application.reviewed_at else None,
                'rejection_reason': application.rejection_reason if application.status == 'rejected' else None
            }), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@mentor_application_bp.route('/by-email/<email>', methods=['GET'])
def get_application_by_email(email):
    """Get application by email"""
    try:
        with get_db_session() as session:
            application = session.query(MentorApplicationModel).filter_by(
                email=email
            ).order_by(MentorApplicationModel.created_at.desc()).first()
            
            if not application:
                return jsonify({'has_application': False}), 200
            
            return jsonify({
                'has_application': True,
                'application': application.to_dict()
            }), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============= ADMIN ENDPOINTS =============

@mentor_application_bp.route('/admin/list', methods=['GET'])
def admin_list_applications():
    """Admin: List all applications with filters"""
    try:
        status = request.args.get('status', 'all')
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 20, type=int)
        
        with get_db_session() as session:
            query = session.query(MentorApplicationModel)
            
            if status != 'all':
                query = query.filter_by(status=status)
            
            total = query.count()
            applications = query.order_by(
                MentorApplicationModel.created_at.desc()
            ).offset((page - 1) * limit).limit(limit).all()
            
            return jsonify({
                'applications': [app.to_dict() for app in applications],
                'total': total,
                'page': page,
                'pages': (total + limit - 1) // limit,
                'stats': {
                    'pending': session.query(MentorApplicationModel).filter_by(status='pending').count(),
                    'reviewing': session.query(MentorApplicationModel).filter_by(status='reviewing').count(),
                    'approved': session.query(MentorApplicationModel).filter_by(status='approved').count(),
                    'rejected': session.query(MentorApplicationModel).filter_by(status='rejected').count()
                }
            }), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@mentor_application_bp.route('/admin/<int:application_id>', methods=['GET'])
def admin_get_application(application_id):
    """Admin: Get full application details"""
    try:
        with get_db_session() as session:
            application = session.query(MentorApplicationModel).filter_by(id=application_id).first()
            
            if not application:
                return jsonify({'error': 'Application not found'}), 404
            
            return jsonify({
                'application': application.to_dict()
            }), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@mentor_application_bp.route('/admin/<int:application_id>/review', methods=['PUT'])
def admin_review_application(application_id):
    """Admin: Update application status (start reviewing)"""
    try:
        data = request.get_json()
        admin_id = data.get('admin_id')
        notes = data.get('notes', '')
        
        with get_db_session() as session:
            application = session.query(MentorApplicationModel).filter_by(id=application_id).first()
            
            if not application:
                return jsonify({'error': 'Application not found'}), 404
            
            application.status = 'reviewing'
            application.admin_notes = notes
            application.reviewed_by = admin_id
            
            session.commit()
            
            return jsonify({
                'success': True,
                'message': 'Application marked as reviewing',
                'status': 'reviewing'
            }), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@mentor_application_bp.route('/admin/<int:application_id>/approve', methods=['POST'])
def admin_approve_application(application_id):
    """Admin: Approve application and activate mentor account"""
    try:
        data = request.get_json()
        admin_id = data.get('admin_id')
        notes = data.get('notes', '')
        
        with get_db_session() as session:
            application = session.query(MentorApplicationModel).filter_by(id=application_id).first()
            
            if not application:
                return jsonify({'error': 'Application not found'}), 404
            
            if application.status == 'approved':
                return jsonify({'error': 'Application already approved'}), 400
            
            # Update application status
            application.status = 'approved'
            application.admin_notes = notes
            application.reviewed_by = admin_id
            application.reviewed_at = datetime.now()
            
            # Activate the mentor user account
            mentor_activated = False
            if application.user_id:
                from infrastructure.models.user_model import UserModel
                user = session.query(UserModel).filter_by(id=application.user_id).first()
                if user:
                    user.status = True  # Activate account
                    user.role = 'mentor'  # Ensure role is mentor
                    user.updated_at = datetime.now()
                    mentor_activated = True
            
            session.commit()
            
            return jsonify({
                'success': True,
                'message': 'Application approved. Mentor account activated.' if mentor_activated else 'Application approved.',
                'application_id': application_id,
                'mentor_email': application.email,
                'mentor_activated': mentor_activated,
                'user_id': application.user_id
            }), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@mentor_application_bp.route('/admin/<int:application_id>/reject', methods=['POST'])
def admin_reject_application(application_id):
    """Admin: Reject application"""
    try:
        data = request.get_json()
        admin_id = data.get('admin_id')
        reason = data.get('reason', 'Application does not meet requirements')
        notes = data.get('notes', '')
        
        with get_db_session() as session:
            application = session.query(MentorApplicationModel).filter_by(id=application_id).first()
            
            if not application:
                return jsonify({'error': 'Application not found'}), 404
            
            application.status = 'rejected'
            application.rejection_reason = reason
            application.admin_notes = notes
            application.reviewed_by = admin_id
            application.reviewed_at = datetime.now()
            
            session.commit()
            
            # TODO: Send rejection email to applicant
            
            return jsonify({
                'success': True,
                'message': 'Application rejected',
                'application_id': application_id
            }), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500
