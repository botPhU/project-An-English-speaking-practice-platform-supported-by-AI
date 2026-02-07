"""
Mentor Content Service
Business logic for mentor teaching content - Real Database Implementation
"""
from datetime import datetime
import json
from infrastructure.databases.mssql import get_db_session
from infrastructure.models.user_model import UserModel
from infrastructure.models.mentor_content_models import (
    ConfidenceTechniqueModel, ExpressionTipModel, GrammarErrorModel,
    PronunciationErrorModel, VocabularyItemModel, IdiomModel,
    ConversationScenarioModel, RealLifeSituationModel, LearnerActivityAssignmentModel
)


class MentorContentService:
    """Service for managing mentor teaching content"""

    # ==================== CONFIDENCE BUILDING ====================

    def get_confidence_techniques(self):
        """Get confidence building techniques from database"""
        try:
            with get_db_session() as session:
                techniques = session.query(ConfidenceTechniqueModel)\
                    .filter_by(is_active=True).all()
                
                result = []
                for t in techniques:
                    tips = []
                    if t.tips:
                        try:
                            tips = json.loads(t.tips)
                        except json.JSONDecodeError:
                            tips = [t.tips]
                    
                    result.append({
                        'id': t.id,
                        'title': t.title,
                        'icon': t.icon,
                        'description': t.description,
                        'category': t.category,
                        'difficulty': t.difficulty,
                        'tips': tips
                    })
                return result
        except Exception as e:
            print(f"Get confidence techniques error: {e}")
            return []

    def get_confidence_activities(self):
        """Get confidence building activities from database"""
        try:
            with get_db_session() as session:
                # Using ConversationScenarioModel for activities
                activities = session.query(ConversationScenarioModel)\
                    .filter_by(is_active=True, category='confidence').all()
                
                return [{
                    'id': a.id,
                    'name': a.title,
                    'duration': f'{a.duration_minutes} phút',
                    'difficulty': a.difficulty.capitalize() if a.difficulty else 'Easy',
                    'description': a.description
                } for a in activities]
        except Exception as e:
            print(f"Get activities error: {e}")
            return []

    def assign_activity(self, mentor_id, learner_id, activity_id):
        """Assign an activity to a learner"""
        try:
            with get_db_session() as session:
                assignment = LearnerActivityAssignmentModel(
                    mentor_id=mentor_id,
                    learner_id=learner_id,
                    activity_type='confidence',
                    activity_id=activity_id,
                    status='assigned',
                    assigned_at=datetime.now()
                )
                session.add(assignment)
                session.flush()
                return assignment.id
        except Exception as e:
            print(f"Assign activity error: {e}")
            return 0

    def get_learner_confidence_progress(self, learner_id):
        """Get confidence progress for a learner from database"""
        try:
            with get_db_session() as session:
                assignments = session.query(LearnerActivityAssignmentModel)\
                    .filter_by(learner_id=learner_id, activity_type='confidence')\
                    .all()
                
                # Get learner info
                learner = session.query(UserModel).get(learner_id)
                
                return [{
                    'name': learner.full_name if learner else 'Unknown',
                    'total_activities': len(assignments),
                    'completed': len([a for a in assignments if a.status == 'completed']),
                    'avg_score': sum(a.score or 0 for a in assignments if a.score) / max(len([a for a in assignments if a.score]), 1)
                }]
        except Exception as e:
            print(f"Get confidence progress error: {e}")
            return []

    # ==================== CLEAR EXPRESSION ====================

    def get_expression_tips(self):
        """Get tips for clear expression from database"""
        try:
            with get_db_session() as session:
                tips = session.query(ExpressionTipModel)\
                    .filter_by(is_active=True).all()
                
                return [{
                    'id': t.id,
                    'category': t.category,
                    'tip': t.title,
                    'example': t.example or ''
                } for t in tips]
        except Exception as e:
            print(f"Get expression tips error: {e}")
            return []

    def get_expression_exercises(self, level='all'):
        """Get expression exercises from database"""
        try:
            with get_db_session() as session:
                query = session.query(ConversationScenarioModel)\
                    .filter_by(is_active=True, category='expression')
                
                if level != 'all':
                    query = query.filter_by(difficulty=level)
                
                exercises = query.all()
                
                return [{
                    'id': e.id,
                    'name': e.title,
                    'level': e.difficulty,
                    'time': f'{e.duration_minutes} min'
                } for e in exercises]
        except Exception as e:
            print(f"Get expression exercises error: {e}")
            return []

    def save_expression_feedback(self, data):
        """Save expression feedback"""
        try:
            with get_db_session() as session:
                assignment = LearnerActivityAssignmentModel(
                    mentor_id=data.get('mentor_id'),
                    learner_id=data.get('learner_id'),
                    activity_type='expression',
                    activity_id=data.get('exercise_id'),
                    status='completed',
                    notes=data.get('feedback'),
                    score=data.get('score'),
                    assigned_at=datetime.now(),
                    completed_at=datetime.now()
                )
                session.add(assignment)
                session.flush()
                return assignment.id
        except Exception as e:
            print(f"Save expression feedback error: {e}")
            return 0

    # ==================== GRAMMAR CORRECTION ====================

    def get_common_grammar_errors(self):
        """Get common grammar errors from database"""
        try:
            with get_db_session() as session:
                errors = session.query(GrammarErrorModel)\
                    .filter_by(is_active=True).all()
                
                return [{
                    'id': e.id,
                    'type': e.title,
                    'example_wrong': e.error_pattern,
                    'example_correct': e.correct_pattern,
                    'frequency': e.frequency
                } for e in errors]
        except Exception as e:
            print(f"Get grammar errors error: {e}")
            return []

    def analyze_grammar(self, text):
        """Analyze text for grammar errors"""
        # This would integrate with a grammar checking API
        return {
            'original_text': text,
            'errors': [],
            'suggestions': [],
            'score': 85
        }

    def get_learner_grammar_history(self, learner_id):
        """Get grammar error history for a learner from database"""
        try:
            with get_db_session() as session:
                from sqlalchemy import func
                
                assignments = session.query(LearnerActivityAssignmentModel)\
                    .filter_by(learner_id=learner_id, activity_type='grammar')\
                    .all()
                
                return {
                    'learner_id': learner_id,
                    'total_sessions': len(assignments),
                    'avg_score': sum(a.score or 0 for a in assignments if a.score) / max(len([a for a in assignments if a.score]), 1),
                    'common_errors': [],
                    'improvement_rate': '+0%'
                }
        except Exception as e:
            print(f"Get grammar history error: {e}")
            return {'learner_id': learner_id, 'total_errors': 0}

    # ==================== PRONUNCIATION ====================

    def get_common_pronunciation_errors(self):
        """Get common pronunciation errors for Vietnamese learners from database"""
        try:
            with get_db_session() as session:
                errors = session.query(PronunciationErrorModel)\
                    .filter_by(is_active=True).all()
                
                return [{
                    'id': e.id,
                    'sound': e.sound,
                    'common_mistake': e.common_mistake,
                    'correct_way': e.correct_way,
                    'words': [e.word_example] if e.word_example else [],
                    'tips': e.tips
                } for e in errors]
        except Exception as e:
            print(f"Get pronunciation errors error: {e}")
            return []

    def get_ipa_guide(self):
        """Get IPA pronunciation guide - static data, could be moved to DB"""
        return {
            'vowels': [
                {'symbol': '/iː/', 'example': 'see', 'vietnamese_hint': 'như "i" kéo dài'},
                {'symbol': '/ɪ/', 'example': 'bit', 'vietnamese_hint': 'như "i" ngắn'},
                {'symbol': '/e/', 'example': 'bed', 'vietnamese_hint': 'như "e"'},
                {'symbol': '/æ/', 'example': 'cat', 'vietnamese_hint': 'giữa "e" và "a"'}
            ],
            'consonants': [
                {'symbol': '/θ/', 'example': 'think', 'vietnamese_hint': 'đặt lưỡi giữa hai hàm răng'},
                {'symbol': '/ð/', 'example': 'this', 'vietnamese_hint': 'như /θ/ nhưng có tiếng'}
            ]
        }

    # ==================== VOCABULARY ====================

    def get_collocations(self, category='all'):
        """Get common collocations from database"""
        try:
            with get_db_session() as session:
                query = session.query(VocabularyItemModel)\
                    .filter_by(is_active=True)
                
                if category != 'all':
                    query = query.filter_by(category=category)
                
                items = query.all()
                
                result = []
                for v in items:
                    collocations = []
                    if v.collocations:
                        try:
                            collocations = json.loads(v.collocations)
                        except json.JSONDecodeError:
                            collocations = []
                    
                    for col in collocations:
                        result.append({
                            'id': v.id,
                            'phrase': col,
                            'category': v.category,
                            'meaning': v.meaning_vi
                        })
                return result
        except Exception as e:
            print(f"Get collocations error: {e}")
            return []

    def get_idioms(self, level='all'):
        """Get idioms from database"""
        try:
            with get_db_session() as session:
                query = session.query(IdiomModel).filter_by(is_active=True)
                
                if level != 'all':
                    query = query.filter_by(difficulty=level)
                
                idioms = query.all()
                
                return [{
                    'id': i.id,
                    'idiom': i.phrase,
                    'meaning': i.meaning_vi,
                    'level': i.difficulty,
                    'example': i.example
                } for i in idioms]
        except Exception as e:
            print(f"Get idioms error: {e}")
            return []

    def get_common_word_mistakes(self):
        """Get common word usage mistakes from database"""
        try:
            with get_db_session() as session:
                items = session.query(VocabularyItemModel)\
                    .filter_by(is_active=True, category='confused_words').all()
                
                result = []
                for v in items:
                    synonyms = []
                    if v.synonyms:
                        try:
                            synonyms = json.loads(v.synonyms)
                        except json.JSONDecodeError:
                            synonyms = []
                    
                    result.append({
                        'id': v.id,
                        'confused_words': synonyms,
                        'rule': v.meaning_vi,
                        'examples': [v.example] if v.example else []
                    })
                return result
        except Exception as e:
            print(f"Get word mistakes error: {e}")
            return []

    # ==================== CONVERSATION TOPICS ====================

    def get_topic_categories(self):
        """Get conversation topic categories from database"""
        try:
            with get_db_session() as session:
                from sqlalchemy import func
                
                categories = session.query(
                    ConversationScenarioModel.category,
                    func.count(ConversationScenarioModel.id).label('count')
                ).filter_by(is_active=True)\
                 .group_by(ConversationScenarioModel.category)\
                 .all()
                
                icons = {'daily': 'home', 'travel': 'flight', 'business': 'business', 
                         'culture': 'public', 'technology': 'computer', 'health': 'local_hospital'}
                
                return [{
                    'id': idx + 1,
                    'name': cat[0] or 'General',
                    'icon': icons.get(cat[0], 'folder'),
                    'count': cat[1]
                } for idx, cat in enumerate(categories)]
        except Exception as e:
            print(f"Get topic categories error: {e}")
            return []

    def get_scenarios_by_category(self, category):
        """Get scenarios for a category from database"""
        try:
            with get_db_session() as session:
                scenarios = session.query(ConversationScenarioModel)\
                    .filter_by(is_active=True, category=category.lower())\
                    .all()
                
                return [{
                    'id': s.id,
                    'title': s.title,
                    'difficulty': s.difficulty,
                    'description': s.description,
                    'duration': s.duration_minutes
                } for s in scenarios]
        except Exception as e:
            print(f"Get scenarios error: {e}")
            return []

    def assign_topic(self, data):
        """Assign a topic to a learner"""
        try:
            with get_db_session() as session:
                assignment = LearnerActivityAssignmentModel(
                    mentor_id=data.get('mentor_id'),
                    learner_id=data.get('learner_id'),
                    activity_type='conversation',
                    activity_id=data.get('topic_id'),
                    status='assigned',
                    notes=data.get('notes'),
                    assigned_at=datetime.now()
                )
                session.add(assignment)
                session.flush()
                return assignment.id
        except Exception as e:
            print(f"Assign topic error: {e}")
            return 0

    # ==================== REAL LIFE SITUATIONS ====================

    def get_real_life_situations(self, category='all'):
        """Get real life situations from database"""
        try:
            with get_db_session() as session:
                query = session.query(RealLifeSituationModel)\
                    .filter_by(is_active=True)
                
                if category != 'all':
                    query = query.filter_by(category=category)
                
                situations = query.all()
                
                return [{
                    'id': s.id,
                    'title': s.title,
                    'category': s.category,
                    'difficulty': s.difficulty,
                    'description': s.description,
                    'icon': s.icon
                } for s in situations]
        except Exception as e:
            print(f"Get situations error: {e}")
            return []

    def get_situation_scripts(self, situation_id):
        """Get practice scripts for a situation from database"""
        try:
            with get_db_session() as session:
                situation = session.query(RealLifeSituationModel).get(situation_id)
                
                if not situation:
                    return []
                
                scripts = []
                if situation.scripts:
                    try:
                        scripts = json.loads(situation.scripts)
                    except json.JSONDecodeError:
                        scripts = []
                
                return scripts
        except Exception as e:
            print(f"Get situation scripts error: {e}")
            return []
