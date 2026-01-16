"""
AESP Database Initialization Script
Run this script to create all tables from SQLAlchemy models

Usage:
    python init_db.py
"""

import sys
import os

# Add the src directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from config import Config
from infrastructure.databases.base import Base

# Import ALL models to register them with Base
from infrastructure.models.user_model import UserModel
from infrastructure.models.package_model import PackageModel
from infrastructure.models.purchase_model import PurchaseModel
from infrastructure.models.progress_model import ProgressModel
from infrastructure.models.practice_session_model import PracticeSessionModel
from infrastructure.models.assessment_model import AssessmentModel
from infrastructure.models.course_model import CourseModel
from infrastructure.models.course_register_model import CourseRegisterModel
from infrastructure.models.feedback_model import FeedbackModel
from infrastructure.models.appointment_model import AppointmentModel
from infrastructure.models.consultant_model import ConsultantModel
from infrastructure.models.program_model import ProgramModel
from infrastructure.models.survey_model import SurveyModel
from infrastructure.models.todo_model import TodoModel

# Additional models
from infrastructure.models.admin_models import *
from infrastructure.models.challenge_models import *
from infrastructure.models.community_models import *
from infrastructure.models.learner_profile_model import *
from infrastructure.models.learning_models import *
from infrastructure.models.mentor_assignment_model import *
from infrastructure.models.mentor_booking_model import *
from infrastructure.models.mentor_content_models import *
from infrastructure.models.mentor_feedback_model import *
from infrastructure.models.message_model import *
from infrastructure.models.notification_model import *
from infrastructure.models.resource_model import *
from infrastructure.models.subscription_models import *

def init_database():
    """Create all tables in the database"""
    print("=" * 50)
    print("AESP Database Initialization")
    print("=" * 50)
    
    try:
        # Create engine
        DATABASE_URI = Config.DATABASE_URI
        print(f"\nConnecting to: {DATABASE_URI.split('@')[1] if '@' in DATABASE_URI else DATABASE_URI}")
        
        engine = create_engine(DATABASE_URI)
        
        # Test connection
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✓ Database connection successful!")
        
        # Create all tables
        print("\nCreating tables...")
        Base.metadata.create_all(bind=engine)
        
        # List created tables
        print("\n✓ Tables created successfully!")
        print("\nRegistered models:")
        for table_name in Base.metadata.tables.keys():
            print(f"  - {table_name}")
        
        print("\n" + "=" * 50)
        print("Database initialization completed!")
        print("=" * 50)
        
        return True
        
    except Exception as e:
        print(f"\n✗ Error: {e}")
        print("\nMake sure:")
        print("  1. Database server is running")
        print("  2. Connection string in .env is correct")
        return False



# Validating database connection...


def insert_sample_data():
    """Insert sample data for testing"""
    from datetime import datetime
    from sqlalchemy.orm import sessionmaker
    
    engine = create_engine(Config.DATABASE_URI)
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        # Check if packages already exist
        existing = session.query(PackageModel).first()
        if existing:
            print("Sample data already exists. Skipping...")
            return
        
        # Insert packages
        packages = [
            PackageModel(
                name="Basic",
                description="Gói cơ bản cho người mới bắt đầu",
                price=99000,
                duration_days=30,
                has_mentor=False,
                has_ai_advanced=False,
                max_sessions_per_month=5,
                features='["AI Practice (5 sessions)", "Progress Tracking", "Community Access"]',
                is_active=True,
                created_at=datetime.now(),
                updated_at=datetime.now()
            ),
            PackageModel(
                name="Premium",
                description="Gói phổ biến với mentor hỗ trợ",
                price=299000,
                duration_days=30,
                has_mentor=True,
                has_ai_advanced=False,
                max_sessions_per_month=15,
                features='["AI Practice (Unlimited)", "2 Mentor Sessions", "All Topics", "Pronunciation Analysis"]',
                is_active=True,
                created_at=datetime.now(),
                updated_at=datetime.now()
            ),
            PackageModel(
                name="Pro",
                description="Gói chuyên nghiệp với đầy đủ tính năng",
                price=499000,
                duration_days=30,
                has_mentor=True,
                has_ai_advanced=True,
                max_sessions_per_month=999,
                features='["Everything in Premium", "5 Mentor Sessions", "Advanced AI", "Custom Path"]',
                is_active=True,
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
        ]
        
        for pkg in packages:
            session.add(pkg)
        
        session.commit()
        print("✓ Sample data inserted successfully!")
        
    except Exception as e:
        session.rollback()
        print(f"Error inserting sample data: {e}")
    finally:
        session.close()


if __name__ == "__main__":
    print("\nStep 1: Check Database & Create Tables")
    if init_database():
        print("\nStep 2: Insert Sample Data")
        insert_sample_data()
