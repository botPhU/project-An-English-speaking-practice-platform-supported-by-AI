"""
Practice Controller - API endpoints for AI-powered speaking practice
Includes session management, chat, and pronunciation analysis
"""

from flask import Blueprint, request, jsonify
from services.practice_session_service import PracticeSessionService
from services.ai_service import AIService

practice_bp = Blueprint('practice', __name__, url_prefix='/api/practice')
practice_service = PracticeSessionService()


@practice_bp.route('/vocabulary/<topic>', methods=['GET'])
def get_vocabulary(topic):
    """Get vocabulary suggestions for a topic before starting practice"""
    try:
        ai_service = AIService()
        vocabulary = ai_service.get_vocabulary_suggestions(topic)
        
        if not vocabulary:
            # Fallback to AI-generated vocabulary if database empty
            if ai_service.model:
                prompt = f"""Generate vocabulary for "{topic}" topic in JSON format:
{{
  "basic": [3 A1-A2 words with word, ipa, vietnamese, example, cefr],
  "intermediate": [3 B1-B2 words],
  "advanced": [2 C1-C2 words],
  "idioms": [2 idioms with phrase, meaning, example],
  "collocations": [2 collocations with phrase, vietnamese, example]
}}"""
                try:
                    response = ai_service.model.generate_content(prompt)
                    import json
                    import re
                    json_match = re.search(r'\{.*\}', response.text, re.DOTALL)
                    if json_match:
                        vocabulary = json.loads(json_match.group())
                except Exception:
                    pass
        
        return jsonify({
            "topic": topic,
            "vocabulary": vocabulary,
            "message": "Use these words in your practice!"
        })
    except Exception as e:
        return jsonify({"error": str(e), "vocabulary": {}}), 500


@practice_bp.route('/start', methods=['POST'])
def start_session():
    """Start a new AI practice session"""
    data = request.json
    user_id = data.get('user_id')
    topic = data.get('topic')
    scenario = data.get('scenario')
    
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400
        
    session = practice_service.start_session(user_id, topic=topic, scenario=scenario)
    return jsonify({
        "session_id": session.id,
        "message": "Practice session started"
    })


@practice_bp.route('/chat', methods=['POST'])
def chat():
    """Send message and get AI response"""
    data = request.json
    session_id = data.get('session_id')
    message = data.get('message')
    
    if not session_id or not message:
        return jsonify({"error": "session_id and message are required"}), 400
        
    result = practice_service.process_chat(session_id, message)
    return jsonify(result)


@practice_bp.route('/complete', methods=['POST'])
def complete():
    """Complete session and get analysis with scores"""
    data = request.json
    session_id = data.get('session_id')
    
    if not session_id:
        return jsonify({"error": "session_id is required"}), 400
        
    result = practice_service.finalize_session(session_id)
    return jsonify(result)


@practice_bp.route('/analyze-pronunciation', methods=['POST'])
def analyze_pronunciation():
    """
    Analyze pronunciation of a transcript
    Provides detailed feedback on pronunciation issues and tips
    """
    data = request.json
    transcript = data.get('transcript')
    expected_text = data.get('expected_text')
    
    if not transcript:
        return jsonify({"error": "transcript is required"}), 400
    
    try:
        ai_service = AIService()
        result = ai_service.analyze_pronunciation(transcript, expected_text)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e), "pronunciation_score": 0}), 500


@practice_bp.route('/pronunciation-exercise', methods=['GET'])
def get_pronunciation_exercise():
    """
    Get a pronunciation exercise for practice
    Query params: difficulty (easy/medium/hard), focus (optional)
    """
    difficulty = request.args.get('difficulty', 'medium')
    focus_area = request.args.get('focus')
    
    try:
        ai_service = AIService()
        result = ai_service.get_pronunciation_exercise(difficulty, focus_area)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@practice_bp.route('/quick-feedback', methods=['POST'])
def quick_feedback():
    """
    Get quick pronunciation feedback on a single sentence
    For real-time feedback during practice
    """
    data = request.json
    transcript = data.get('transcript')
    
    if not transcript:
        return jsonify({"error": "transcript is required"}), 400
    
    try:
        ai_service = AIService()
        # Quick analysis for single sentences
        result = ai_service.analyze_pronunciation(transcript)
        
        # Extract key info for quick display
        quick_result = {
            "score": result.get('pronunciation_score', 70),
            "clarity": result.get('clarity_score', 70),
            "issues": result.get('problem_sounds', [])[:2],  # Top 2 issues
            "tip": result.get('improvement_suggestions', ['Keep practicing!'])[0] if result.get('improvement_suggestions') else 'Good job!'
        }
        return jsonify(quick_result)
    except Exception as e:
        return jsonify({"error": str(e), "score": 0}), 500


@practice_bp.route('/upload-audio', methods=['POST'])
def upload_audio():
    """
    Upload audio recording for a practice session
    This allows mentors to later listen to the learner's recordings
    """
    try:
        session_id = request.form.get('session_id')
        audio_file = request.files.get('audio')
        
        if not session_id or not audio_file:
            return jsonify({"error": "session_id and audio file are required"}), 400
        
        # Read audio data
        audio_data = audio_file.read()
        
        # Save to database
        result = practice_service.save_audio_recording(
            int(session_id), 
            audio_data, 
            audio_file.filename or 'recording.webm'
        )
        
        return jsonify({
            "success": True,
            "message": "Audio uploaded successfully",
            "session_id": session_id
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@practice_bp.route('/sessions/<int:session_id>/audio', methods=['GET'])
def get_session_audio(session_id):
    """
    Get audio recording for a session (for mentor review)
    """
    from flask import Response
    
    try:
        audio_data = practice_service.get_audio_recording(session_id)
        
        if not audio_data:
            return jsonify({"error": "No audio recording found"}), 404
        
        return Response(
            audio_data,
            mimetype='audio/webm',
            headers={'Content-Disposition': f'inline; filename=session_{session_id}.webm'}
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@practice_bp.route('/sessions/mentor/<int:mentor_id>', methods=['GET'])
def get_mentor_sessions(mentor_id):
    """
    Get all practice sessions for mentors to review
    Returns sessions with learner info, topic, scores, and audio availability
    """
    try:
        sessions = practice_service.get_sessions_for_mentor(mentor_id)
        
        return jsonify({
            "sessions": sessions,
            "total": len(sessions)
        })
    except Exception as e:
        return jsonify({"error": str(e), "sessions": []}), 500

