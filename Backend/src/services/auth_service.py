"""
Authentication Service for AESP Platform
Handles JWT tokens, password hashing, and user authentication
"""

from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import hashlib
import secrets
import os


class AuthService:
    """Authentication and authorization service"""
    
    # Token expiry settings
    ACCESS_TOKEN_EXPIRE_HOURS = 24
    REFRESH_TOKEN_EXPIRE_DAYS = 7
    
    # Simple token storage (in production, use Redis or database)
    _tokens: Dict[str, Dict] = {}
    _blacklisted_tokens: set = set()
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash password using SHA-256 with salt"""
        salt = os.environ.get('SECRET_KEY', 'default_salt')
        salted = f"{password}{salt}"
        return hashlib.sha256(salted.encode()).hexdigest()
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash"""
        return AuthService.hash_password(plain_password) == hashed_password
    
    @staticmethod
    def generate_token() -> str:
        """Generate a secure random token"""
        return secrets.token_urlsafe(32)
    
    @classmethod
    def create_access_token(cls, user_id: int, role: str) -> Dict[str, Any]:
        """
        Create access and refresh tokens for a user
        
        Args:
            user_id: The user's ID
            role: The user's role (admin, mentor, learner)
            
        Returns:
            Dict containing access_token, refresh_token, and expiry info
        """
        access_token = cls.generate_token()
        refresh_token = cls.generate_token()
        
        now = datetime.now()
        access_expires = now + timedelta(hours=cls.ACCESS_TOKEN_EXPIRE_HOURS)
        refresh_expires = now + timedelta(days=cls.REFRESH_TOKEN_EXPIRE_DAYS)
        
        # Store token info
        cls._tokens[access_token] = {
            'user_id': user_id,
            'role': role,
            'type': 'access',
            'expires_at': access_expires,
            'created_at': now
        }
        
        cls._tokens[refresh_token] = {
            'user_id': user_id,
            'role': role,
            'type': 'refresh',
            'expires_at': refresh_expires,
            'created_at': now
        }
        
        return {
            'access_token': access_token,
            'refresh_token': refresh_token,
            'token_type': 'Bearer',
            'expires_in': cls.ACCESS_TOKEN_EXPIRE_HOURS * 3600,
            'expires_at': access_expires.isoformat()
        }
    
    @classmethod
    def validate_token(cls, token: str) -> Optional[Dict[str, Any]]:
        """
        Validate an access token
        
        Args:
            token: The token to validate
            
        Returns:
            Token payload if valid, None otherwise
        """
        if token in cls._blacklisted_tokens:
            return None
        
        token_data = cls._tokens.get(token)
        if not token_data:
            return None
        
        if datetime.now() > token_data['expires_at']:
            del cls._tokens[token]
            return None
        
        return token_data
    
    @classmethod
    def refresh_access_token(cls, refresh_token: str) -> Optional[Dict[str, Any]]:
        """
        Generate new access token using refresh token
        
        Args:
            refresh_token: The refresh token
            
        Returns:
            New token info if valid, None otherwise
        """
        token_data = cls.validate_token(refresh_token)
        
        if not token_data or token_data.get('type') != 'refresh':
            return None
        
        # Create new access token
        return cls.create_access_token(
            token_data['user_id'],
            token_data['role']
        )
    
    @classmethod
    def revoke_token(cls, token: str) -> bool:
        """
        Revoke/blacklist a token (logout)
        
        Args:
            token: The token to revoke
            
        Returns:
            True if revoked successfully
        """
        cls._blacklisted_tokens.add(token)
        if token in cls._tokens:
            del cls._tokens[token]
        return True
    
    @classmethod
    def get_current_user(cls, token: str) -> Optional[Dict[str, Any]]:
        """
        Get current user info from token
        
        Args:
            token: The access token
            
        Returns:
            User info dict or None
        """
        token_data = cls.validate_token(token)
        if not token_data:
            return None
        
        return {
            'user_id': token_data['user_id'],
            'role': token_data['role']
        }
    
    @staticmethod
    def check_role(required_role: str, user_role: str) -> bool:
        """
        Check if user has required role
        
        Args:
            required_role: The required role
            user_role: The user's actual role
            
        Returns:
            True if authorized
        """
        role_hierarchy = {
            'admin': 3,
            'mentor': 2,
            'learner': 1
        }
        
        return role_hierarchy.get(user_role, 0) >= role_hierarchy.get(required_role, 0)


# Helper decorator for route protection
def require_auth(required_role: str = None):
    """
    Decorator to require authentication on routes
    
    Usage:
        @require_auth('admin')
        def admin_only_route():
            pass
    """
    def decorator(f):
        def wrapper(*args, **kwargs):
            from flask import request, jsonify
            
            auth_header = request.headers.get('Authorization', '')
            
            if not auth_header.startswith('Bearer '):
                return jsonify({'error': 'Missing or invalid authorization header'}), 401
            
            token = auth_header.replace('Bearer ', '')
            user_data = AuthService.get_current_user(token)
            
            if not user_data:
                return jsonify({'error': 'Invalid or expired token'}), 401
            
            if required_role and not AuthService.check_role(required_role, user_data['role']):
                return jsonify({'error': 'Insufficient permissions'}), 403
            
            # Add user data to kwargs
            kwargs['current_user'] = user_data
            return f(*args, **kwargs)
        
        wrapper.__name__ = f.__name__
        return wrapper
    return decorator
