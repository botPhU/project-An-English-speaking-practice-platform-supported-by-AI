"""
AESP API Routes Registration
Registers all API blueprints with the Flask application
"""

# Existing controllers
from api.controllers.todo_controller import bp as todo_bp
from api.controllers.admin_controller import bp as admin_bp
from api.controllers.user_management_controller import bp as user_management_bp
from api.controllers.package_management_controller import bp as package_management_bp
from api.controllers.learner_controller import learner_bp
from api.controllers.mentor_controller import mentor_bp
from api.controllers.purchase_controller import purchase_bp

# New controllers
from api.controllers.auth_controller import auth_bp
from api.controllers.notification_controller import notification_bp
from api.controllers.resource_controller import resource_bp
from api.controllers.report_controller import report_bp
from api.controllers.topic_controller import topic_bp
from api.controllers.policy_controller import policy_bp
from api.controllers.user_profile_controller import user_profile_bp
from api.controllers.practice_controller import practice_bp
from api.controllers.message_controller import message_bp
from api.controllers.assignment_controller import assignment_bp
from api.controllers.feedback_controller import feedback_bp
from api.controllers.video_controller import video_bp


def register_routes(app):
    """Register all API blueprints"""
    
    # Core APIs
    app.register_blueprint(todo_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(user_management_bp)
    app.register_blueprint(package_management_bp)
    
    # Role-based APIs
    app.register_blueprint(learner_bp)
    app.register_blueprint(mentor_bp)
    app.register_blueprint(purchase_bp)
    
    # New APIs
    app.register_blueprint(auth_bp)          # /api/auth/*
    app.register_blueprint(notification_bp)  # /api/notifications/*
    app.register_blueprint(resource_bp)      # /api/resources/*
    app.register_blueprint(report_bp)        # /api/reports/*
    app.register_blueprint(topic_bp)         # /api/topics/*
    app.register_blueprint(policy_bp)        # /api/policies/*
    app.register_blueprint(user_profile_bp)  # /api/user/profile
    app.register_blueprint(practice_bp)      # /api/practice/*
    app.register_blueprint(message_bp)       # /api/messages/*
    app.register_blueprint(assignment_bp)    # /api/assignments/*
    app.register_blueprint(feedback_bp)      # /api/feedback/*
    app.register_blueprint(video_bp)         # /api/video/*