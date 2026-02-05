"""
Video Call Controller
API endpoints for video call room management (Jitsi Meet integration)
"""
from flask import Blueprint, request, jsonify
from flasgger import swag_from
from datetime import datetime
import hashlib

video_bp = Blueprint('video', __name__, url_prefix='/api/video')

# Store active rooms (in production, use Redis or database)
active_rooms = {}


def generate_room_name(booking_id: int, mentor_id: int, learner_id: int) -> str:
    """Generate a unique room name for a booking"""
    raw = f"aesp-{booking_id}-{mentor_id}-{learner_id}-{datetime.now().timestamp()}"
    hash_str = hashlib.md5(raw.encode()).hexdigest()[:8]
    return f"aesp-session-{booking_id}-{hash_str}"


@video_bp.route('/create-room', methods=['POST'])
@swag_from({
    'tags': ['Video'],
    'summary': 'Create video call room',
    'responses': {'201': {'description': 'Room created'}}
})
def create_room():
    """Create a new video call room for a booking"""
    data = request.get_json()
    booking_id = data.get('booking_id', 0)  # Default to 0 for direct calls
    mentor_id = data.get('mentor_id')
    learner_id = data.get('learner_id')
    
    # Only mentor_id and learner_id are required, booking_id can be 0 for direct calls
    if mentor_id is None or learner_id is None:
        return jsonify({'error': 'mentor_id and learner_id are required'}), 400
    
    room_name = generate_room_name(booking_id, mentor_id, learner_id)
    join_url = f'https://meet.jit.si/{room_name}'
    
    active_rooms[booking_id] = {
        'room_name': room_name,
        'mentor_id': mentor_id,
        'learner_id': learner_id,
        'created_at': datetime.now().isoformat(),
        'status': 'active'
    }
    
    # Get mentor name for notification
    try:
        from infrastructure.databases.mssql import get_db_session
        from infrastructure.models.user_model import UserModel
        
        mentor_name = "Mentor"
        with get_db_session() as session:
            mentor = session.query(UserModel).filter(UserModel.id == mentor_id).first()
            if mentor:
                mentor_name = mentor.full_name or mentor.user_name
        
        # Create notification for learner in database
        from services.notification_service import NotificationService
        NotificationService.create_notification(
            user_id=learner_id,
            title="📹 Mentor đang gọi bạn!",
            message=f"{mentor_name} đã bắt đầu phiên học. Nhấn để tham gia ngay!",
            notification_type="video_call",
            action_url=f"/video-call?room={room_name}"
        )
        
        # Send real-time WebSocket notification to learner
        from api.websocket import socketio, connected_users
        if str(learner_id) in connected_users:
            socketio.emit('video_call_invite', {
                'type': 'VIDEO_CALL_INVITE',
                'room_name': room_name,
                'join_url': join_url,
                'mentor_id': mentor_id,
                'mentor_name': mentor_name,
                'booking_id': booking_id,
                'message': f'{mentor_name} đang gọi bạn!'
            }, room=connected_users[str(learner_id)].get('sid'))
            print(f"[VIDEO] Sent call invite to learner {learner_id}")
        else:
            print(f"[VIDEO] Learner {learner_id} not online, notification saved")
            
    except Exception as e:
        print(f"[VIDEO] Error sending notification: {e}")
        # Don't fail room creation if notification fails
    
    return jsonify({
        'room_name': room_name,
        'jitsi_domain': 'meet.jit.si',
        'join_url': join_url
    }), 201


@video_bp.route('/room/<int:booking_id>', methods=['GET'])
@swag_from({
    'tags': ['Video'],
    'summary': 'Get room info',
    'parameters': [
        {'name': 'booking_id', 'in': 'path', 'type': 'integer', 'required': True}
    ],
    'responses': {'200': {'description': 'Room info'}}
})
def get_room(booking_id):
    """Get room info for a booking"""
    room = active_rooms.get(booking_id)
    if room:
        return jsonify({
            'booking_id': booking_id,
            'room_name': room['room_name'],
            'jitsi_domain': 'meet.jit.si',
            'join_url': f"https://meet.jit.si/{room['room_name']}",
            'status': room['status']
        }), 200
    return jsonify({'error': 'Room not found'}), 404


@video_bp.route('/room/<int:booking_id>/end', methods=['POST'])
@swag_from({
    'tags': ['Video'],
    'summary': 'End video call',
    'parameters': [
        {'name': 'booking_id', 'in': 'path', 'type': 'integer', 'required': True}
    ],
    'responses': {'200': {'description': 'Room ended'}}
})
def end_room(booking_id):
    """End a video call room"""
    if booking_id in active_rooms:
        active_rooms[booking_id]['status'] = 'ended'
        active_rooms[booking_id]['ended_at'] = datetime.now().isoformat()
        return jsonify({'message': 'Room ended'}), 200
    return jsonify({'error': 'Room not found'}), 404
