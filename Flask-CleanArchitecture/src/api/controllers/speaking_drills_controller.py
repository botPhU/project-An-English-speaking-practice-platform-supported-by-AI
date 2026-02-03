"""
Speaking Drills Controller
AI-powered speaking practice with sentence repetition and conversation modes
"""

from flask import Blueprint, request, jsonify
import json
import re

speaking_drills_bp = Blueprint('speaking_drills', __name__)

# Mock drill sentences (in production, these would be in database)
DRILL_SENTENCES = [
    {"id": 1, "text": "Hello, my name is John.", "level": "A1", "category": "daily"},
    {"id": 2, "text": "How are you today?", "level": "A1", "category": "daily"},
    {"id": 3, "text": "Nice to meet you.", "level": "A1", "category": "daily"},
]

@speaking_drills_bp.route('/sentences', methods=['GET'])
def get_sentences():
    """Get drill sentences filtered by level and category"""
    level = request.args.get('level', 'A1')
    category = request.args.get('category', 'daily')
    
    # Filter sentences
    filtered = [s for s in DRILL_SENTENCES if s['level'] == level and s['category'] == category]
    
    return jsonify({
        'success': True,
        'sentences': filtered,
        'total': len(filtered)
    }), 200


@speaking_drills_bp.route('/evaluate', methods=['POST'])
def evaluate_drill():
    """Evaluate user's pronunciation against expected text"""
    data = request.get_json()
    
    user_id = data.get('user_id')
    expected_text = data.get('expected_text', '')
    user_text = data.get('user_text', '')
    sentence_id = data.get('sentence_id')
    
    if not expected_text or not user_text:
        return jsonify({
            'success': False,
            'error': 'Missing expected_text or user_text'
        }), 400
    
    # Evaluate using AI or heuristics
    result = evaluate_pronunciation(expected_text, user_text)
    
    return jsonify({
        'success': True,
        'result': result,
        'sentence_id': sentence_id
    }), 200


@speaking_drills_bp.route('/conversation/respond', methods=['POST'])
def conversation_respond():
    """Get AI response in conversation mode and evaluate user's speaking"""
    data = request.get_json()
    
    user_id = data.get('user_id')
    user_text = data.get('user_text', '')
    conversation_history = data.get('conversation_history', [])
    topic = data.get('topic', 'General')
    
    if not user_text:
        return jsonify({
            'success': False,
            'error': 'Missing user_text'
        }), 400
    
    # Try to use AI service for response
    try:
        from src.services.ai_service import AIService
        ai_service = AIService()
        
        # Build conversation context
        conv_text = ""
        for msg in conversation_history[-5:]:  # Last 5 messages for context
            role = "AI" if msg.get('role') == 'ai' else "User"
            conv_text += f"{role}: {msg.get('text', '')}\n"
        
        prompt = f'''You are a friendly English conversation partner helping a Vietnamese learner practice speaking.
Topic: {topic}

Previous conversation:
{conv_text}

User just said: "{user_text}"

CRITICAL INSTRUCTIONS - You MUST follow these rules:
1. **DIRECTLY REFERENCE what the user just said** - Start your response by acknowledging or commenting on their specific answer
2. **Build on their answer** - If they mentioned a place, ask about that place. If they mentioned a hobby, ask more about it
3. **Keep the conversation natural** - Your question should flow naturally from what they said
4. **DO NOT ask unrelated questions** - Your follow-up MUST connect to their answer

EXAMPLE of good response:
- User says: "I work as a software developer in Hanoi"
- Good response: "Oh, a software developer! That sounds interesting. What kind of software do you develop?"
- Bad response: "Nice! How old are you?" (unrelated)

EXAMPLE 2:
- User says: "I like playing football on weekends"
- Good response: "Football is a great sport! Do you play with friends or in a team?"
- Bad response: "What do you do for work?" (ignores their answer)

Now create your response following these rules. Keep it simple (A2-B1 level), be encouraging.

Return ONLY a valid JSON object:
{{
    "response": "Your contextual response that DIRECTLY connects to what user said + follow-up question",
    "score": <0-100 based on grammar and relevance>,
    "feedback": "Brief feedback in Vietnamese (1 sentence)",
    "vocabulary_hints": [
        {{"word": "relevant_word", "meaning": "nghĩa tiếng Việt", "pronunciation": "/pronunciation/"}}
    ],
    "sentence_templates": [
        "Template 1 to help user respond...",
        "Template 2 to help user respond..."
    ]
}}

The vocabulary and templates should help the user answer YOUR follow-up question.
'''
        
        response = ai_service._safe_generate(prompt)
        
        if response and response.text:
            text = response.text.strip()
            # Extract JSON
            if '```json' in text:
                text = text.split('```json')[1].split('```')[0]
            elif '```' in text:
                text = text.split('```')[1].split('```')[0]
            
            result = json.loads(text.strip())
            
            return jsonify({
                'success': True,
                'ai_response': result.get('response', "That's interesting! Tell me more."),
                'score': min(100, max(0, result.get('score', 70))),
                'feedback': result.get('feedback', 'Tốt lắm! Tiếp tục nói nhé.'),
                'vocabulary_hints': result.get('vocabulary_hints', []),
                'sentence_templates': result.get('sentence_templates', [])
            }), 200
            
    except Exception as e:
        print(f"AI conversation error: {e}")
    
    # Fallback: Simple response with mock vocabulary
    fallback_data = get_fallback_response(topic, user_text)
    
    return jsonify({
        'success': True,
        'ai_response': fallback_data['response'],
        'score': fallback_data['score'],
        'feedback': fallback_data['feedback'],
        'vocabulary_hints': fallback_data['vocabulary_hints'],
        'sentence_templates': fallback_data['sentence_templates']
    }), 200


def get_fallback_response(topic: str, user_text: str) -> dict:
    """Generate fallback response with vocabulary hints when AI fails"""
    import random
    
    # Topic-specific responses and vocabulary
    topic_data = {
        'Giới thiệu bản thân': {
            'responses': [
                "That's great! Where are you from originally?",
                "Nice to meet you! What do you do for a living?",
                "Interesting! How long have you been learning English?"
            ],
            'vocabulary': [
                {"word": "originally", "meaning": "ban đầu, gốc", "pronunciation": "/əˈrɪdʒənəli/"},
                {"word": "hometown", "meaning": "quê hương", "pronunciation": "/ˈhoʊmtaʊn/"},
                {"word": "currently", "meaning": "hiện tại", "pronunciation": "/ˈkɜːrəntli/"},
                {"word": "occupation", "meaning": "nghề nghiệp", "pronunciation": "/ˌɑːkjuˈpeɪʃn/"}
            ],
            'templates': [
                "I'm from...", 
                "I work as a...", 
                "I've been learning English for..."
            ]
        },
        'Sở thích': {
            'responses': [
                "That sounds fun! How often do you do that?",
                "Interesting hobby! When did you start?",
                "Cool! What do you enjoy most about it?"
            ],
            'vocabulary': [
                {"word": "enjoy", "meaning": "thích thú", "pronunciation": "/ɪnˈdʒɔɪ/"},
                {"word": "passionate", "meaning": "đam mê", "pronunciation": "/ˈpæʃənət/"},
                {"word": "regularly", "meaning": "thường xuyên", "pronunciation": "/ˈreɡjələrli/"},
                {"word": "relaxing", "meaning": "thư giãn", "pronunciation": "/rɪˈlæksɪŋ/"}
            ],
            'templates': [
                "I usually do it...", 
                "I started about... ago", 
                "What I enjoy most is..."
            ]
        },
        'Công việc': {
            'responses': [
                "That's a great job! What do you like about it?",
                "Interesting! What are your main responsibilities?",
                "Cool! How long have you been doing that?"
            ],
            'vocabulary': [
                {"word": "responsibility", "meaning": "trách nhiệm", "pronunciation": "/rɪˌspɑːnsəˈbɪləti/"},
                {"word": "colleague", "meaning": "đồng nghiệp", "pronunciation": "/ˈkɑːliːɡ/"},
                {"word": "challenging", "meaning": "thử thách", "pronunciation": "/ˈtʃælɪndʒɪŋ/"},
                {"word": "rewarding", "meaning": "bổ ích", "pronunciation": "/rɪˈwɔːrdɪŋ/"}
            ],
            'templates': [
                "My main responsibility is...", 
                "I've been working there for...", 
                "What I like most about my job is..."
            ]
        }
    }
    
    # Get topic-specific data or use default
    data = topic_data.get(topic, {
        'responses': [
            "That's interesting! Can you tell me more about that?",
            "I see! And what do you think about it?",
            "Great! How does that make you feel?"
        ],
        'vocabulary': [
            {"word": "think", "meaning": "nghĩ", "pronunciation": "/θɪŋk/"},
            {"word": "believe", "meaning": "tin", "pronunciation": "/bɪˈliːv/"},
            {"word": "opinion", "meaning": "ý kiến", "pronunciation": "/əˈpɪnjən/"},
            {"word": "experience", "meaning": "trải nghiệm", "pronunciation": "/ɪkˈspɪriəns/"}
        ],
        'templates': [
            "I think that...", 
            "In my opinion...", 
            "Well, I would say..."
        ]
    })
    
    return {
        'response': random.choice(data['responses']),
        'score': random.randint(65, 85),
        'feedback': 'Tốt! Tiếp tục luyện tập nhé.',
        'vocabulary_hints': data['vocabulary'],
        'sentence_templates': data['templates']
    }


def evaluate_pronunciation(expected: str, spoken: str) -> dict:
    """
    Evaluate pronunciation accuracy between expected and spoken text
    Returns scores and word-level feedback
    """
    # Clean and tokenize
    expected_words = re.findall(r'\b\w+\b', expected.lower())
    spoken_words = re.findall(r'\b\w+\b', spoken.lower())
    
    # Match words
    word_details = []
    match_count = 0
    
    for word in expected_words:
        # Check if word exists in spoken (with some tolerance)
        found = any(
            word in spoken_word or spoken_word in word or
            levenshtein_similarity(word, spoken_word) > 0.7
            for spoken_word in spoken_words
        )
        if found:
            match_count += 1
            word_details.append({
                'word': word,
                'correct': True
            })
        else:
            word_details.append({
                'word': word,
                'correct': False,
                'suggestion': f'Phát âm "{word}" rõ hơn'
            })
    
    # Calculate scores
    accuracy = round((match_count / len(expected_words)) * 100) if expected_words else 0
    pronunciation = min(accuracy + 5, 100)  # Slightly higher for effort
    fluency = min(accuracy + 10, 100) if len(spoken_words) >= len(expected_words) * 0.7 else accuracy
    
    overall = round(accuracy * 0.4 + pronunciation * 0.4 + fluency * 0.2)
    
    # Generate feedback
    if overall >= 90:
        feedback = "Xuất sắc! Phát âm của bạn rất chuẩn."
    elif overall >= 75:
        feedback = "Tốt lắm! Chỉ cần cải thiện một vài từ."
    elif overall >= 60:
        feedback = "Khá tốt! Hãy luyện thêm các từ được đánh dấu đỏ."
    else:
        feedback = "Cần cải thiện. Hãy nghe mẫu và thử lại nhé."
    
    return {
        'accuracy': accuracy,
        'pronunciation': pronunciation,
        'fluency': fluency,
        'overall': overall,
        'feedback': feedback,
        'word_details': word_details
    }


def levenshtein_similarity(s1: str, s2: str) -> float:
    """Calculate similarity ratio between two strings using Levenshtein distance"""
    if not s1 or not s2:
        return 0.0
    
    len1, len2 = len(s1), len(s2)
    
    if len1 > len2:
        s1, s2 = s2, s1
        len1, len2 = len2, len1
    
    current_row = range(len1 + 1)
    
    for i in range(1, len2 + 1):
        previous_row, current_row = current_row, [i] + [0] * len1
        for j in range(1, len1 + 1):
            add = previous_row[j] + 1
            delete = current_row[j-1] + 1
            change = previous_row[j-1]
            if s1[j-1] != s2[i-1]:
                change += 1
            current_row[j] = min(add, delete, change)
    
    distance = current_row[len1]
    max_len = max(len1, len2)
    
    return 1 - (distance / max_len) if max_len > 0 else 0.0


# ============================================
# SESSION MANAGEMENT ENDPOINTS
# ============================================

@speaking_drills_bp.route('/session/start', methods=['POST'])
def start_session():
    """Start a new speaking practice session"""
    data = request.get_json()
    
    learner_id = data.get('learner_id')
    topic = data.get('topic', 'General')
    mode = data.get('mode', 'conversation')
    starter_text = data.get('starter_text', '')
    
    if not learner_id:
        return jsonify({'success': False, 'error': 'Missing learner_id'}), 400
    
    try:
        from src.infrastructure.models.speaking_session_model import SpeakingSession, SpeakingMessage
        from src.infrastructure.database import db
        
        # Create session
        session = SpeakingSession(
            learner_id=learner_id,
            topic=topic,
            mode=mode,
            is_active=True
        )
        db.session.add(session)
        db.session.flush()  # Get session ID
        
        # Add AI starter message
        if starter_text:
            ai_msg = SpeakingMessage(
                session_id=session.id,
                role='ai',
                text=starter_text
            )
            db.session.add(ai_msg)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'session_id': session.id,
            'message': 'Session started'
        }), 201
        
    except Exception as e:
        print(f"Error starting session: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@speaking_drills_bp.route('/session/<int:session_id>/message', methods=['POST'])
def add_message(session_id):
    """Add a message to an existing session"""
    data = request.get_json()
    
    role = data.get('role')  # 'ai' or 'user'
    text = data.get('text', '')
    score = data.get('score')
    feedback = data.get('feedback')
    audio_url = data.get('audio_url')
    
    if not text:
        return jsonify({'success': False, 'error': 'Missing text'}), 400
    
    try:
        from src.infrastructure.models.speaking_session_model import SpeakingSession, SpeakingMessage
        from src.infrastructure.database import db
        
        session = SpeakingSession.query.get(session_id)
        if not session:
            return jsonify({'success': False, 'error': 'Session not found'}), 404
        
        msg = SpeakingMessage(
            session_id=session_id,
            role=role,
            text=text,
            score=score,
            feedback=feedback,
            audio_url=audio_url
        )
        db.session.add(msg)
        
        # Update session stats
        if role == 'user':
            session.total_turns += 1
            if score:
                # Recalculate average
                user_msgs = SpeakingMessage.query.filter_by(session_id=session_id, role='user').all()
                total_score = sum(m.score or 0 for m in user_msgs) + (score or 0)
                session.average_score = total_score / (len(user_msgs) + 1)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message_id': msg.id
        }), 201
        
    except Exception as e:
        print(f"Error adding message: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@speaking_drills_bp.route('/session/<int:session_id>/end', methods=['POST'])
def end_session(session_id):
    """End an active speaking session"""
    try:
        from src.infrastructure.models.speaking_session_model import SpeakingSession, SpeakingMessage
        from src.infrastructure.database import db
        from datetime import datetime
        
        session = SpeakingSession.query.get(session_id)
        if not session:
            return jsonify({'success': False, 'error': 'Session not found'}), 404
        
        session.is_active = False
        session.ended_at = datetime.utcnow()
        
        # Calculate final average score
        user_msgs = SpeakingMessage.query.filter_by(session_id=session_id, role='user').all()
        if user_msgs:
            total_score = sum(m.score or 0 for m in user_msgs)
            session.average_score = total_score / len(user_msgs)
            session.total_turns = len(user_msgs)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'session': session.to_dict()
        }), 200
        
    except Exception as e:
        print(f"Error ending session: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@speaking_drills_bp.route('/sessions', methods=['GET'])
def get_sessions():
    """Get speaking sessions for mentor (all learners) or learner (own sessions)"""
    user_id = request.args.get('user_id')
    role = request.args.get('role', 'learner')  # 'mentor' to get all, 'learner' for own
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    try:
        from src.infrastructure.models.speaking_session_model import SpeakingSession
        
        query = SpeakingSession.query.filter_by(is_active=False)
        
        if role == 'learner' and user_id:
            query = query.filter_by(learner_id=user_id)
        
        # Order by most recent
        query = query.order_by(SpeakingSession.started_at.desc())
        
        # Paginate
        sessions_page = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'success': True,
            'sessions': [s.to_dict() for s in sessions_page.items],
            'total': sessions_page.total,
            'pages': sessions_page.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        print(f"Error getting sessions: {e}")
        return jsonify({'success': False, 'error': str(e), 'sessions': []}), 200


@speaking_drills_bp.route('/session/<int:session_id>', methods=['GET'])
def get_session(session_id):
    """Get a single session with all messages"""
    try:
        from src.infrastructure.models.speaking_session_model import SpeakingSession
        
        session = SpeakingSession.query.get(session_id)
        if not session:
            return jsonify({'success': False, 'error': 'Session not found'}), 404
        
        return jsonify({
            'success': True,
            'session': session.to_dict()
        }), 200
        
    except Exception as e:
        print(f"Error getting session: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500
