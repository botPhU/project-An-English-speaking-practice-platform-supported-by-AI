from infrastructure.repositories.note_repository import NoteRepository

# Initialize repository
note_repository = NoteRepository()

class NoteService:
    def create_note(self, data):
        # Validation logic
        if not data.get('title'):
            return {'error': 'Title is required'}
        
        return note_repository.create(data)

    def get_user_notes(self, user_id):
        return note_repository.get_by_user(user_id)

note_service = NoteService()
