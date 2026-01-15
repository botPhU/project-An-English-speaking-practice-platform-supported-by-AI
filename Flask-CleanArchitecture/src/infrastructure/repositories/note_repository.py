from infrastructure.models.note_model import NoteModel
from infrastructure.databases import db

class NoteRepository:
    def create(self, note_data):
        new_note = NoteModel(
            user_id=note_data['user_id'],
            title=note_data['title'],
            content=note_data.get('content')
        )
        db.session.add(new_note)
        db.session.commit()
        return new_note.to_dict()

    def get_by_user(self, user_id):
        notes = NoteModel.query.filter_by(user_id=user_id).all()
        return [note.to_dict() for note in notes]