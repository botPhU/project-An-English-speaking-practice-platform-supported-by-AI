
import sys
import os

# Add the src directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine
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

from seed_data import seed_data

def reset_and_seed():
    print("=" * 50)
    print("RESETTING AND SEEDING DATABASE")
    print("=" * 50)

    try:
        DATABASE_URI = Config.DATABASE_URI
        if 'mysql' in DATABASE_URI and '+pymysql' not in DATABASE_URI:
             DATABASE_URI = DATABASE_URI.replace('mysql://', 'mysql+pymysql://')
        
        engine = create_engine(DATABASE_URI)
        
        print("Dropping all tables...")
        Base.metadata.drop_all(bind=engine)
        print("✓ Dropped.")

        print("Creating all tables...")
        Base.metadata.create_all(bind=engine)
        print("✓ Created.")

        print("Seeding data...")
        seed_data()
        print("✓ Seeded.")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    reset_and_seed()
