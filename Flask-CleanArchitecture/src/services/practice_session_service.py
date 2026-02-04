"""
Practice Session Service
Manages AI-powered speaking practice sessions with database persistence
"""

from datetime import datetime
import json
import re
import logging
from infrastructure.models.practice_session_model import PracticeSessionModel
from infrastructure.databases.mssql import get_db_session_context
from infrastructure.databases.mssql import session as db_session

logger = logging.getLogger(__name__)


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
            
            # Send notification to mentor(s)
            try:
                self._notify_mentors_session_started(user_id, topic or 'Tự do', session_id)
            except Exception as notify_error:
                print(f"[PracticeSessionService] Notification error (non-critical): {notify_error}")
            
            return type('obj', (object,), {'id': session_id})()
        except Exception as e:
            db_session.rollback()
            print(f"[PracticeSessionService] Error starting session: {e}")
            raise e
    
    def _notify_mentors_session_started(self, user_id, topic, session_id):
        """Send notification to all mentors about learner starting practice"""
        from infrastructure.models.user_model import UserModel
        from services.notification_service import NotificationService
        
        # Get learner name
        learner = db_session.query(UserModel).filter_by(id=user_id).first()
        learner_name = learner.full_name if learner else "Học viên"
        
        # Get all mentors (users with role 'mentor')
        # In a real app, you'd filter by mentor assigned to this learner
        mentors = db_session.query(UserModel).filter_by(role='mentor').limit(5).all()
        
        for mentor in mentors:
            try:
                NotificationService.notify_mentor_practice_started(
                    mentor_id=mentor.id,
                    learner_name=learner_name,
                    topic=topic,
                    session_id=session_id
                )
                print(f"[PracticeSessionService] Notified mentor {mentor.id} about session {session_id}")
            except Exception as e:
                print(f"[PracticeSessionService] Failed to notify mentor {mentor.id}: {e}")

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
        """Analyze the session transcript and close it with structured feedback."""
        try:
            with get_db_session_context() as session:
                practice = session.query(PracticeSessionModel).filter_by(id=session_id).first()
                if not practice:
                    return {"error": "Session not found"}

                if practice.is_completed:
                    return {"message": "Session already completed", "analysis": practice.ai_feedback}

                # Get AI Analysis
                ai_service = self._get_ai_service()
                analysis_raw = ai_service.analyze_practice(practice.transcript)
                
                # Parse JSON response
                report = {}
                try:
                    # Clean up the response
                    raw_text = str(analysis_raw).strip()
                    logger.info(f"[PracticeSessionService] AI Response length: {len(raw_text)}")
                    
                    # Remove markdown code blocks if present
                    json_str = raw_text
                    if "```json" in json_str:
                        json_str = json_str.split("```json")[1].split("```")[0].strip()
                    elif "```" in json_str:
                        json_str = json_str.split("```")[1].split("```")[0].strip()
                    
                    # If it doesn't look like JSON, try to find the first { and last }
                    if not (json_str.startswith("{") and json_str.endswith("}")):
                        start = json_str.find("{")
                        end = json_str.rfind("}")
                        if start != -1 and end != -1:
                            json_str = json_str[start:end+1]
                    
                    try:
                        report = json.loads(json_str)
                        logger.info("[PracticeSessionService] Successfully parsed JSON")
                        
                        # Store numeric scores (0-100)
                        practice.pronunciation_score = float(report.get('pronunciation_score', 0))
                        practice.grammar_score = float(report.get('grammar_score', 0))
                        practice.vocabulary_score = float(report.get('vocabulary_score', 0))
                        practice.fluency_score = float(report.get('fluency_score', 0))
                        practice.overall_score = float(report.get('overall_score', 0))
                        
                        # Store detailed feedback
                        practice.ai_feedback = report.get('analysis', "Hoàn thành tốt!")
                        
                        # Store errors if present
                        if 'grammar_errors' in report:
                            practice.grammar_errors = json.dumps(report['grammar_errors'])
                        if 'vocabulary_suggestions' in report:
                            practice.vocabulary_suggestions = json.dumps(report['vocabulary_suggestions'])
                            
                    except json.JSONDecodeError as e:
                        logger.error(f"[PracticeSessionService] JSON Decode Error: {e}")
                        logger.error(f"[PracticeSessionService] Attempted to parse: {json_str[:200]}...")
                        practice.ai_feedback = raw_text # Fallback to raw text
                    
                except Exception as parse_error:
                    logger.error(f"[PracticeSessionService] Parse error: {parse_error}")
                    practice.ai_feedback = str(analysis_raw)

                practice.is_completed = True
                practice.ended_at = datetime.now()
                
                # Build response for frontend
                response_data = {
                    "session_id": session_id,
                    "analysis": practice.ai_feedback,
                    "pronunciation_score": practice.pronunciation_score,
                    "grammar_score": practice.grammar_score,
                    "vocabulary_score": practice.vocabulary_score,
                    "fluency_score": practice.fluency_score,
                    "overall_score": practice.overall_score,
                    "report": report
                }
                
                return response_data
        except Exception as e:
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

    def save_audio_recording(self, session_id, audio_data, filename='recording.webm'):
        """Save audio recording for a session (for mentor review)"""
        try:
            practice = db_session.query(PracticeSessionModel).filter_by(id=session_id).first()
            if not practice:
                return {"error": "Session not found"}
            
            practice.audio_recording = audio_data
            practice.audio_filename = filename
            db_session.commit()
            
            return {"success": True, "session_id": session_id}
        except Exception as e:
            db_session.rollback()
            print(f"[PracticeSessionService] Error saving audio: {e}")
            raise e

    def get_audio_recording(self, session_id):
        """Get audio recording for a session"""
        try:
            practice = db_session.query(PracticeSessionModel).filter_by(id=session_id).first()
            if not practice or not practice.audio_recording:
                return None
            return practice.audio_recording
        except Exception as e:
            print(f"[PracticeSessionService] Error getting audio: {e}")
            return None

    def get_sessions_for_mentor(self, mentor_id=None):
        """Get practice sessions for mentor review"""
        try:
            from infrastructure.models.user_model import UserModel
            
            # Get all completed sessions (or filter by mentor's assigned learners)
            query = db_session.query(PracticeSessionModel).filter(
                PracticeSessionModel.is_completed == True
            ).order_by(PracticeSessionModel.ended_at.desc())
            
            sessions = query.limit(50).all()
            
            result = []
            for session in sessions:
                user = db_session.query(UserModel).filter_by(id=session.user_id).first()
                result.append({
                    "id": session.id,
                    "learner_id": session.user_id,
                    "learner_name": user.full_name if user else "Unknown",
                    "topic": session.topic,
                    "session_type": session.session_type,
                    "duration_minutes": session.duration_minutes or 0,
                    "started_at": session.started_at.isoformat() if session.started_at else None,
                    "ended_at": session.ended_at.isoformat() if session.ended_at else None,
                    "pronunciation_score": session.pronunciation_score,
                    "grammar_score": session.grammar_score,
                    "vocabulary_score": session.vocabulary_score,
                    "fluency_score": session.fluency_score,
                    "overall_score": session.overall_score,
                    "has_audio": session.audio_recording is not None
                })
            
            return result
        except Exception as e:
            print(f"[PracticeSessionService] Error getting mentor sessions: {e}")
            return []

