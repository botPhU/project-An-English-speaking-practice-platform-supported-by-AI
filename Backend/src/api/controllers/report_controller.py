"""
Report Controller for AESP Platform
API endpoints for analytics and reports
"""

from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta

from services.report_service import ReportService

report_bp = Blueprint('reports', __name__, url_prefix='/api/reports')


# ==================== ADMIN REPORTS ====================

@report_bp.route('/admin/dashboard', methods=['GET'])
def get_admin_dashboard():
    """
    Get admin dashboard statistics
    ---
    tags:
      - Reports
    responses:
      200:
        description: Dashboard statistics
    """
    stats = ReportService.get_admin_dashboard_stats()
    return jsonify(stats), 200


@report_bp.route('/admin/revenue', methods=['GET'])
def get_revenue_report():
    """
    Get revenue report
    ---
    tags:
      - Reports
    parameters:
      - in: query
        name: start_date
        type: string
        format: date
      - in: query
        name: end_date
        type: string
        format: date
    responses:
      200:
        description: Revenue report
    """
    start_str = request.args.get('start_date')
    end_str = request.args.get('end_date')
    
    start_date = None
    end_date = None
    
    if start_str:
        try:
            start_date = datetime.fromisoformat(start_str)
        except:
            pass
    
    if end_str:
        try:
            end_date = datetime.fromisoformat(end_str)
        except:
            pass
    
    report = ReportService.get_revenue_report(start_date, end_date)
    return jsonify(report), 200


@report_bp.route('/admin/user-growth', methods=['GET'])
def get_user_growth():
    """
    Get user growth report
    ---
    tags:
      - Reports
    parameters:
      - in: query
        name: days
        type: integer
        default: 30
    responses:
      200:
        description: User growth data
    """
    days = request.args.get('days', 30, type=int)
    report = ReportService.get_user_growth_report(days)
    return jsonify(report), 200


# ==================== LEARNER REPORTS ====================

@report_bp.route('/learner/<int:user_id>/progress', methods=['GET'])
def get_learner_progress(user_id: int):
    """
    Get detailed progress report for a learner
    ---
    tags:
      - Reports
    parameters:
      - in: path
        name: user_id
        type: integer
        required: true
    responses:
      200:
        description: Learner progress report
    """
    report = ReportService.get_learner_progress_report(user_id)
    return jsonify(report), 200


@report_bp.route('/learner/<int:user_id>/weekly', methods=['GET'])
def get_learner_weekly(user_id: int):
    """
    Get weekly summary for a learner
    ---
    tags:
      - Reports
    parameters:
      - in: path
        name: user_id
        type: integer
        required: true
    responses:
      200:
        description: Weekly summary
    """
    report = ReportService.get_learner_weekly_report(user_id)
    return jsonify(report), 200


# ==================== MENTOR REPORTS ====================

@report_bp.route('/mentor/<int:mentor_id>/performance', methods=['GET'])
def get_mentor_performance(mentor_id: int):
    """
    Get performance report for a mentor
    ---
    tags:
      - Reports
    parameters:
      - in: path
        name: mentor_id
        type: integer
        required: true
    responses:
      200:
        description: Mentor performance report
    """
    report = ReportService.get_mentor_performance_report(mentor_id)
    return jsonify(report), 200
