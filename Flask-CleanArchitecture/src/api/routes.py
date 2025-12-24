from src.api.controllers.todo_controller import bp as todo_bp
from src.api.controllers.admin_controller import bp as admin_bp
from src.api.controllers.user_management_controller import bp as user_management_bp
from src.api.controllers.package_management_controller import bp as package_management_bp

def register_routes(app):
    app.register_blueprint(todo_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(user_management_bp)
    app.register_blueprint(package_management_bp) 