"""
Mentor Content Models
Database models for mentor teaching content
"""
from sqlalchemy import Column, Integer, String, Boolean, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from infrastructure.databases.mssql import Base
from datetime import datetime


class ConfidenceTechniqueModel(Base):
    """Model for confidence building techniques"""
    __tablename__ = 'confidence_techniques'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    icon = Column(String(50))
    category = Column(String(100))
    difficulty = Column(String(50), default='beginner')
    steps = Column(Text)  # JSON string of steps
    tips = Column(Text)  # JSON string of tips
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.now)


class ExpressionTipModel(Base):
    """Model for expression tips"""
    __tablename__ = 'expression_tips'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    example = Column(Text)
    category = Column(String(100))  # clarity, tone, structure
    difficulty = Column(String(50))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.now)


class GrammarErrorModel(Base):
    """Model for common grammar errors"""
    __tablename__ = 'grammar_errors'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    error_pattern = Column(Text)  # Incorrect usage
    correct_pattern = Column(Text)  # Correct usage
    explanation = Column(Text)
    category = Column(String(100))  # tense, article, preposition, etc.
    frequency = Column(String(50))  # common, very_common, occasional
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.now)


class PronunciationErrorModel(Base):
    """Model for pronunciation errors"""
    __tablename__ = 'pronunciation_errors'

    id = Column(Integer, primary_key=True, autoincrement=True)
    sound = Column(String(50), nullable=False)  # IPA sound
    word_example = Column(String(255))
    common_mistake = Column(Text)
    correct_way = Column(Text)
    tips = Column(Text)
    audio_url = Column(String(500))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.now)


class VocabularyItemModel(Base):
    """Model for vocabulary items"""
    __tablename__ = 'vocabulary_items'

    id = Column(Integer, primary_key=True, autoincrement=True)
    word = Column(String(255), nullable=False)
    meaning_vi = Column(Text)
    meaning_en = Column(Text)
    part_of_speech = Column(String(50))
    pronunciation = Column(String(255))
    example = Column(Text)
    collocations = Column(Text)  # JSON array
    synonyms = Column(Text)  # JSON array
    category = Column(String(100))
    difficulty = Column(String(50))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.now)


class IdiomModel(Base):
    """Model for idioms"""
    __tablename__ = 'idioms'

    id = Column(Integer, primary_key=True, autoincrement=True)
    phrase = Column(String(500), nullable=False)
    meaning_vi = Column(Text)
    meaning_en = Column(Text)
    example = Column(Text)
    origin = Column(Text)
    category = Column(String(100))
    difficulty = Column(String(50))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.now)


class ConversationScenarioModel(Base):
    """Model for conversation scenarios"""
    __tablename__ = 'conversation_scenarios'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    category = Column(String(100))  # work, travel, daily, academic
    difficulty = Column(String(50))
    context = Column(Text)
    sample_dialog = Column(Text)  # JSON
    key_phrases = Column(Text)  # JSON array
    icon = Column(String(50))
    duration_minutes = Column(Integer, default=10)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.now)


class RealLifeSituationModel(Base):
    """Model for real life situations"""
    __tablename__ = 'real_life_situations'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    category = Column(String(100))
    difficulty = Column(String(50))
    scripts = Column(Text)  # JSON array of dialog scripts
    vocabulary = Column(Text)  # JSON array of key words
    tips = Column(Text)
    icon = Column(String(50))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.now)


class LearnerActivityAssignmentModel(Base):
    """Model for activities assigned to learners"""
    __tablename__ = 'learner_activity_assignments'

    id = Column(Integer, primary_key=True, autoincrement=True)
    mentor_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False)
    learner_id = Column(Integer, ForeignKey('flask_user.id'), nullable=False)
    activity_type = Column(String(100))  # confidence, expression, pronunciation, etc.
    activity_id = Column(Integer)
    status = Column(String(50), default='assigned')  # assigned, in_progress, completed
    notes = Column(Text)
    assigned_at = Column(DateTime, default=datetime.now)
    completed_at = Column(DateTime)
    score = Column(Integer)
    
    mentor = relationship('UserModel', foreign_keys=[mentor_id])
    learner = relationship('UserModel', foreign_keys=[learner_id])
