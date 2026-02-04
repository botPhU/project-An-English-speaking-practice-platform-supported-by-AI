"""
Placement Test Model
Database model for storing placement test questions and results
"""

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from infrastructure.databases.mssql import Base


class PlacementQuestionModel(Base):
    """Model for placement test questions"""
    __tablename__ = 'placement_questions'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    question_text = Column(Text, nullable=False)
    question_type = Column(String(50), default='multiple_choice')  # multiple_choice, fill_blank, listening
    category = Column(String(50), nullable=False)  # grammar, vocabulary, reading, listening
    difficulty_level = Column(String(10), nullable=False)  # A1, A2, B1, B2, C1, C2
    points = Column(Integer, default=1)
    
    # For multiple choice
    option_a = Column(Text)
    option_b = Column(Text)
    option_c = Column(Text)
    option_d = Column(Text)
    correct_answer = Column(String(10), nullable=False)  # a, b, c, d or text
    
    # Optional explanation
    explanation = Column(Text)
    
    # Metadata
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    
    def to_dict(self, include_answer=False):
        data = {
            'id': self.id,
            'question_text': self.question_text,
            'question_type': self.question_type,
            'category': self.category,
            'difficulty_level': self.difficulty_level,
            'points': self.points,
            'options': {
                'a': self.option_a,
                'b': self.option_b,
                'c': self.option_c,
                'd': self.option_d
            } if self.option_a else None
        }
        if include_answer:
            data['correct_answer'] = self.correct_answer
            data['explanation'] = self.explanation
        return data


class PlacementTestResultModel(Base):
    """Model for storing user placement test results"""
    __tablename__ = 'placement_test_results'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False)
    
    # Scores by category
    grammar_score = Column(Integer, default=0)
    vocabulary_score = Column(Integer, default=0)
    reading_score = Column(Integer, default=0)
    listening_score = Column(Integer, default=0)
    
    # Overall
    total_score = Column(Integer, default=0)
    max_score = Column(Integer, default=0)
    percentage = Column(Integer, default=0)
    
    # Assigned level
    assigned_level = Column(String(10), nullable=False)  # A1, A2, B1, B2, C1, C2
    
    # Test metadata
    questions_answered = Column(Integer, default=0)
    time_taken_seconds = Column(Integer, default=0)
    completed_at = Column(DateTime, default=func.now())
    
    # Can retake after certain period
    can_retake_after = Column(DateTime)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'scores': {
                'grammar': self.grammar_score,
                'vocabulary': self.vocabulary_score,
                'reading': self.reading_score,
                'listening': self.listening_score,
                'total': self.total_score,
                'max': self.max_score,
                'percentage': self.percentage
            },
            'assigned_level': self.assigned_level,
            'questions_answered': self.questions_answered,
            'time_taken_seconds': self.time_taken_seconds,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }


# Seed data for placement test questions
PLACEMENT_QUESTIONS = [
    # A1 Grammar
    {
        'question_text': 'She _____ a student.',
        'category': 'grammar',
        'difficulty_level': 'A1',
        'option_a': 'is',
        'option_b': 'are',
        'option_c': 'am',
        'option_d': 'be',
        'correct_answer': 'a',
        'points': 1
    },
    {
        'question_text': 'I _____ to school every day.',
        'category': 'grammar',
        'difficulty_level': 'A1',
        'option_a': 'goes',
        'option_b': 'go',
        'option_c': 'going',
        'option_d': 'went',
        'correct_answer': 'b',
        'points': 1
    },
    # A1 Vocabulary
    {
        'question_text': 'What is the opposite of "hot"?',
        'category': 'vocabulary',
        'difficulty_level': 'A1',
        'option_a': 'warm',
        'option_b': 'cool',
        'option_c': 'cold',
        'option_d': 'heat',
        'correct_answer': 'c',
        'points': 1
    },
    # A2 Grammar
    {
        'question_text': 'I _____ to the cinema yesterday.',
        'category': 'grammar',
        'difficulty_level': 'A2',
        'option_a': 'go',
        'option_b': 'goes',
        'option_c': 'went',
        'option_d': 'gone',
        'correct_answer': 'c',
        'points': 2
    },
    {
        'question_text': 'She has _____ finished her homework.',
        'category': 'grammar',
        'difficulty_level': 'A2',
        'option_a': 'yet',
        'option_b': 'already',
        'option_c': 'still',
        'option_d': 'ago',
        'correct_answer': 'b',
        'points': 2
    },
    # A2 Vocabulary
    {
        'question_text': 'My brother works in a hospital. He is a _____.',
        'category': 'vocabulary',
        'difficulty_level': 'A2',
        'option_a': 'teacher',
        'option_b': 'engineer',
        'option_c': 'doctor',
        'option_d': 'chef',
        'correct_answer': 'c',
        'points': 2
    },
    # B1 Grammar
    {
        'question_text': 'If I _____ rich, I would travel the world.',
        'category': 'grammar',
        'difficulty_level': 'B1',
        'option_a': 'am',
        'option_b': 'was',
        'option_c': 'were',
        'option_d': 'be',
        'correct_answer': 'c',
        'points': 3
    },
    {
        'question_text': 'The book _____ by millions of people.',
        'category': 'grammar',
        'difficulty_level': 'B1',
        'option_a': 'has read',
        'option_b': 'has been read',
        'option_c': 'have been read',
        'option_d': 'was reading',
        'correct_answer': 'b',
        'points': 3
    },
    # B1 Reading
    {
        'question_text': '"Despite the rain, they continued the journey." What does "despite" mean?',
        'category': 'reading',
        'difficulty_level': 'B1',
        'option_a': 'because of',
        'option_b': 'in spite of',
        'option_c': 'during',
        'option_d': 'after',
        'correct_answer': 'b',
        'points': 3
    },
    # B2 Grammar
    {
        'question_text': 'Had I known about the problem, I _____ you earlier.',
        'category': 'grammar',
        'difficulty_level': 'B2',
        'option_a': 'would tell',
        'option_b': 'would have told',
        'option_c': 'will tell',
        'option_d': 'told',
        'correct_answer': 'b',
        'points': 4
    },
    {
        'question_text': 'The more you practice, _____ you will become.',
        'category': 'grammar',
        'difficulty_level': 'B2',
        'option_a': 'better',
        'option_b': 'the better',
        'option_c': 'the best',
        'option_d': 'best',
        'correct_answer': 'b',
        'points': 4
    },
    # B2 Vocabulary
    {
        'question_text': 'The company decided to _____ 500 new employees.',
        'category': 'vocabulary',
        'difficulty_level': 'B2',
        'option_a': 'hire',
        'option_b': 'fire',
        'option_c': 'retire',
        'option_d': 'resign',
        'correct_answer': 'a',
        'points': 4
    },
    # C1 Grammar
    {
        'question_text': 'Seldom _____ such a beautiful sunset.',
        'category': 'grammar',
        'difficulty_level': 'C1',
        'option_a': 'I have seen',
        'option_b': 'have I seen',
        'option_c': 'I saw',
        'option_d': 'did I saw',
        'correct_answer': 'b',
        'points': 5
    },
    # C1 Reading
    {
        'question_text': '"The ubiquitous smartphone has transformed communication." What does "ubiquitous" mean?',
        'category': 'reading',
        'difficulty_level': 'C1',
        'option_a': 'expensive',
        'option_b': 'everywhere',
        'option_c': 'modern',
        'option_d': 'useful',
        'correct_answer': 'b',
        'points': 5
    },
]


def calculate_level(percentage):
    """Calculate level based on percentage score"""
    if percentage >= 90:
        return 'C1'
    elif percentage >= 75:
        return 'B2'
    elif percentage >= 60:
        return 'B1'
    elif percentage >= 45:
        return 'A2'
    else:
        return 'A1'


# Speaking assessment prompts
SPEAKING_PROMPTS = [
    {
        'id': 1,
        'level': 'A1-A2',
        'prompt': 'Please introduce yourself. Tell me your name, where you are from, and what you do.',
        'prompt_vi': 'Hãy giới thiệu về bản thân bạn. Cho tôi biết tên, quê quán và công việc của bạn.',
        'duration_seconds': 60,
        'criteria': ['pronunciation', 'vocabulary', 'fluency', 'grammar'],
        'sample_answer': 'Hello, my name is [Name]. I am from Vietnam. I am a student/worker.'
    },
    {
        'id': 2,
        'level': 'A2-B1',
        'prompt': 'Describe your daily routine. What do you usually do from morning to evening?',
        'prompt_vi': 'Mô tả thói quen hàng ngày của bạn. Bạn thường làm gì từ sáng đến tối?',
        'duration_seconds': 90,
        'criteria': ['pronunciation', 'vocabulary', 'fluency', 'grammar', 'coherence'],
        'sample_answer': 'I usually wake up at 7 AM. Then I have breakfast and go to school/work...'
    },
    {
        'id': 3,
        'level': 'B1-B2',
        'prompt': 'Tell me about a memorable trip or experience you have had. Where did you go and what happened?',
        'prompt_vi': 'Kể về một chuyến đi hoặc trải nghiệm đáng nhớ của bạn. Bạn đã đi đâu và chuyện gì đã xảy ra?',
        'duration_seconds': 120,
        'criteria': ['pronunciation', 'vocabulary', 'fluency', 'grammar', 'coherence', 'detail'],
        'sample_answer': 'Last year, I went to Da Nang with my family. It was an amazing experience...'
    }
]


# AI Grading prompt template
AI_SPEAKING_GRADING_PROMPT = """
You are an English language assessment expert. Evaluate the following speaking response and provide scores.

## Speaking Prompt:
{prompt}

## Learner's Transcription:
{transcription}

## Evaluation Criteria:
1. **Pronunciation** (0-100): Clarity of speech, correct stress and intonation
2. **Vocabulary** (0-100): Range and appropriateness of vocabulary used
3. **Grammar** (0-100): Accuracy of grammar structures
4. **Fluency** (0-100): Smoothness and natural flow of speech
5. **Coherence** (0-100): Logical organization and connection of ideas

## Response Format (JSON):
{{
    "pronunciation_score": <0-100>,
    "vocabulary_score": <0-100>,
    "grammar_score": <0-100>,
    "fluency_score": <0-100>,
    "coherence_score": <0-100>,
    "overall_score": <0-100>,
    "estimated_level": "<A1|A2|B1|B2|C1|C2>",
    "feedback": "<constructive feedback in Vietnamese>",
    "strengths": ["<strength 1>", "<strength 2>"],
    "improvements": ["<area to improve 1>", "<area to improve 2>"]
}}

Provide your evaluation:
"""


class SpeakingScoreModel:
    """Model for storing speaking assessment results"""
    pass  # Will be integrated with PlacementTestResultModel

