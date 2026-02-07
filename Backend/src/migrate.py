"""
Database Migration Script
Creates all tables for the AESP Platform
Run this script to initialize or update the database schema
"""
from infrastructure.databases.mssql import engine, Base

# Import all models so they are registered with SQLAlchemy
from infrastructure.models.user_model import UserModel
from infrastructure.models.progress_model import ProgressModel
from infrastructure.models.practice_session_model import PracticeSessionModel
from infrastructure.models.assessment_model import AssessmentModel
from infrastructure.models.learner_profile_model import LearnerProfileModel
from infrastructure.models.learning_models import TopicModel, AchievementModel, UserAchievementModel, MentorBookingModel
from infrastructure.models.community_models import PeerInvitationModel, PeerSessionModel, ReviewModel, QuickMatchModel
from infrastructure.models.challenge_models import ChallengeModel, UserChallengeModel, LeaderboardEntryModel, RewardModel, UserRewardModel
from infrastructure.models.subscription_models import SubscriptionPlanModel, UserSubscriptionModel, PaymentHistoryModel
from infrastructure.models.mentor_content_models import (
    ConfidenceTechniqueModel, ExpressionTipModel, GrammarErrorModel,
    PronunciationErrorModel, VocabularyItemModel, IdiomModel,
    ConversationScenarioModel, RealLifeSituationModel, LearnerActivityAssignmentModel
)
from infrastructure.models.admin_models import (
    SupportTicketModel, TicketMessageModel, ActivityLogModel,
    SystemSettingModel, MentorApplicationModel
)
# NEW: Import booking and messaging models
from infrastructure.models.mentor_booking_model import MentorBookingModel as NewMentorBookingModel
from infrastructure.models.message_model import MessageModel

def create_all_tables():
    """Create all tables in the database"""
    print("Creating all database tables...")
    Base.metadata.create_all(engine)
    print("All tables created successfully!")


def drop_all_tables():
    """Drop all tables - USE WITH CAUTION"""
    print("WARNING: Dropping all tables...")
    Base.metadata.drop_all(engine)
    print("All tables dropped!")


if __name__ == '__main__':
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == '--drop':
        confirmation = input("Are you sure you want to DROP all tables? (yes/no): ")
        if confirmation.lower() == 'yes':
            drop_all_tables()
    else:
        create_all_tables()
