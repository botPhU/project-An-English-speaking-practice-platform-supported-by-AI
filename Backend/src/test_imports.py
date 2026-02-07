import sys
import os
sys.path.append(os.getcwd())

print("Testing imports...")
try:
    from infrastructure.models.community_models import PeerInvitationModel, PeerSessionModel, QuickMatchModel
    from infrastructure.models.review_model import ReviewModel
    print("Successfully imported community_models")
    from infrastructure.models.review_model import ReviewModel as ReviewModelNew
    print("Successfully imported review_model")
    print("Starting app component imports...")
    from api.controllers.todo_controller import bp as todo_bp
    print("todo_bp imported")
    from infrastructure.databases import init_db
    print("init_db imported")
    from api.websocket import socketio, init_socketio
    print("socketio imported")
    from api.controllers.admin_controller import bp as admin_bp
    print("admin_bp imported")
    from api.controllers.community_controller import community_bp
    print("community_bp imported")
    from api.controllers.mentor_controller import mentor_bp
    print("mentor_bp imported")
    from api.controllers.feedback_controller import feedback_bp
    print("feedback_bp imported")
    from api.controllers.video_controller import video_bp
    print("video_bp imported")
    from api.controllers.study_buddy_controller import study_buddy_bp
    print("study_buddy_bp imported")
    from api.controllers.note_controller import bp as note_bp
    print("note_bp imported")
    from app import create_app
    print("create_app module imported")
    app = create_app()
    print("Successfully created app instance")
except Exception as e:
    import traceback
    traceback.print_exc()
    sys.exit(1)
print("All imports successful!")
