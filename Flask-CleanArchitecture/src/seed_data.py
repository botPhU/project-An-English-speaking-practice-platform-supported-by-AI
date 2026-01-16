"""
Data Seeding Script
Run this script to populate the database with initial data.
It handles:
1. Users (Admin, Mentor, Learner)
2. Packages
3. Content (Idioms, etc.)
"""
import sys
import os
from datetime import datetime
from werkzeug.security import generate_password_hash

# Add the src directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config import Config

# Import Models
from infrastructure.models.user_model import UserModel
from infrastructure.models.package_model import PackageModel
from infrastructure.models.mentor_content_models import IdiomModel

def seed_data():
    print("=" * 50)
    print("Seeding Database...")
    print("=" * 50)

    # 1. Setup Connection
    # Determine which URI to use (retry with diff drivers if needed, but Config should be correct)
    uri = Config.DATABASE_URI
    if 'mysql' in uri and '+pymysql' not in uri:
         # Force pymysql if not specified but using mysql
         uri = uri.replace('mysql://', 'mysql+pymysql://')
    
    engine = create_engine(uri)
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        # ---------------------------------------------------------
        # 2. Seed Users
        # ---------------------------------------------------------
        print("\n--> Seeding Users...")
        users = [
            {
                'user_name': 'admin',
                'email': 'admin@aesp.com',
                'password': 'password123',
                'role': 'admin',
                'full_name': 'System Administrator'
            },
            {
                'user_name': 'learner_bob',
                'email': 'bob@aesp.com',
                'password': 'password123',
                'role': 'learner',
                'full_name': 'Bob Learner'
            },
            # --- MENTORS ---
            {
                'user_name': 'mentor_sarah',
                'email': 'sarah@aesp.com',
                'password': 'password123',
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
                'password': 'password123',
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
                'password': 'password123',
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
                'password': 'password123',
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
                'password': 'password123',
                'role': 'mentor',
                'full_name': 'Jessica Lee',
                'specialty': 'Academic Writing',
                'bio': 'PhD student with expertise in academic writing and research paper publication.',
                'average_rating': 4.6,
                'review_count': 60,
                'avatar_url': 'https://i.pravatar.cc/150?u=jessica'
            }
        ]

        for u in users:
            existing = session.query(UserModel).filter_by(user_name=u['user_name']).first()
            if not existing:
                new_user = UserModel(
                    user_name=u['user_name'],
                    email=u['email'],
                    password=generate_password_hash(u['password']), # Hash password!
                    role=u['role'],
                    full_name=u['full_name'],
                    status=True,
                    created_at=datetime.now(),
                    # Mentor fields (will be None for non-mentors if using get or ignore)
                    specialty=u.get('specialty'),
                    bio=u.get('bio'),
                    average_rating=u.get('average_rating', 5.0) if u['role'] == 'mentor' else None,
                    review_count=u.get('review_count', 0) if u['role'] == 'mentor' else None,
                    avatar_url=u.get('avatar_url')
                )
                session.add(new_user)
                print(f"   + Created user: {u['user_name']}")
            else:
                print(f"   . User {u['user_name']} already exists.")

        # ---------------------------------------------------------
        # 3. Seed Packages
        # ---------------------------------------------------------
        print("\n--> Seeding Packages...")
        packages = [
            PackageModel(
                name="Basic",
                description="Gói cơ bản cho người mới bắt đầu",
                price=99000,
                duration_days=30,
                has_mentor=False,
                max_sessions_per_month=5,
                features='["AI Practice (5 sessions)", "Progress Tracking", "Community Access"]',
                is_active=True,
                created_at=datetime.now()
            ),
            PackageModel(
                name="Premium",
                description="Gói phổ biến với mentor hỗ trợ",
                price=299000,
                duration_days=30,
                has_mentor=True,
                max_sessions_per_month=15,
                features='["AI Practice (Unlimited)", "2 Mentor Sessions", "All Topics", "Pronunciation Analysis"]',
                is_active=True,
                created_at=datetime.now()
            ),
            # Add more packages here if needed
        ]
        
        for pkg in packages:
            existing = session.query(PackageModel).filter_by(name=pkg.name).first()
            if not existing:
                session.add(pkg)
                print(f"   + Created package: {pkg.name}")
            else:
                print(f"   . Package {pkg.name} already exists.")

        # ---------------------------------------------------------
        # 4. Seed Idioms (Requested Feature)
        # ---------------------------------------------------------
        print("\n--> Seeding Idioms...")
        idioms = [
            {
                'phrase': 'Break a leg',
                'meaning_vi': 'Chúc may mắn (thường dùng trước khi biểu diễn)',
                'meaning_en': 'Good luck',
                'example': 'You have an exam tomorrow? Break a leg!',
                'category': 'Daily Life',
                'difficulty': 'Easy'
            },
            {
                'phrase': 'Piece of cake',
                'meaning_vi': 'Dễ như ăn kẹo',
                'meaning_en': 'Something very easy to do',
                'example': 'That math problem was a piece of cake.',
                'category': 'Daily Life',
                'difficulty': 'Easy'
            },
            {
                'phrase': 'Hit the books',
                'meaning_vi': 'Học bài chăm chỉ',
                'meaning_en': 'To study hard',
                'example': 'I have a big test next week, so I need to hit the books.',
                'category': 'Education',
                'difficulty': 'Medium'
            }
        ]

        for item in idioms:
            existing = session.query(IdiomModel).filter_by(phrase=item['phrase']).first()
            if not existing:
                new_idiom = IdiomModel(
                    phrase=item['phrase'],
                    meaning_vi=item['meaning_vi'],
                    meaning_en=item['meaning_en'],
                    example=item['example'],
                    category=item['category'],
                    difficulty=item['difficulty'],
                    is_active=True,
                    created_at=datetime.now()
                )
                session.add(new_idiom)
                print(f"   + Created idiom: {item['phrase']}")
            else:
                print(f"   . Idiom '{item['phrase']}' already exists.")

        # ---------------------------------------------------------
        # Commit Changes
        # ---------------------------------------------------------
        session.commit()
        print("\n✓ Seeding completed successfully!")

    except Exception as e:
        session.rollback()
        print(f"\n✗ Error during seeding: {e}")
    finally:
        session.close()

if __name__ == "__main__":
    seed_data()
