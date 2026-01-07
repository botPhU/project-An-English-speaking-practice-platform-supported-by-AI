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


def broadcast_user_status(user_id: str, status: str, last_active: str = None):
    """Broadcast user status change to all connected clients"""
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
