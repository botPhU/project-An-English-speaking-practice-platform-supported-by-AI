from infrastructure.models.note_model import NoteModel
from infrastructure.databases.mssql import get_db_session

class NoteRepository:
    def create(self, note_data):
        with get_db_session() as session:
            new_note = NoteModel(
                user_id=note_data['user_id'],
                title=note_data['title'],
                content=note_data.get('content')
            )
            session.add(new_note)
            session.commit()
            return new_note.to_dict()

    def get_by_user(self, user_id):
        with get_db_session() as session:
            notes = session.query(NoteModel).filter_by(user_id=user_id).all()
            return [note.to_dict() for note in notes]