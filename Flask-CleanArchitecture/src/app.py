from flask import Flask, jsonify
from flask_cors import CORS
from api.swagger import spec
from api.controllers.todo_controller import bp as todo_bp
from api.middleware import middleware
from api.responses import success_response
from infrastructure.databases import init_db
from config import Config
from flasgger import Swagger
from config import SwaggerConfig
from flask_swagger_ui import get_swaggerui_blueprint
from app_logging import setup_logging

# Initialize logging
setup_logging()

# Import WebSocket module
from api.websocket import socketio, init_socketio

# Import all controllers
from api.controllers.admin_controller import bp as admin_bp
from api.controllers.user_management_controller import bp as user_management_bp
from api.controllers.package_management_controller import bp as package_management_bp
from api.controllers.learner_controller import learner_bp
from api.controllers.mentor_controller import mentor_bp
from api.controllers.purchase_controller import purchase_bp
from api.controllers.auth_controller import auth_bp
from api.controllers.notification_controller import notification_bp
from api.controllers.resource_controller import resource_bp
from api.controllers.report_controller import report_bp
from api.controllers.topic_controller import topic_bp
from api.controllers.policy_controller import policy_bp
from api.controllers.mentor_content_controller import mentor_content_bp
from api.controllers.community_controller import community_bp
from api.controllers.challenge_controller import challenge_bp
from api.controllers.subscription_controller import subscription_bp
from api.controllers.user_profile_controller import user_profile_bp
from api.controllers.practice_controller import practice_bp
from api.controllers.message_controller import message_bp
from api.controllers.assignment_controller import assignment_bp
from api.controllers.feedback_controller import feedback_bp
from api.controllers.video_controller import video_bp
from api.controllers.study_buddy_controller import study_buddy_bp
from api.controllers.note_controller import bp as note_bp


def create_app():
    app = Flask(__name__)
    
    # Load configuration from Config class
    app.config.from_object(Config)
    
    # Enable CORS for frontend - Allow all in development for tunnel flexibility
    CORS(app, supports_credentials=True, origins="*")
    
    Swagger(app)
    
    # Register all blueprints
    app.register_blueprint(todo_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(user_management_bp)
    app.register_blueprint(package_management_bp)
    app.register_blueprint(learner_bp)
    app.register_blueprint(mentor_bp)
    app.register_blueprint(purchase_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(notification_bp)
    app.register_blueprint(resource_bp)
    app.register_blueprint(report_bp)
    app.register_blueprint(topic_bp)
    app.register_blueprint(policy_bp)
    app.register_blueprint(mentor_content_bp)
    app.register_blueprint(community_bp)
    app.register_blueprint(challenge_bp)
    app.register_blueprint(subscription_bp)
    app.register_blueprint(user_profile_bp)
    app.register_blueprint(practice_bp)
    
    # Role connection controllers
    app.register_blueprint(message_bp)
    app.register_blueprint(assignment_bp)
    app.register_blueprint(feedback_bp)
    app.register_blueprint(video_bp)
    app.register_blueprint(study_buddy_bp)
    app.register_blueprint(note_bp)

    # Swagger UI blueprint
    SWAGGER_URL = '/docs'
    API_URL = '/swagger.json'
    swaggerui_blueprint = get_swaggerui_blueprint(
        SWAGGER_URL,
        API_URL,
        config={'app_name': "AESP API"}
    )
    app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

    try:
        init_db(app)
    except Exception as e:
        print(f"Error initializing database: {e}")

    # Register middleware
    middleware(app)

    # Register routes for swagger
    with app.test_request_context():
        for rule in app.url_map.iter_rules():
            if rule.endpoint.startswith(('todo.', 'course.', 'user.', 'admin.', 'user_management.', 'package_management.')):
                view_func = app.view_functions[rule.endpoint]
                print(f"Adding path: {rule.rule} -> {view_func}")
                spec.path(view=view_func)

    @app.route("/swagger.json")
    def swagger_json():
        return jsonify(spec.to_dict())
    
    @app.route("/")
    def home():
        return jsonify({
            "message": "Welcome to AESP API",
            "docs": "/docs",
            "version": "1.0.0"
        })

    # Initialize WebSocket
    init_socketio(app)

    return app

# Run the application with SocketIO
if __name__ == '__main__':
    app = create_app()
    # Use socketio.run instead of app.run for WebSocket support
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
