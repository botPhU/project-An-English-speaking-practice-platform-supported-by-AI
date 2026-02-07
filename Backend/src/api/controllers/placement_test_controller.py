"""
Placement Test Controller
API endpoints for placement test functionality
"""

from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from infrastructure.databases.mssql import get_db_session
from infrastructure.models.placement_test_model import (
    PlacementQuestionModel, 
    PlacementTestResultModel,
    PLACEMENT_QUESTIONS,
    calculate_level
)
import random

placement_test_bp = Blueprint('placement_test', __name__, url_prefix='/api/placement-test')


@placement_test_bp.route('/questions', methods=['GET'])
def get_test_questions():
    """Get placement test questions for a user"""
    try:
        user_id = request.args.get('user_id', type=int)
        
        with get_db_session() as session:
            # Check if user already completed the test
            existing_result = session.query(PlacementTestResultModel).filter_by(
                user_id=user_id
            ).order_by(PlacementTestResultModel.completed_at.desc()).first()
            
            if existing_result:
                # Check if can retake
                if existing_result.can_retake_after and datetime.now() < existing_result.can_retake_after:
                    return jsonify({
                        'can_take_test': False,
                        'message': 'You have already completed the placement test',
                        'existing_result': existing_result.to_dict(),
                        'can_retake_after': existing_result.can_retake_after.isoformat()
                    }), 200
            
            # Get questions from database or use seed data
            questions = session.query(PlacementQuestionModel).filter_by(
                is_active=True
            ).all()
            
            if questions:
                question_list = [q.to_dict(include_answer=False) for q in questions]
            else:
                # Use seed data if no questions in database
                question_list = [{
                    'id': idx + 1,
                    'question_text': q['question_text'],
                    'question_type': 'multiple_choice',
                    'category': q['category'],
                    'difficulty_level': q['difficulty_level'],
                    'points': q['points'],
                    'options': {
                        'a': q['option_a'],
                        'b': q['option_b'],
                        'c': q['option_c'],
                        'd': q['option_d']
                    }
                } for idx, q in enumerate(PLACEMENT_QUESTIONS)]
            
            # Shuffle and limit questions
            random.shuffle(question_list)
            
            return jsonify({
                'can_take_test': True,
                'questions': question_list[:15],  # Max 15 questions
                'time_limit_minutes': 20,
                'total_questions': len(question_list[:15])
            }), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@placement_test_bp.route('/submit', methods=['POST'])
def submit_test():
    """Submit placement test answers and get result"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        answers = data.get('answers', {})  # {question_id: answer}
        time_taken = data.get('time_taken_seconds', 0)
        
        if not user_id or not answers:
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Calculate scores
        scores = {
            'grammar': 0,
            'vocabulary': 0,
            'reading': 0,
            'listening': 0
        }
        total_score = 0
        max_score = 0
        
        # Use seed data for answer checking
        for q in PLACEMENT_QUESTIONS:
            q_id = str(PLACEMENT_QUESTIONS.index(q) + 1)
            if q_id in answers:
                max_score += q['points']
                if answers[q_id].lower() == q['correct_answer'].lower():
                    total_score += q['points']
                    scores[q['category']] = scores.get(q['category'], 0) + q['points']
        
        # Calculate percentage and level
        percentage = int((total_score / max_score * 100)) if max_score > 0 else 0
        assigned_level = calculate_level(percentage)
        
        with get_db_session() as session:
            # Save result
            result = PlacementTestResultModel(
                user_id=user_id,
                grammar_score=scores.get('grammar', 0),
                vocabulary_score=scores.get('vocabulary', 0),
                reading_score=scores.get('reading', 0),
                listening_score=scores.get('listening', 0),
                total_score=total_score,
                max_score=max_score,
                percentage=percentage,
                assigned_level=assigned_level,
                questions_answered=len(answers),
                time_taken_seconds=time_taken,
                can_retake_after=datetime.now() + timedelta(days=30)  # Can retake after 30 days
            )
            session.add(result)
            
            # Update user's level in profile (if applicable)
            # This would update the user's skill level
            
            session.commit()
            
            return jsonify({
                'success': True,
                'result': {
                    'total_score': total_score,
                    'max_score': max_score,
                    'percentage': percentage,
                    'assigned_level': assigned_level,
                    'scores': scores,
                    'time_taken_seconds': time_taken,
                    'level_description': get_level_description(assigned_level)
                }
            }), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@placement_test_bp.route('/result/<int:user_id>', methods=['GET'])
def get_test_result(user_id):
    """Get user's placement test result"""
    try:
        with get_db_session() as session:
            result = session.query(PlacementTestResultModel).filter_by(
                user_id=user_id
            ).order_by(PlacementTestResultModel.completed_at.desc()).first()
            
            if not result:
                return jsonify({
                    'has_result': False,
                    'message': 'No placement test result found'
                }), 200
            
            return jsonify({
                'has_result': True,
                'result': result.to_dict(),
                'level_description': get_level_description(result.assigned_level)
            }), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@placement_test_bp.route('/check-status/<int:user_id>', methods=['GET'])
def check_test_status(user_id):
    """Check if user needs to take placement test"""
    try:
        with get_db_session() as session:
            result = session.query(PlacementTestResultModel).filter_by(
                user_id=user_id
            ).first()
            
            return jsonify({
                'needs_test': result is None,
                'has_completed': result is not None,
                'current_level': result.assigned_level if result else None
            }), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def get_level_description(level):
    """Get CEFR level description"""
    descriptions = {
        'A1': {
            'name': 'Beginner',
            'name_vi': 'Người mới bắt đầu',
            'description': 'Có thể hiểu và sử dụng các cụm từ đơn giản hàng ngày'
        },
        'A2': {
            'name': 'Elementary',
            'name_vi': 'Sơ cấp',
            'description': 'Có thể giao tiếp trong các tình huống đơn giản và quen thuộc'
        },
        'B1': {
            'name': 'Intermediate',
            'name_vi': 'Trung cấp',
            'description': 'Có thể xử lý hầu hết các tình huống khi đi du lịch'
        },
        'B2': {
            'name': 'Upper Intermediate',
            'name_vi': 'Trung cấp cao',
            'description': 'Có thể tương tác với độ lưu loát và tự nhiên'
        },
        'C1': {
            'name': 'Advanced',
            'name_vi': 'Nâng cao',
            'description': 'Có thể sử dụng ngôn ngữ linh hoạt và hiệu quả'
        },
        'C2': {
            'name': 'Proficient',
            'name_vi': 'Thành thạo',
            'description': 'Có thể hiểu dễ dàng mọi thứ nghe hoặc đọc được'
        }
    }
    return descriptions.get(level, descriptions['A1'])


# ============= SPEAKING ASSESSMENT ENDPOINTS =============

from infrastructure.models.placement_test_model import SPEAKING_PROMPTS, AI_SPEAKING_GRADING_PROMPT
import json


@placement_test_bp.route('/speaking/prompts', methods=['GET'])
def get_speaking_prompts():
    """Get speaking prompts for placement test"""
    return jsonify({
        'prompts': SPEAKING_PROMPTS,
        'total_prompts': len(SPEAKING_PROMPTS),
        'instructions': {
            'vi': 'Bạn sẽ trả lời 3 câu hỏi nói. Hãy nói rõ ràng và tự nhiên nhất có thể.',
            'en': 'You will answer 3 speaking questions. Speak clearly and as naturally as possible.'
        }
    }), 200


@placement_test_bp.route('/speaking/evaluate', methods=['POST'])
def evaluate_speaking():
    """
    Evaluate speaking response using AI
    Expects: user_id, prompt_id, transcription (text from speech-to-text)
    """
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        prompt_id = data.get('prompt_id')
        transcription = data.get('transcription', '')
        audio_duration = data.get('audio_duration', 0)
        
        if not user_id or not prompt_id or not transcription:
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Find the prompt
        prompt = next((p for p in SPEAKING_PROMPTS if p['id'] == prompt_id), None)
        if not prompt:
            return jsonify({'error': 'Invalid prompt_id'}), 400
        
        # Prepare AI grading request
        grading_prompt = AI_SPEAKING_GRADING_PROMPT.format(
            prompt=prompt['prompt'],
            transcription=transcription
        )
        
        # Call AI service for real evaluation
        ai_evaluation = evaluate_with_ai(transcription, prompt)
        
        return jsonify({
            'success': True,
            'evaluation': ai_evaluation,
            'prompt': prompt['prompt'],
            'transcription': transcription,
            'audio_duration': audio_duration
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@placement_test_bp.route('/speaking/submit-all', methods=['POST'])
def submit_speaking_assessment():
    """
    Submit all speaking responses and get final assessment
    Combines written test + speaking test for final level
    """
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        speaking_results = data.get('speaking_results', [])
        written_percentage = data.get('written_percentage', 0)
        
        if not user_id or not speaking_results:
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Calculate average speaking score
        total_speaking_score = 0
        for result in speaking_results:
            total_speaking_score += result.get('overall_score', 0)
        
        avg_speaking_score = total_speaking_score / len(speaking_results) if speaking_results else 0
        
        # Combine written (40%) + speaking (60%) for final score
        final_score = (written_percentage * 0.4) + (avg_speaking_score * 0.6)
        final_level = calculate_level(final_score)
        
        # Calculate speaking subscores
        subscores = {
            'pronunciation': sum(r.get('pronunciation_score', 0) for r in speaking_results) / len(speaking_results),
            'vocabulary': sum(r.get('vocabulary_score', 0) for r in speaking_results) / len(speaking_results),
            'grammar': sum(r.get('grammar_score', 0) for r in speaking_results) / len(speaking_results),
            'fluency': sum(r.get('fluency_score', 0) for r in speaking_results) / len(speaking_results),
            'coherence': sum(r.get('coherence_score', 0) for r in speaking_results) / len(speaking_results),
        }
        
        return jsonify({
            'success': True,
            'result': {
                'written_score': written_percentage,
                'speaking_score': avg_speaking_score,
                'final_score': round(final_score, 1),
                'final_level': final_level,
                'speaking_subscores': subscores,
                'level_description': get_level_description(final_level),
                'feedback': generate_feedback(subscores, final_level)
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def evaluate_with_ai(transcription: str, prompt: dict) -> dict:
    """
    AI evaluation for speaking assessment using Gemini
    Evaluates transcription based on 5 criteria
    """
    from services.ai_service import AIService
    import json
    import re
    
    # If transcription is too short or empty, return low scores
    word_count = len(transcription.split())
    if word_count < 3:
        return {
            'pronunciation_score': 30,
            'vocabulary_score': 30,
            'grammar_score': 30,
            'fluency_score': 30,
            'coherence_score': 30,
            'overall_score': 30,
            'estimated_level': 'A1',
            'feedback': 'Bạn cần nói nhiều hơn để được đánh giá chính xác.',
            'strengths': [],
            'improvements': ['Hãy nói ít nhất 3-5 câu để trả lời câu hỏi']
        }
    
    try:
        ai_service = AIService()
        
        grading_prompt = f'''
You are an expert English speaking examiner. Evaluate the following speaking response.

**Question asked:** {prompt['prompt']}
**Student's response (transcription):** {transcription}

Evaluate the response based on these 5 criteria (score 0-100 for each):

1. **Pronunciation**: Clarity of speech, word stress, intonation
2. **Vocabulary**: Range and accuracy of vocabulary used
3. **Grammar**: Grammatical accuracy and complexity
4. **Fluency**: Smoothness, pace, natural flow
5. **Coherence**: Logical organization, relevance to question

Consider:
- Word count: {word_count} words
- Topic relevance to the question

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{{
    "pronunciation_score": <int 0-100>,
    "vocabulary_score": <int 0-100>,
    "grammar_score": <int 0-100>,
    "fluency_score": <int 0-100>,
    "coherence_score": <int 0-100>,
    "overall_score": <int 0-100>,
    "estimated_level": "<A1|A2|B1|B2|C1|C2>",
    "feedback": "<feedback in Vietnamese, 1-2 sentences>",
    "strengths": ["<strength 1 in Vietnamese>", "<strength 2 in Vietnamese>"],
    "improvements": ["<improvement 1 in Vietnamese>", "<improvement 2 in Vietnamese>"]
}}
'''
        
        response = ai_service._safe_generate(grading_prompt)
        
        if response and response.text:
            # Extract JSON from response
            text = response.text.strip()
            # Remove markdown code blocks if present
            if '```json' in text:
                text = text.split('```json')[1].split('```')[0]
            elif '```' in text:
                text = text.split('```')[1].split('```')[0]
            
            # Parse JSON
            result = json.loads(text.strip())
            
            # Validate and ensure all fields exist
            required_fields = ['pronunciation_score', 'vocabulary_score', 'grammar_score', 
                             'fluency_score', 'coherence_score', 'overall_score']
            for field in required_fields:
                if field not in result:
                    result[field] = 50
                result[field] = max(0, min(100, int(result[field])))
            
            if 'estimated_level' not in result:
                overall = result.get('overall_score', 50)
                if overall >= 85: result['estimated_level'] = 'C1'
                elif overall >= 70: result['estimated_level'] = 'B2'
                elif overall >= 55: result['estimated_level'] = 'B1'
                elif overall >= 40: result['estimated_level'] = 'A2'
                else: result['estimated_level'] = 'A1'
            
            if 'feedback' not in result:
                result['feedback'] = 'Bạn đã hoàn thành câu trả lời.'
            if 'strengths' not in result:
                result['strengths'] = []
            if 'improvements' not in result:
                result['improvements'] = []
                
            return result
            
    except json.JSONDecodeError as e:
        print(f"JSON parse error: {e}")
    except Exception as e:
        print(f"AI evaluation error: {e}")
    
    # Fallback: Simple heuristic if AI fails
    base_score = min(50 + (word_count * 2), 85)
    return {
        'pronunciation_score': base_score,
        'vocabulary_score': base_score - 5,
        'grammar_score': base_score,
        'fluency_score': base_score - 3,
        'coherence_score': base_score,
        'overall_score': base_score,
        'estimated_level': 'B1' if base_score >= 60 else 'A2',
        'feedback': 'Không thể kết nối AI để đánh giá chi tiết. Điểm được tính dựa trên độ dài câu trả lời.',
        'strengths': ['Đã hoàn thành câu trả lời'],
        'improvements': ['Hãy thử lại khi kết nối ổn định hơn']
    }


def generate_feedback(subscores: dict, level: str) -> dict:
    """Generate personalized feedback based on scores"""
    
    weakest = min(subscores, key=subscores.get)
    strongest = max(subscores, key=subscores.get)
    
    feedback_map = {
        'pronunciation': {
            'weak': 'Bạn nên luyện phát âm nhiều hơn, đặc biệt là các âm /θ/, /ð/, /r/.',
            'strong': 'Phát âm của bạn rất tốt! Tiếp tục duy trì.'
        },
        'vocabulary': {
            'weak': 'Hãy mở rộng vốn từ vựng bằng cách đọc sách và xem phim tiếng Anh.',
            'strong': 'Vốn từ vựng của bạn phong phú. Rất tốt!'
        },
        'grammar': {
            'weak': 'Cần ôn lại ngữ pháp cơ bản, đặc biệt là thì động từ.',
            'strong': 'Ngữ pháp của bạn khá chính xác.'
        },
        'fluency': {
            'weak': 'Hãy luyện nói nhiều hơn để tăng độ trôi chảy.',
            'strong': 'Bạn nói rất trôi chảy và tự nhiên.'
        },
        'coherence': {
            'weak': 'Hãy sắp xếp ý tưởng logic hơn khi nói.',
            'strong': 'Cách trình bày ý tưởng của bạn rất mạch lạc.'
        }
    }
    
    return {
        'overall': f'Trình độ của bạn được đánh giá là {level}.',
        'strength': feedback_map.get(strongest, {}).get('strong', ''),
        'improvement': feedback_map.get(weakest, {}).get('weak', ''),
        'recommended_focus': weakest,
        'next_steps': [
            'Luyện nói hàng ngày với AI tutor',
            'Tham gia các buổi luyện nói với mentor',
            f'Tập trung cải thiện {weakest}'
        ]
    }

