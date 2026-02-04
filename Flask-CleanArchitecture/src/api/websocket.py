"""
WebSocket module for real-time communication
Handles user online/offline status and notifications
"""

from flask_socketio import SocketIO, emit
from flask import request
from datetime import datetime

# Create SocketIO instance (will be initialized with app)
socketio = SocketIO(cors_allowed_origins="*")

# Store connected users: {user_id: {sid: session_id, connected_at: datetime}}
connected_users = {}


def init_socketio(app):
    """Initialize SocketIO with Flask app"""
    socketio.init_app(app, 
                      cors_allowed_origins=["http://localhost:5173", "http://localhost:3000", "*"],
                      async_mode='eventlet',
                      logger=True,
                      engineio_logger=True)
    print("[WebSocket] SocketIO initialized")
    return socketio


@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    print(f"[WebSocket] Client connected: {request.sid}")
    emit('connected', {'message': 'Connected to AESP WebSocket server', 'sid': request.sid})


@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    print(f"[WebSocket] Client disconnecting: {request.sid}")
    # Find user by session ID and remove
    user_id_to_remove = None
    for user_id, data in list(connected_users.items()):
        if data.get('sid') == request.sid:
            user_id_to_remove = user_id
            break
    
    if user_id_to_remove:
        del connected_users[user_id_to_remove]
        # Broadcast user offline status
        broadcast_user_status(user_id_to_remove, 'offline')
        print(f"[WebSocket] User {user_id_to_remove} disconnected and marked offline")
    
    print(f"[WebSocket] Client disconnected: {request.sid}")
    print(f"[WebSocket] Current online users: {list(connected_users.keys())}")


@socketio.on('user_online')
def handle_user_online(data):
    """Handle user coming online after login"""
    print(f"[WebSocket] Received user_online event: {data}")
    user_id = data.get('userId')
    if user_id:
        connected_users[str(user_id)] = {
            'sid': request.sid,
            'connected_at': datetime.now().isoformat()
        }
        # Broadcast to all clients
        broadcast_user_status(str(user_id), 'online')
        print(f"[WebSocket] User {user_id} is now ONLINE")
        print(f"[WebSocket] Current online users: {list(connected_users.keys())}")


@socketio.on('user_offline')
def handle_user_offline(data):
    """Handle user going offline (logout)"""
    print(f"[WebSocket] Received user_offline event: {data}")
    user_id = data.get('userId')
    if user_id and str(user_id) in connected_users:
        del connected_users[str(user_id)]
        # Broadcast to all clients
        broadcast_user_status(str(user_id), 'offline')
        print(f"[WebSocket] User {user_id} is now OFFLINE")
        print(f"[WebSocket] Current online users: {list(connected_users.keys())}")


@socketio.on('user_away')
def handle_user_away(data):
    """Handle user going away (idle)"""
    user_id = data.get('userId')
    if user_id:
        broadcast_user_status(str(user_id), 'away')
        print(f"[WebSocket] User {user_id} is now AWAY")


@socketio.on('check_user_online')
def handle_check_user_online(data):
    """Check if a specific user is online and respond"""
    user_id = data.get('userId')
    if user_id:
        is_online = str(user_id) in connected_users
        # Respond only to the requesting client
        emit('user_status_update', {'userId': str(user_id), 'isOnline': is_online})
        print(f"[WebSocket] Checked user {user_id} online status: {is_online}")


def broadcast_user_status(user_id: str, status: str, last_active: str = None):
    """Broadcast user status change to all connected clients"""
    is_online = status == 'online'
    
    # Emit user_status_update for frontend SocketService
    socketio.emit('user_status_update', {'userId': str(user_id), 'isOnline': is_online})
    
    # Also emit legacy message format for backwards compatibility
    message = {
        'type': 'USER_STATUS_CHANGE',
        'payload': {
            'userId': str(user_id),
            'status': status,
            'lastActive': last_active or datetime.now().isoformat()
        },
        'timestamp': datetime.now().timestamp()
    }
    print(f"[WebSocket] Broadcasting: {message}")
    socketio.emit('message', message)


def get_online_users():
    """Get list of currently online user IDs"""
    return list(connected_users.keys())


def is_user_online(user_id: str) -> bool:
    """Check if a user is online"""
    return str(user_id) in connected_users


# Helper function to be called from auth controller
def notify_user_login(user_id: str):
    """Notify all clients that a user has logged in"""
    print(f"[WebSocket] notify_user_login called for user: {user_id}")
    broadcast_user_status(str(user_id), 'online')


def notify_user_logout(user_id: str):
    """Notify all clients that a user has logged out"""
    print(f"[WebSocket] notify_user_logout called for user: {user_id}")
    if str(user_id) in connected_users:
        del connected_users[str(user_id)]
    broadcast_user_status(str(user_id), 'offline')


# ============ VIDEO CALL EVENTS ============

@socketio.on('call_user')
def handle_call_user(data):
    """
    Handle mentor initiating a video call to learner
    data: { callerId, callerName, callerAvatar, targetUserId, roomName }
    """
    print(f"[WebSocket] Call initiated: {data}")
    target_user_id = str(data.get('targetUserId'))
    
    if target_user_id in connected_users:
        target_sid = connected_users[target_user_id]['sid']
        # Send incoming call notification to target user
        socketio.emit('incoming_call', {
            'callerId': data.get('callerId'),
            'callerName': data.get('callerName'),
            'callerAvatar': data.get('callerAvatar'),
            'roomName': data.get('roomName')
        }, room=target_sid)
        print(f"[WebSocket] Sent incoming_call to user {target_user_id}")
        
        # Confirm to caller that call was sent
        emit('call_sent', {'targetUserId': target_user_id, 'status': 'ringing'})
    else:
        # Target user is offline
        emit('call_failed', {'targetUserId': target_user_id, 'reason': 'User is offline'})
        print(f"[WebSocket] User {target_user_id} is offline, call failed")


@socketio.on('call_accepted')
def handle_call_accepted(data):
    """Handle learner accepting the call"""
    print(f"[WebSocket] Call accepted: {data}")
    caller_id = str(data.get('callerId'))
    
    if caller_id in connected_users:
        caller_sid = connected_users[caller_id]['sid']
        socketio.emit('call_accepted', {
            'targetUserId': data.get('targetUserId'),
            'roomName': data.get('roomName')
        }, room=caller_sid)
        print(f"[WebSocket] Notified caller {caller_id} that call was accepted")


@socketio.on('call_declined')
def handle_call_declined(data):
    """Handle learner declining the call"""
    print(f"[WebSocket] Call declined: {data}")
    caller_id = str(data.get('callerId'))
    
    if caller_id in connected_users:
        caller_sid = connected_users[caller_id]['sid']
        socketio.emit('call_declined', {
            'targetUserId': data.get('targetUserId'),
            'reason': data.get('reason', 'User declined the call')
        }, room=caller_sid)
        print(f"[WebSocket] Notified caller {caller_id} that call was declined")


def send_call_notification(target_user_id: str, caller_name: str, caller_avatar: str, room_name: str):
    """
    Helper function to send call notification from API endpoint
    Can be called from video_controller when creating a room
    """
    target_user_id = str(target_user_id)
    if target_user_id in connected_users:
        target_sid = connected_users[target_user_id]['sid']
        socketio.emit('incoming_call', {
            'callerName': caller_name,
            'callerAvatar': caller_avatar,
            'roomName': room_name
        }, room=target_sid)
        return True
    return False
