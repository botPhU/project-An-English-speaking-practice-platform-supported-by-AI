"""
Notification Controller for AESP Platform
API endpoints for managing user notifications
"""

from flask import Blueprint, request, jsonify

from services.notification_service import NotificationService
from services.auth_service import AuthService

notification_bp = Blueprint('notifications', __name__, url_prefix='/api/notifications')


@notification_bp.route('/user/<int:user_id>', methods=['GET'])
def get_user_notifications(user_id: int):
    """
    Get notifications for a user
    ---
    tags:
      - Notifications
    parameters:
      - in: path
        name: user_id
        type: integer
        required: true
      - in: query
        name: limit
        type: integer
        default: 20
      - in: query
        name: offset
        type: integer
        default: 0
      - in: query
        name: unread_only
        type: boolean
        default: false
    responses:
      200:
        description: List of notifications
    """
    limit = request.args.get('limit', 20, type=int)
    offset = request.args.get('offset', 0, type=int)
    unread_only = request.args.get('unread_only', 'false').lower() == 'true'
    
    notifications = NotificationService.get_user_notifications(
        user_id=user_id,
        limit=limit,
        offset=offset,
        unread_only=unread_only
    )
    
    return jsonify({
        'notifications': notifications,
        'count': len(notifications)
    }), 200


@notification_bp.route('/user/<int:user_id>/unread-count', methods=['GET'])
def get_unread_count(user_id: int):
    """
    Get count of unread notifications
    ---
    tags:
      - Notifications
    parameters:
      - in: path
        name: user_id
        type: integer
        required: true
    responses:
      200:
        description: Unread count
    """
    count = NotificationService.get_unread_count(user_id)
    return jsonify({'unread_count': count}), 200


@notification_bp.route('/', methods=['POST'])
def create_notification():
    """
    Create a new notification (Admin only)
    ---
    tags:
      - Notifications
    parameters:
      - in: body
        name: body
        schema:
          type: object
          required:
            - user_id
            - title
          properties:
            user_id:
              type: integer
            title:
              type: string
            message:
              type: string
            notification_type:
              type: string
            action_url:
              type: string
    responses:
      201:
        description: Notification created
    """
    data = request.get_json()
    
    if not data.get('user_id') or not data.get('title'):
        return jsonify({'error': 'user_id and title are required'}), 400
    
    notification = NotificationService.create_notification(
        user_id=data['user_id'],
        title=data['title'],
        message=data.get('message'),
        notification_type=data.get('notification_type', 'system'),
        action_url=data.get('action_url')
    )
    
    return jsonify(notification.to_dict()), 201


@notification_bp.route('/bulk', methods=['POST'])
def send_bulk_notification():
    """
    Send notification to multiple users (Admin only)
    ---
    tags:
      - Notifications
    parameters:
      - in: body
        name: body
        schema:
          type: object
          required:
            - user_ids
            - title
          properties:
            user_ids:
              type: array
              items:
                type: integer
            title:
              type: string
            message:
              type: string
    responses:
      201:
        description: Notifications sent
    """
    data = request.get_json()
    
    if not data.get('user_ids') or not data.get('title'):
        return jsonify({'error': 'user_ids and title are required'}), 400
    
    count = NotificationService.send_bulk_notification(
        user_ids=data['user_ids'],
        title=data['title'],
        message=data.get('message'),
        notification_type=data.get('notification_type', 'system')
    )
    
    return jsonify({
        'message': f'Sent {count} notifications',
        'count': count
    }), 201


@notification_bp.route('/<int:notification_id>/read', methods=['PUT'])
def mark_as_read(notification_id: int):
    """
    Mark a notification as read
    ---
    tags:
      - Notifications
    parameters:
      - in: path
        name: notification_id
        type: integer
        required: true
    responses:
      200:
        description: Marked as read
      404:
        description: Notification not found
    """
    user_id = request.args.get('user_id', type=int)
    
    success = NotificationService.mark_as_read(notification_id, user_id)
    
    if success:
        return jsonify({'message': 'Marked as read'}), 200
    
    return jsonify({'error': 'Notification not found'}), 404


@notification_bp.route('/user/<int:user_id>/read-all', methods=['PUT'])
def mark_all_as_read(user_id: int):
    """
    Mark all notifications as read for a user
    ---
    tags:
      - Notifications
    parameters:
      - in: path
        name: user_id
        type: integer
        required: true
    responses:
      200:
        description: All marked as read
    """
    count = NotificationService.mark_all_as_read(user_id)
    
    return jsonify({
        'message': f'Marked {count} notifications as read',
        'count': count
    }), 200


@notification_bp.route('/<int:notification_id>', methods=['DELETE'])
def delete_notification(notification_id: int):
    """
    Delete a notification
    ---
    tags:
      - Notifications
    parameters:
      - in: path
        name: notification_id
        type: integer
        required: true
    responses:
      200:
        description: Deleted
      404:
        description: Not found
    """
    user_id = request.args.get('user_id', type=int)
    
    success = NotificationService.delete_notification(notification_id, user_id)
    
    if success:
        return jsonify({'message': 'Notification deleted'}), 200
    
    return jsonify({'error': 'Notification not found'}), 404
