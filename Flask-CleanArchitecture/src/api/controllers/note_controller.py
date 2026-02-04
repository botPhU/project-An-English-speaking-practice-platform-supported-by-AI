from flask import Blueprint, request, jsonify
from services.note_service import note_service

bp = Blueprint('note', __name__, url_prefix='/api/notes')

@bp.route('/', methods=['POST'])
def create_note():
    data = request.get_json()
    result = note_service.create_note(data)
    if 'error' in result:
        return jsonify(result), 400
    return jsonify(result), 201

@bp.route('/user/<int:user_id>', methods=['GET'])
def get_notes(user_id):
    notes = note_service.get_user_notes(user_id)
    return jsonify(notes), 200
