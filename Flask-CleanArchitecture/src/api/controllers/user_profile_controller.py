"""
User Profile Controller for AESP Platform
Handles user profile retrieval and updates with secure JWT-based authentication
"""

from flask import Blueprint, request, jsonify
from datetime import datetime

from services.auth_service import AuthService
from infrastructure.models.user_model import UserModel
from infrastructure.databases.mssql import get_db_session_context

user_profile_bp = Blueprint('user_profile', __name__, url_prefix='/api/user')


def get_user_id_from_token():
    """
    Securely extract user_id from JWT token in Authorization header.
    Returns user_id if valid, None otherwise.
    """
    auth_header = request.headers.get('Authorization', '')
    
    if not auth_header.startswith('Bearer '):
        return None
    
    token = auth_header.replace('Bearer ', '')
    user_data = AuthService.get_current_user(token)
    
    if not user_data:
        return None
    
    return user_data['user_id']


@user_profile_bp.route('/profile', methods=['GET'])
def get_profile():
    """
    Get current user's profile information
    ---
    tags:
      - User Profile
    parameters:
      - in: header
        name: Authorization
        type: string
        required: true
        description: Bearer token
    responses:
      200:
        description: User profile data
      401:
        description: Unauthorized
    """
    user_id = get_user_id_from_token()
    
    if not user_id:
        return jsonify({'error': 'Missing or invalid authorization token'}), 401
    
    with get_db_session_context() as session:
        user = session.query(UserModel).filter_by(id=user_id).first()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'id': user.id,
            'user_name': user.user_name,
            'email': user.email,
            'full_name': user.full_name,
            'role': user.role,
            'phone_number': user.phone_number,
            'date_of_birth': user.date_of_birth.isoformat() if user.date_of_birth else None,
            'gender': user.gender,
            'address': user.address,
            'city': user.city,
            'country': user.country,
            'avatar_url': user.avatar_url,
            'bio': user.bio,
            'profile_completed': user.profile_completed,
            'created_at': user.created_at.isoformat() if user.created_at else None
        }), 200


@user_profile_bp.route('/profile', methods=['PUT'])
def update_profile():
    """
    Update current user's profile information
    Automatically sets profile_completed to True after successful update
    ---
    tags:
      - User Profile
    parameters:
      - in: header
        name: Authorization
        type: string
        required: true
        description: Bearer token
      - in: body
        name: body
        schema:
          type: object
          required:
            - full_name
            - phone_number
            - date_of_birth
          properties:
            full_name:
              type: string
              description: User's full name
            phone_number:
              type: string
              description: Phone number
            date_of_birth:
              type: string
              format: date
              description: Date of birth (YYYY-MM-DD)
            gender:
              type: string
              enum: [male, female, other]
            address:
              type: string
            city:
              type: string
            country:
              type: string
            avatar_url:
              type: string
            bio:
              type: string
    responses:
      200:
        description: Profile updated successfully
      400:
        description: Validation error
      401:
        description: Unauthorized
    """
    user_id = get_user_id_from_token()
    
    if not user_id:
        return jsonify({'error': 'Missing or invalid authorization token'}), 401
    
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['full_name', 'phone_number', 'date_of_birth']
    missing_fields = [field for field in required_fields if not data.get(field)]
    
    if missing_fields:
        return jsonify({
            'error': f'Missing required fields: {", ".join(missing_fields)}'
        }), 400
    
    # Validate phone number format (basic validation)
    phone = data.get('phone_number', '').strip()
    if phone and (len(phone) < 9 or len(phone) > 15):
        return jsonify({'error': 'Phone number must be between 9 and 15 characters'}), 400
    
    # Validate date of birth format
    try:
        dob = datetime.strptime(data['date_of_birth'], '%Y-%m-%d').date()
        # Check if date is not in the future
        if dob > datetime.now().date():
            return jsonify({'error': 'Date of birth cannot be in the future'}), 400
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
    
    # Validate gender if provided
    valid_genders = ['male', 'female', 'other', None, '']
    if data.get('gender') and data.get('gender') not in valid_genders:
        return jsonify({'error': 'Gender must be one of: male, female, other'}), 400
    
    # Sanitize input - remove harmful characters
    def sanitize_string(value, max_length=255):
        if not value:
            return None
        # Remove potential XSS characters and trim
        sanitized = str(value).strip()
        sanitized = sanitized.replace('<', '').replace('>', '').replace('"', '').replace("'", '')
        return sanitized[:max_length] if sanitized else None
    
    try:
        with get_db_session_context() as session:
            user = session.query(UserModel).filter_by(id=user_id).first()
            
            if not user:
                return jsonify({'error': 'User not found'}), 404
            
            # Update user profile fields
            user.full_name = sanitize_string(data.get('full_name'), 100)
            user.phone_number = sanitize_string(data.get('phone_number'), 20)
            user.date_of_birth = dob
            user.gender = sanitize_string(data.get('gender'), 10)
            user.address = sanitize_string(data.get('address'), 255)
            user.city = sanitize_string(data.get('city'), 100)
            user.country = sanitize_string(data.get('country'), 100)
            user.avatar_url = sanitize_string(data.get('avatar_url'), 500)
            user.bio = sanitize_string(data.get('bio'), 1000)
            
            # Mark profile as completed
            user.profile_completed = True
            user.updated_at = datetime.now()
            
            # Session will allow changes to be committed by context manager
            
            return jsonify({
                'message': 'Profile updated successfully',
                'profile_completed': True,
                'user': {
                    'id': user.id,
                    'user_name': user.user_name,
                    'email': user.email,
                    'full_name': user.full_name,
                    'phone_number': user.phone_number,
                    'date_of_birth': user.date_of_birth.isoformat() if user.date_of_birth else None,
                    'gender': user.gender,
                    'address': user.address,
                    'city': user.city,
                    'country': user.country,
                    'avatar_url': user.avatar_url,
                    'bio': user.bio,
                    'profile_completed': user.profile_completed
                }
            }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to update profile: {str(e)}'}), 500


@user_profile_bp.route('/profile/status', methods=['GET'])
def get_profile_status():
    """
    Quick check if user has completed their profile
    ---
    tags:
      - User Profile
    responses:
      200:
        description: Profile completion status
    """
    user_id = get_user_id_from_token()
    
    if not user_id:
        return jsonify({'error': 'Missing or invalid authorization token'}), 401
    
    user = session.query(UserModel).filter_by(id=user_id).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'profile_completed': user.profile_completed or False,
        'user_id': user.id,
        'role': user.role
    }), 200
