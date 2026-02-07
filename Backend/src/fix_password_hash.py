"""Fix password hash for test users in Railway database"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from config import Config
import hashlib

# Hash function matching AuthService
def hash_password(password):
    salt = os.environ.get('SECRET_KEY', 'default_salt')
    salted = f'{password}{salt}'
    return hashlib.sha256(salted.encode()).hexdigest()

def fix_passwords():
    engine = create_engine(Config.DATABASE_URI)
    password_hash = hash_password('123456')
    
    with engine.connect() as conn:
        # Update users with correct hash
        result = conn.execute(text('''
            UPDATE flask_user SET password = :pwd WHERE user_name IN ('user1', 'mentor1', 'admin1')
        '''), {'pwd': password_hash})
        conn.commit()
        print(f'Updated {result.rowcount} users with correct password hash')
        print(f'Hash: {password_hash[:20]}...')

if __name__ == "__main__":
    fix_passwords()
