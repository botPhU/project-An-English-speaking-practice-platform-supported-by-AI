"""
Message Controller
API endpoints for messaging between users
"""
from flask import Blueprint, request, jsonify
from flasgger import swag_from
from services.message_service import message_service

message_bp = Blueprint('messages', __name__, url_prefix='/api/messages')


@message_bp.route('/conversations', methods=['GET'])
@swag_from({
    'tags': ['Messages'],
    'summary': 'Get user conversations',
    'parameters': [
        {'name': 'user_id', 'in': 'query', 'type': 'integer', 'required': True}
    ],
    'responses': {'200': {'description': 'List of conversations'}}
})
def get_conversations():
    """Get all conversations for a user"""
    user_id = request.args.get('user_id', type=int)
    if not user_id:
        return jsonify({'error': 'user_id is required'}), 400
    
    conversations = message_service.get_conversations(user_id)
    return jsonify(conversations), 200


@message_bp.route('/<int:other_user_id>', methods=['GET'])
@swag_from({
    'tags': ['Messages'],
    'summary': 'Get messages with a user',
    'parameters': [
        {'name': 'other_user_id', 'in': 'path', 'type': 'integer', 'required': True},
        {'name': 'user_id', 'in': 'query', 'type': 'integer', 'required': True},
        {'name': 'limit', 'in': 'query', 'type': 'integer', 'required': False},
        {'name': 'offset', 'in': 'query', 'type': 'integer', 'required': False}
    ],
    'responses': {'200': {'description': 'List of messages'}}
})
def get_messages(other_user_id):
    """Get messages between current user and another user"""
    user_id = request.args.get('user_id', type=int)
    limit = request.args.get('limit', 50, type=int)
    offset = request.args.get('offset', 0, type=int)
    
    if not user_id:
        return jsonify({'error': 'user_id is required'}), 400
    
    messages = message_service.get_messages(user_id, other_user_id, limit, offset)
    return jsonify(messages), 200


@message_bp.route('/send', methods=['POST'])
@swag_from({
    'tags': ['Messages'],
    'summary': 'Send a message',
    'responses': {'201': {'description': 'Message sent'}}
})
def send_message():
    """Send a message to another user"""
    data = request.get_json()
    sender_id = data.get('sender_id')
    receiver_id = data.get('receiver_id')
    content = data.get('content')
    
    if not all([sender_id, receiver_id, content]):
        return jsonify({'error': 'sender_id, receiver_id, and content are required'}), 400
    
    message = message_service.send_message(sender_id, receiver_id, content)
    if message:
        return jsonify(message), 201
    return jsonify({'error': 'Failed to send message'}), 500


@message_bp.route('/<int:message_id>/read', methods=['PUT'])
@swag_from({
    'tags': ['Messages'],
    'summary': 'Mark message as read',
    'parameters': [
        {'name': 'message_id', 'in': 'path', 'type': 'integer', 'required': True}
    ],
    'responses': {'200': {'description': 'Message marked as read'}}
})
def mark_as_read(message_id):
    """Mark a single message as read"""
    data = request.get_json()
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'user_id is required'}), 400
    
    success = message_service.mark_as_read(message_id, user_id)
    if success:
        return jsonify({'message': 'Marked as read'}), 200
    return jsonify({'error': 'Message not found or not authorized'}), 404


@message_bp.route('/read-all/<int:other_user_id>', methods=['PUT'])
@swag_from({
    'tags': ['Messages'],
    'summary': 'Mark all messages from user as read',
    'parameters': [
        {'name': 'other_user_id', 'in': 'path', 'type': 'integer', 'required': True}
    ],
    'responses': {'200': {'description': 'Messages marked as read'}}
})
def mark_all_read(other_user_id):
    """Mark all messages from another user as read"""
    data = request.get_json()
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'user_id is required'}), 400
    
    count = message_service.mark_all_read(user_id, other_user_id)
    return jsonify({'message': f'{count} messages marked as read'}), 200


@message_bp.route('/unread-count', methods=['GET'])
@swag_from({
    'tags': ['Messages'],
    'summary': 'Get unread message count',
    'parameters': [
        {'name': 'user_id', 'in': 'query', 'type': 'integer', 'required': True}
    ],
    'responses': {'200': {'description': 'Unread count'}}
})
def get_unread_count():
    """Get total unread message count"""
    user_id = request.args.get('user_id', type=int)
    if not user_id:
        return jsonify({'error': 'user_id is required'}), 400
    
    count = message_service.get_unread_count(user_id)
    return jsonify({'unread_count': count}), 200
