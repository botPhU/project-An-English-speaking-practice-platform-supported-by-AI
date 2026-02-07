"""
Script to create test users in Railway MySQL database
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from config import Config
from werkzeug.security import generate_password_hash
from datetime import datetime

def create_test_users():
    engine = create_engine(Config.DATABASE_URI)
    
    users = [
        ('user1', 'user1@test.com', '123456', 'learner'),
        ('mentor1', 'mentor1@test.com', '123456', 'mentor'),
        ('admin1', 'admin1@test.com', '123456', 'admin'),
    ]
    
    with engine.connect() as conn:
        for user_name, email, password, role in users:
            # Check if user exists
            result = conn.execute(text(
                "SELECT id FROM flask_user WHERE user_name = :name"
            ), {"name": user_name})
            
            if result.fetchone():
                print(f"User '{user_name}' already exists, skipping...")
                continue
            
            # Create user
            password_hash = generate_password_hash(password)
            conn.execute(text("""
                INSERT INTO flask_user (user_name, email, password, role, status, created_at)
                VALUES (:user_name, :email, :password, :role, 1, :created_at)
            """), {
                "user_name": user_name,
                "email": email,
                "password": password_hash,
                "role": role,
                "created_at": datetime.now()
            })
            print(f"Created user: {user_name} / {password} (role: {role})")
        
        conn.commit()
    
    print("\nDone! Test users created.")

if __name__ == "__main__":
    create_test_users()
