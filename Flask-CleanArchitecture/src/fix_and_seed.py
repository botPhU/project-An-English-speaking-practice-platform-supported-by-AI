"""
Fix database schema and seed mentors
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from config import Config
from werkzeug.security import generate_password_hash
from datetime import datetime

def fix_and_seed():
    print("=" * 50)
    print("FIXING DATABASE AND SEEDING MENTORS")
    print("=" * 50)

    DATABASE_URI = Config.DATABASE_URI
    if 'mysql' in DATABASE_URI and '+pymysql' not in DATABASE_URI:
        DATABASE_URI = DATABASE_URI.replace('mysql://', 'mysql+pymysql://')
    
    engine = create_engine(DATABASE_URI)
    
    with engine.connect() as conn:
        # 1. Add missing columns
        print("\n1. Adding missing columns...")
        alter_statements = [
            "ALTER TABLE flask_user ADD COLUMN IF NOT EXISTS specialty VARCHAR(100)",
            "ALTER TABLE flask_user ADD COLUMN IF NOT EXISTS average_rating FLOAT DEFAULT 5.0",
            "ALTER TABLE flask_user ADD COLUMN IF NOT EXISTS review_count INT DEFAULT 0",
            "ALTER TABLE flask_user ADD COLUMN IF NOT EXISTS hourly_rate INT DEFAULT 100000"
        ]
        
        for stmt in alter_statements:
            try:
                conn.execute(text(stmt))
                print(f"   OK: {stmt[:50]}...")
            except Exception as e:
                # Column might already exist or syntax issue with IF NOT EXISTS
                # Try without IF NOT EXISTS
                try:
                    simple_stmt = stmt.replace(" IF NOT EXISTS", "")
                    conn.execute(text(simple_stmt))
                    print(f"   OK (simple): {simple_stmt[:50]}...")
                except Exception as e2:
                    if "Duplicate column" in str(e2):
                        print(f"   SKIP (exists): {stmt[:50]}...")
                    else:
                        print(f"   ERROR: {e2}")
        
        conn.commit()
        
        # 2. Insert/Update mentors
        print("\n2. Seeding mentors...")
        mentors = [
            {
                'user_name': 'mentor_sarah',
                'email': 'sarah@aesp.com',
                'password': generate_password_hash('password123'),
                'role': 'mentor',
                'full_name': 'Sarah Johnson',
                'specialty': 'IELTS & TOEIC Preparation',
                'bio': 'Certified IELTS examiner with 10 years of experience. I help students achieve band 7.0+.',
                'average_rating': 4.9,
                'review_count': 120,
                'avatar_url': 'https://i.pravatar.cc/150?u=sarah'
            },
            {
                'user_name': 'mentor_david',
                'email': 'david@aesp.com',
                'password': generate_password_hash('password123'),
                'role': 'mentor',
                'full_name': 'David Chen',
                'specialty': 'Business English & Communication',
                'bio': 'Former business executive turned English coach. Specialist in negotiation and presentation skills.',
                'average_rating': 4.8,
                'review_count': 85,
                'avatar_url': 'https://i.pravatar.cc/150?u=david'
            },
            {
                'user_name': 'mentor_emily',
                'email': 'emily@aesp.com',
                'password': generate_password_hash('password123'),
                'role': 'mentor',
                'full_name': 'Emily Watson',
                'specialty': 'General English for Beginners',
                'bio': 'Patient and friendly tutor for beginners. I focus on building confidence and basic grammar.',
                'average_rating': 5.0,
                'review_count': 45,
                'avatar_url': 'https://i.pravatar.cc/150?u=emily'
            },
            {
                'user_name': 'mentor_michael',
                'email': 'michael@aesp.com',
                'password': generate_password_hash('password123'),
                'role': 'mentor',
                'full_name': 'Michael Brown',
                'specialty': 'Pronunciation & Accent Training',
                'bio': 'Linguistics expert specializing in American accent training and phonetics.',
                'average_rating': 4.7,
                'review_count': 200,
                'avatar_url': 'https://i.pravatar.cc/150?u=michael'
            },
            {
                'user_name': 'mentor_jessica',
                'email': 'jessica@aesp.com',
                'password': generate_password_hash('password123'),
                'role': 'mentor',
                'full_name': 'Jessica Lee',
                'specialty': 'Academic Writing',
                'bio': 'PhD student with expertise in academic writing and research paper publication.',
                'average_rating': 4.6,
                'review_count': 60,
                'avatar_url': 'https://i.pravatar.cc/150?u=jessica'
            }
        ]
        
        for m in mentors:
            # Check if exists
            existing = conn.execute(text(f"SELECT id FROM flask_user WHERE user_name = :uname"), {'uname': m['user_name']}).fetchone()
            
            if existing:
                # Update existing
                conn.execute(text("""
                    UPDATE flask_user SET 
                        full_name = :full_name,
                        specialty = :specialty,
                        bio = :bio,
                        average_rating = :average_rating,
                        review_count = :review_count,
                        avatar_url = :avatar_url
                    WHERE user_name = :user_name
                """), m)
                print(f"   UPDATED: {m['full_name']}")
            else:
                # Insert new
                conn.execute(text("""
                    INSERT INTO flask_user (user_name, email, password, role, full_name, status, specialty, bio, average_rating, review_count, avatar_url, created_at)
                    VALUES (:user_name, :email, :password, :role, :full_name, 1, :specialty, :bio, :average_rating, :review_count, :avatar_url, NOW())
                """), m)
                print(f"   INSERTED: {m['full_name']}")
        
        conn.commit()
        
        # 3. Verify
        print("\n3. Verifying...")
        mentors = conn.execute(text("SELECT id, user_name, full_name, specialty, average_rating FROM flask_user WHERE role='mentor'"))
        for m in mentors:
            print(f"   {m}")
        
        print("\n✓ Done!")

if __name__ == "__main__":
    fix_and_seed()
