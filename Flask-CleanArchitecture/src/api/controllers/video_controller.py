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
    
    active_rooms[booking_id] = {
        'room_name': room_name,
        'mentor_id': mentor_id,
        'learner_id': learner_id,
        'created_at': datetime.now().isoformat(),
        'status': 'active'
    }
    
    return jsonify({
        'room_name': room_name,
        'jitsi_domain': 'meet.jit.si',
        'join_url': f'https://meet.jit.si/{room_name}'
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
