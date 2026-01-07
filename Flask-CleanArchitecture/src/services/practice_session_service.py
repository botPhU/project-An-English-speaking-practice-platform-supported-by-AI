"""
Practice Session Service
Manages AI-powered speaking practice sessions with database persistence
"""

from datetime import datetime
import json
import re
from infrastructure.models.practice_session_model import PracticeSessionModel
from infrastructure.databases.mssql import session as db_session


class PracticeSessionService:
    def __init__(self):
        # Don't initialize AIService here - do it in methods to have app context
        pass

    def _get_ai_service(self):
        """Get AIService instance within app context"""
        from .ai_service import AIService
        return AIService()

    def start_session(self, user_id, session_type='ai_only', topic=None, scenario=None):
        """Start a new practice session."""
        try:
            practice = PracticeSessionModel(
                user_id=user_id,
                session_type=session_type,
                topic=topic,
                scenario=scenario,
                started_at=datetime.now(),
                created_at=datetime.now(),
                transcript=json.dumps([]),
                is_completed=False
            )
            db_session.add(practice)
            db_session.commit()
            
            # Return the session data before any potential issues
            session_id = practice.id
            return type('obj', (object,), {'id': session_id})()
        except Exception as e:
            db_session.rollback()
            print(f"[PracticeSessionService] Error starting session: {e}")
            raise e

    def process_chat(self, session_id, user_message):
        """Process a user message, get AI response, and update transcript."""
        try:
            practice = db_session.query(PracticeSessionModel).filter_by(id=session_id).first()
            if not practice:
                return {"error": "Session not found"}

            # Load existing transcript
            transcript = json.loads(practice.transcript or "[]")
            
            # Get AI response
            ai_service = self._get_ai_service()
            
            # Format history for Gemini
            history = []
            for msg in transcript[-10:]:
                history.append({
                    "role": "user" if msg["role"] == "user" else "model",
                    "parts": [msg["content"]]
                })

            ai_response = ai_service.generate_response(
                user_message, 
                history=history,
                scenario=practice.topic
            )

            # Update transcript
            transcript.append({
                "role": "user", 
                "content": user_message, 
                "timestamp": datetime.now().isoformat()
            })
            transcript.append({
                "role": "assistant", 
                "content": ai_response, 
                "timestamp": datetime.now().isoformat()
            })
            
            practice.transcript = json.dumps(transcript)
            db_session.commit()

            return {
                "response": ai_response,
                "session_id": session_id
            }
        except Exception as e:
            db_session.rollback()
            print(f"[PracticeSessionService] Error in chat: {e}")
            return {"error": str(e), "response": "Sorry, I encountered an error. Please try again."}

    def finalize_session(self, session_id):
        """Analyze the session transcript and close it."""
        try:
            practice = db_session.query(PracticeSessionModel).filter_by(id=session_id).first()
            if not practice:
                return {"error": "Session not found"}

            if practice.is_completed:
                return {"message": "Session already completed", "analysis": practice.ai_feedback}

            # Get AI Analysis
            ai_service = self._get_ai_service()
            analysis_raw = ai_service.analyze_practice(practice.transcript)
            
            # Parse JSON response
            try:
                json_match = re.search(r'\{.*\}', str(analysis_raw), re.DOTALL)
                if json_match:
                    report = json.loads(json_match.group())
                    
                    practice.pronunciation_score = report.get('pronunciation_score')
                    practice.grammar_score = report.get('grammar_score')
                    practice.vocabulary_score = report.get('vocabulary_score')
                    practice.fluency_score = report.get('fluency_score')
                    practice.overall_score = report.get('overall_score')
                    practice.ai_feedback = json.dumps(report)
                else:
                    practice.ai_feedback = str(analysis_raw)
            except Exception as parse_error:
                print(f"[PracticeSessionService] Parse error: {parse_error}")
                practice.ai_feedback = str(analysis_raw)

            practice.is_completed = True
            practice.ended_at = datetime.now()
            db_session.commit()

            # Build response
            response_data = {
                "session_id": session_id,
                "analysis": practice.ai_feedback,
                "pronunciation_score": practice.pronunciation_score,
                "grammar_score": practice.grammar_score,
                "vocabulary_score": practice.vocabulary_score,
                "fluency_score": practice.fluency_score,
                "overall_score": practice.overall_score
            }
            
            return response_data
        except Exception as e:
            db_session.rollback()
            print(f"[PracticeSessionService] Error finalizing: {e}")
            return {"error": str(e)}

    def get_session(self, session_id):
        """Get session details"""
        try:
            practice = db_session.query(PracticeSessionModel).filter_by(id=session_id).first()
            if not practice:
                return None
            return {
                "id": practice.id,
                "user_id": practice.user_id,
                "topic": practice.topic,
                "transcript": json.loads(practice.transcript or "[]"),
                "is_completed": practice.is_completed,
                "scores": {
                    "pronunciation": practice.pronunciation_score,
                    "grammar": practice.grammar_score,
                    "vocabulary": practice.vocabulary_score,
                    "fluency": practice.fluency_score,
                    "overall": practice.overall_score
                }
            }
        except Exception as e:
            print(f"[PracticeSessionService] Error getting session: {e}")
            return None
