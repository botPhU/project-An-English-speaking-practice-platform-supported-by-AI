"""
Topic Service for AESP Platform
Business logic for managing conversation topics and scenarios
"""

from datetime import datetime
from typing import List, Optional, Dict, Any

from infrastructure.databases.mssql import session, get_db_session


class TopicService:
    """Service for managing topics and scenarios"""
    
    @staticmethod
    def get_all_topics(
        category: str = None,
        difficulty_level: str = None,
        active_only: bool = True
    ) -> List[Dict[str, Any]]:
        """Get all topics with optional filters from database"""
        try:
            with get_db_session() as db:
                from infrastructure.models.learning_models import TopicModel
                query = db.query(TopicModel)
                
                if active_only:
                    query = query.filter(TopicModel.is_active == True)
                
                if category:
                    query = query.filter(TopicModel.category == category)
                
                if difficulty_level:
                    query = query.filter(TopicModel.difficulty == difficulty_level)
                
                topics = query.order_by(TopicModel.title).all()
                return [{
                    'id': t.id,
                    'name': t.title,
                    'category': t.category,
                    'description': t.description,
                    'difficulty_level': t.difficulty,
                    'is_active': t.is_active
                } for t in topics]
        except Exception as e:
            print(f"Get topics error: {e}")
            return []
    
    @staticmethod
    def get_topic_by_id(topic_id: int) -> Optional[Dict[str, Any]]:
        """Get topic by ID from database"""
        try:
            with get_db_session() as db:
                from infrastructure.models.learning_models import TopicModel
                topic = db.query(TopicModel).filter_by(id=topic_id).first()
                if topic:
                    return {
                        'id': topic.id,
                        'name': topic.title,
                        'category': topic.category,
                        'description': topic.description,
                        'difficulty_level': topic.difficulty,
                        'is_active': topic.is_active
                    }
                return None
        except Exception as e:
            print(f"Get topic error: {e}")
            return None
    
    @staticmethod
    def create_topic(
        name: str,
        category: str = None,
        description: str = None,
        difficulty_level: str = None,
        sample_questions: str = None,
        vocabulary_list: str = None
    ) -> Dict[str, Any]:
        """Create a new topic in database"""
        try:
            with get_db_session() as db:
                from infrastructure.models.learning_models import TopicModel
                topic = TopicModel(
                    title=name,
                    category=category,
                    description=description,
                    difficulty=difficulty_level,
                    is_active=True,
                    created_at=datetime.now()
                )
                db.add(topic)
                db.flush()
                
                return {
                    'id': topic.id,
                    'name': topic.title,
                    'category': topic.category,
                    'description': topic.description,
                    'difficulty_level': topic.difficulty
                }
        except Exception as e:
            print(f"Create topic error: {e}")
            return {'error': str(e)}
    
    @staticmethod
    def update_topic(topic_id: int, **kwargs) -> Optional[Dict[str, Any]]:
        """Update a topic in database"""
        try:
            with get_db_session() as db:
                from infrastructure.models.learning_models import TopicModel
                topic = db.query(TopicModel).filter_by(id=topic_id).first()
                
                if not topic:
                    return None
                
                if 'name' in kwargs and kwargs['name']:
                    topic.title = kwargs['name']
                if 'category' in kwargs and kwargs['category']:
                    topic.category = kwargs['category']
                if 'description' in kwargs and kwargs['description']:
                    topic.description = kwargs['description']
                if 'difficulty_level' in kwargs and kwargs['difficulty_level']:
                    topic.difficulty = kwargs['difficulty_level']
                if 'is_active' in kwargs:
                    topic.is_active = kwargs['is_active']
                
                topic.updated_at = datetime.now()
                
                return {
                    'id': topic.id,
                    'name': topic.title,
                    'category': topic.category,
                    'description': topic.description,
                    'difficulty_level': topic.difficulty,
                    'is_active': topic.is_active
                }
        except Exception as e:
            print(f"Update topic error: {e}")
            return None
    
    @staticmethod
    def delete_topic(topic_id: int) -> bool:
        """Soft delete a topic (set inactive)"""
        try:
            with get_db_session() as db:
                from infrastructure.models.learning_models import TopicModel
                topic = db.query(TopicModel).filter_by(id=topic_id).first()
                
                if topic:
                    topic.is_active = False
                    return True
                return False
        except Exception as e:
            print(f"Delete topic error: {e}")
            return False
    
    # Scenario methods
    @staticmethod
    def get_topic_scenarios(topic_id: int) -> List[Dict[str, Any]]:
        """Get all scenarios for a topic from database"""
        try:
            with get_db_session() as db:
                from infrastructure.models.mentor_content_models import ConversationScenarioModel
                scenarios = db.query(ConversationScenarioModel).filter_by(
                    is_active=True
                ).filter(ConversationScenarioModel.category == str(topic_id)).all()
                
                return [{
                    'id': s.id,
                    'topic_id': topic_id,
                    'name': s.title,
                    'description': s.description,
                    'difficulty_level': s.difficulty,
                    'is_active': s.is_active
                } for s in scenarios]
        except Exception as e:
            print(f"Get scenarios error: {e}")
            return []
    
    @staticmethod
    def get_scenario_by_id(scenario_id: int) -> Optional[Dict[str, Any]]:
        """Get scenario by ID from database"""
        try:
            with get_db_session() as db:
                from infrastructure.models.mentor_content_models import ConversationScenarioModel
                scenario = db.query(ConversationScenarioModel).filter_by(id=scenario_id).first()
                if scenario:
                    return {
                        'id': scenario.id,
                        'name': scenario.title,
                        'description': scenario.description,
                        'difficulty_level': scenario.difficulty,
                        'is_active': scenario.is_active
                    }
                return None
        except Exception as e:
            print(f"Get scenario error: {e}")
            return None
    
    @staticmethod
    def create_scenario(
        topic_id: int,
        name: str,
        description: str = None,
        context: str = None,
        ai_role: str = None,
        user_role: str = None,
        difficulty_level: str = None,
        suggested_vocabulary: str = None,
        sample_dialog: str = None,
        tips: str = None
    ) -> Dict[str, Any]:
        """Create a new scenario in database"""
        try:
            with get_db_session() as db:
                from infrastructure.models.mentor_content_models import ConversationScenarioModel
                import json
                
                scenario = ConversationScenarioModel(
                    title=name,
                    description=description,
                    context=context,
                    category=str(topic_id),
                    difficulty=difficulty_level,
                    key_phrases=json.dumps(suggested_vocabulary.split(',') if suggested_vocabulary else []),
                    sample_dialog=sample_dialog,
                    is_active=True,
                    created_at=datetime.now()
                )
                db.add(scenario)
                db.flush()
                
                return {
                    'id': scenario.id,
                    'topic_id': topic_id,
                    'name': scenario.title,
                    'description': scenario.description
                }
        except Exception as e:
            print(f"Create scenario error: {e}")
            return {'error': str(e)}
    
    @staticmethod
    def get_categories() -> List[str]:
        """Get all unique topic categories from database"""
        try:
            with get_db_session() as db:
                from infrastructure.models.learning_models import TopicModel
                categories = db.query(TopicModel.category).distinct().all()
                return [c[0] for c in categories if c[0]]
        except Exception as e:
            print(f"Get categories error: {e}")
            return []
