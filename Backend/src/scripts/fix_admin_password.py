"""
Script to fix admin password - hash the plaintext password
Run this once to update admin password to proper hash format
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from infrastructure.databases.mssql import session
from infrastructure.models.user_model import UserModel
from services.auth_service import AuthService

def fix_admin_password():
    """Update admin password to hashed format"""
    admin = session.query(UserModel).filter_by(email='admin@aesp.com').first()
    
    if not admin:
        print("Admin user not found!")
        return False
    
    # Check if password is already hashed (hashed passwords are 64 chars for SHA-256)
    if len(admin.password) == 64:
        print("Admin password is already hashed.")
        return True
    
    # Hash the current plaintext password
    hashed_password = AuthService.hash_password(admin.password)  # hash 'admin123'
    admin.password = hashed_password
    
    try:
        session.commit()
        print(f"✅ Admin password updated successfully!")
        print(f"   Email: {admin.email}")
        print(f"   New hash: {hashed_password[:20]}...")
        return True
    except Exception as e:
        session.rollback()
        print(f"❌ Error updating password: {e}")
        return False

if __name__ == '__main__':
    fix_admin_password()
