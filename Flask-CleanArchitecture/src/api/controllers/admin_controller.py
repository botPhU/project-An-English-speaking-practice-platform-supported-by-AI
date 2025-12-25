from flask import Blueprint, jsonify, request
from services.admin_service import AdminService
from services.admin_profile_service import AdminProfileService
from services.admin_settings_service import AdminSettingsService

bp = Blueprint('admin', __name__, url_prefix='/api/admin')
admin_service = AdminService()
profile_service = AdminProfileService()
settings_service = AdminSettingsService()

@bp.route('/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    """
    Get dashboard statistics
    ---
    get:
      summary: Get admin dashboard statistics
      tags:
        - Admin Dashboard
      responses:
        200:
          description: Dashboard statistics
          content:
            application/json:
              schema:
                type: object
                properties:
                  total_users:
                    type: integer
                    example: 1247
                  users_change:
                    type: string
                    example: "+12%"
                  total_revenue:
                    type: integer
                    example: 45600000
                  revenue_change:
                    type: string
                    example: "+8%"
                  ai_lessons:
                    type: integer
                    example: 3891
                  lessons_change:
                    type: string
                    example: "+15%"
                  active_mentors:
                    type: integer
                    example: 48
                  mentors_change:
                    type: string
                    example: "+3%"
                  last_updated:
                    type: string
                    format: date-time
    """
    stats = admin_service.get_dashboard_stats()
    return jsonify(stats), 200

@bp.route('/dashboard/activities', methods=['GET'])
def get_recent_activities():
    """
    Get recent system activities
    ---
    get:
      summary: Get recent activities for dashboard
      tags:
        - Admin Dashboard
      parameters:
        - name: limit
          in: query
          schema:
            type: integer
            default: 10
          description: Number of activities to return
      responses:
        200:
          description: List of recent activities
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    id:
                      type: integer
                    type:
                      type: string
                    user:
                      type: string
                    action:
                      type: string
                    timestamp:
                      type: string
                      format: date-time
                    icon:
                      type: string
                    color:
                      type: string
    """
    from flask import request
    limit = request.args.get('limit', 10, type=int)
    activities = admin_service.get_recent_activities(limit=limit)
    return jsonify(activities), 200

@bp.route('/dashboard/revenue-chart', methods=['GET'])
def get_revenue_chart():
    """
    Get revenue chart data
    ---
    get:
      summary: Get revenue chart data for dashboard
      tags:
        - Admin Dashboard
      parameters:
        - name: period
          in: query
          schema:
            type: string
            default: "30days"
            enum: ["7days", "30days", "90days", "1year"]
      responses:
        200:
          description: Revenue chart data
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    week:
                      type: string
                    revenue:
                      type: integer
                    date:
                      type: string
    """
    from flask import request
    period = request.args.get('period', '30days')
    data = admin_service.get_revenue_chart_data(period=period)
    return jsonify(data), 200

@bp.route('/dashboard/user-growth', methods=['GET'])
def get_user_growth():
    """
    Get user growth data
    ---
    get:
      summary: Get user growth data for dashboard
      tags:
        - Admin Dashboard
      responses:
        200:
          description: User growth data
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    date:
                      type: string
                    count:
                      type: integer
    """
    data = admin_service.get_user_growth_data()
    return jsonify(data), 200

# --- Admin Profile Endpoints ---

@bp.route('/profile', methods=['GET'])
def get_admin_profile():
    """Get admin profile"""
    profile = profile_service.get_profile()
    return jsonify(profile), 200

@bp.route('/profile', methods=['PUT'])
def update_admin_profile():
    """Update admin profile"""
    from flask import request
    data = request.get_json()
    profile = profile_service.update_profile(data)
    return jsonify(profile), 200

@bp.route('/profile/change-password', methods=['POST'])
def change_admin_password():
    """Change admin password"""
    from flask import request
    data = request.get_json()
    current_password = data.get('current_password')
    new_password = data.get('new_password')
    success, message = profile_service.change_password(current_password, new_password)
    return jsonify({'success': success, 'message': message}), 200 if success else 400

# --- Admin Settings Endpoints ---

@bp.route('/settings', methods=['GET'])
def get_admin_settings():
    """Get all admin settings"""
    settings = settings_service.get_settings()
    return jsonify(settings), 200

@bp.route('/settings/general', methods=['PUT'])
def update_general_settings():
    """Update general settings"""
    from flask import request
    data = request.get_json()
    settings = settings_service.update_general_settings(data)
    return jsonify(settings), 200

@bp.route('/settings/security', methods=['PUT'])
def update_security_settings():
    """Update security settings"""
    from flask import request
    data = request.get_json()
    settings = settings_service.update_security_settings(data)
    return jsonify(settings), 200

@bp.route('/settings/performance', methods=['PUT'])
def update_performance_settings():
    """Update performance settings"""
    from flask import request
    data = request.get_json()
    settings = settings_service.update_performance_settings(data)
    return jsonify(settings), 200
