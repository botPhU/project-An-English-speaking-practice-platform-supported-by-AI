"""
Authentication Controller for AESP Platform
Handles user registration, login, logout, and token refresh
"""

from flask import Blueprint, request, jsonify
from flask_restx import Namespace, Resource, fields
from datetime import datetime

from services.auth_service import AuthService
from services.user_service import UserService
from infrastructure.models.user_model import UserModel
from infrastructure.databases.mssql import session

# Import WebSocket helpers for real-time status updates
from api.websocket import notify_user_login, notify_user_logout


auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')
auth_ns = Namespace('auth', description='Authentication operations')

# Request/Response models for Swagger
login_model = auth_ns.model('Login', {
    'user_name': fields.String(required=True, description='Username'),
    'password': fields.String(required=True, description='Password')
})

register_model = auth_ns.model('Register', {
    'user_name': fields.String(required=True, description='Username'),
    'email': fields.String(required=True, description='Email'),
    'password': fields.String(required=True, description='Password'),
    'full_name': fields.String(description='Full name'),
    'role': fields.String(description='Role: learner, mentor, admin', default='learner')
})

token_response = auth_ns.model('TokenResponse', {
    'access_token': fields.String(description='Access token'),
    'refresh_token': fields.String(description='Refresh token'),
    'token_type': fields.String(description='Token type'),
    'expires_in': fields.Integer(description='Expires in seconds'),
    'user': fields.Raw(description='User info')
})


@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Register a new user
    ---
    tags:
      - Authentication
    parameters:
      - in: body
        name: body
        schema:
          type: object
          required:
            - user_name
            - email
            - password
          properties:
            user_name:
              type: string
            email:
              type: string
            password:
              type: string
            full_name:
              type: string
            role:
              type: string
              default: learner
    responses:
      201:
        description: User created successfully
      400:
        description: Validation error
      409:
        description: User already exists
    """
    data = request.get_json()
    
    # Validate required fields
    if not data.get('user_name') or not data.get('password'):
        return jsonify({'error': 'Username and password are required'}), 400
    
    # Check if user exists
    existing_user = session.query(UserModel).filter(
        (UserModel.user_name == data['user_name']) |
        (UserModel.email == data.get('email'))
    ).first()
    
    if existing_user:
        return jsonify({'error': 'Username or email already exists'}), 409
    
    # Create new user
    try:
        hashed_password = AuthService.hash_password(data['password'])
        
        new_user = UserModel(
            user_name=data['user_name'],
            email=data.get('email'),
            password=hashed_password,
            full_name=data.get('full_name', ''),
            role=data.get('role', 'learner'),
            status=True,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        session.add(new_user)
        session.commit()
        
        # Generate tokens
        tokens = AuthService.create_access_token(new_user.id, new_user.role)
        
        return jsonify({
            'message': 'User registered successfully',
            'user': {
                'id': new_user.id,
                'user_name': new_user.user_name,
                'email': new_user.email,
                'role': new_user.role
            },
            **tokens
        }), 201
        
    except Exception as e:
        session.rollback()
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Login user and get tokens
    ---
    tags:
      - Authentication
    parameters:
      - in: body
        name: body
        schema:
          type: object
          required:
            - user_name
            - password
          properties:
            user_name:
              type: string
            password:
              type: string
    responses:
      200:
        description: Login successful
      401:
        description: Invalid credentials
    """
    data = request.get_json()
    
    if not data.get('user_name') or not data.get('password'):
        return jsonify({'error': 'Username and password are required'}), 400
    
    # Find user
    user = session.query(UserModel).filter_by(user_name=data['user_name']).first()
    
    if not user:
        return jsonify({'error': 'Invalid username or password'}), 401
    
    # Verify password
    if not AuthService.verify_password(data['password'], user.password):
        return jsonify({'error': 'Invalid username or password'}), 401
    
    # Check if user is active
    if not user.status:
        return jsonify({'error': 'Account is disabled'}), 403
    
    # Update last login
    try:
        user.last_login = datetime.now()
        session.commit()
    except:
        pass
    
    # Generate tokens
    tokens = AuthService.create_access_token(user.id, user.role or 'learner')
    
    # Broadcast user online status via WebSocket
    try:
        notify_user_login(user.id)
    except Exception as e:
        # Don't fail login if websocket broadcast fails
        print(f"WebSocket broadcast failed: {e}")
    
    return jsonify({
        'message': 'Login successful',
        'user': {
            'id': user.id,
            'user_name': user.user_name,
            'email': user.email,
            'full_name': user.full_name,
            'role': user.role or 'learner'
        },
        **tokens
    }), 200


@auth_bp.route('/logout', methods=['POST'])
def logout():
    """
    Logout user and revoke token
    ---
    tags:
      - Authentication
    parameters:
      - in: header
        name: Authorization
        type: string
        required: true
        description: Bearer token
    responses:
      200:
        description: Logout successful
      401:
        description: Invalid token
    """
    auth_header = request.headers.get('Authorization', '')
    
    if not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Missing authorization header'}), 401
    
    token = auth_header.replace('Bearer ', '')
    
    # Get user info before revoking token for WebSocket broadcast
    user_data = AuthService.get_current_user(token)
    
    AuthService.revoke_token(token)
    
    # Broadcast user offline status via WebSocket
    if user_data and user_data.get('user_id'):
        try:
            notify_user_logout(user_data['user_id'])
        except Exception as e:
            print(f"WebSocket broadcast failed: {e}")
    
    return jsonify({'message': 'Logout successful'}), 200


@auth_bp.route('/refresh', methods=['POST'])
def refresh_token():
    """
    Refresh access token using refresh token
    ---
    tags:
      - Authentication
    parameters:
      - in: body
        name: body
        schema:
          type: object
          required:
            - refresh_token
          properties:
            refresh_token:
              type: string
    responses:
      200:
        description: New tokens generated
      401:
        description: Invalid refresh token
    """
    data = request.get_json()
    refresh_token = data.get('refresh_token')
    
    if not refresh_token:
        return jsonify({'error': 'Refresh token is required'}), 400
    
    new_tokens = AuthService.refresh_access_token(refresh_token)
    
    if not new_tokens:
        return jsonify({'error': 'Invalid or expired refresh token'}), 401
    
    return jsonify(new_tokens), 200


@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    """
    Get current user info from token
    ---
    tags:
      - Authentication
    parameters:
      - in: header
        name: Authorization
        type: string
        required: true
    responses:
      200:
        description: User info
      401:
        description: Invalid token
    """
    auth_header = request.headers.get('Authorization', '')
    
    if not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Missing authorization header'}), 401
    
    token = auth_header.replace('Bearer ', '')
    user_data = AuthService.get_current_user(token)
    
    if not user_data:
        return jsonify({'error': 'Invalid or expired token'}), 401
    
    # Get full user info
    user = session.query(UserModel).filter_by(id=user_data['user_id']).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'id': user.id,
        'user_name': user.user_name,
        'email': user.email,
        'full_name': user.full_name,
        'role': user.role,
        'status': user.status,
        'created_at': user.created_at.isoformat() if user.created_at else None
    }), 200


@auth_bp.route('/change-password', methods=['POST'])
def change_password():
    """
    Change user password
    ---
    tags:
      - Authentication
    parameters:
      - in: header
        name: Authorization
        type: string
        required: true
      - in: body
        name: body
        schema:
          type: object
          required:
            - old_password
            - new_password
          properties:
            old_password:
              type: string
            new_password:
              type: string
    responses:
      200:
        description: Password changed
      400:
        description: Validation error
      401:
        description: Invalid credentials
    """
    auth_header = request.headers.get('Authorization', '')
    
    if not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Missing authorization header'}), 401
    
    token = auth_header.replace('Bearer ', '')
    user_data = AuthService.get_current_user(token)
    
    if not user_data:
        return jsonify({'error': 'Invalid or expired token'}), 401
    
    data = request.get_json()
    
    if not data.get('old_password') or not data.get('new_password'):
        return jsonify({'error': 'Old and new passwords are required'}), 400
    
    # Get user
    user = session.query(UserModel).filter_by(id=user_data['user_id']).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Verify old password
    if not AuthService.verify_password(data['old_password'], user.password):
        return jsonify({'error': 'Current password is incorrect'}), 401
    
    # Update password
    try:
        user.password = AuthService.hash_password(data['new_password'])
        user.updated_at = datetime.now()
        session.commit()
        
        return jsonify({'message': 'Password changed successfully'}), 200
        
    except Exception as e:
        session.rollback()
        return jsonify({'error': str(e)}), 500