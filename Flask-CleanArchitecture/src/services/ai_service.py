"""
AI Service for English Speaking Practice
Provides conversational AI, pronunciation analysis, and session scoring using Gemini
"""

import google.generativeai as genai
from flask import current_app
import json
import re
import logging

logger = logging.getLogger(__name__)


class AIService:
    _api_keys = []
    _current_key_index = 0
    _initialized = False

    def __init__(self):
        if not AIService._initialized:
            self._setup_keys()
            AIService._initialized = True
        
        self.model = self._get_active_model()

    def _setup_keys(self):
        from config import Config
        try:
            keys = current_app.config.get('GEMINI_API_KEYS') if (current_app and current_app.config.get('GEMINI_API_KEYS')) else Config.GEMINI_API_KEYS
        except Exception:
            keys = Config.GEMINI_API_KEYS
        
        AIService._api_keys = [k for k in keys if k and k != 'YOUR_GEMINI_API_KEY_HERE']
        AIService._current_key_index = 0
        logger.info(f"[AIService] Setup with {len(AIService._api_keys)} API keys")

    def _get_active_model(self):
        """Try to initialize a model using the current API key."""
        if not AIService._api_keys:
            logger.error("[AIService] No API keys available")
            return None

        # Try all keys starting from current
        start_index = AIService._current_key_index
        for i in range(len(AIService._api_keys)):
            idx = (start_index + i) % len(AIService._api_keys)
            AIService._current_key_index = idx
            current_key = AIService._api_keys[idx]
            
            try:
                genai.configure(api_key=current_key)
                # Test the key with available models
                models_to_try = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-pro']
                for model_name in models_to_try:
                    try:
                        m = genai.GenerativeModel(model_name)
                        m.generate_content("ping", generation_config={"max_output_tokens": 1})
                        logger.info(f"[AIService] Successfully using key index {idx} with model {model_name}")
                        return m
                    except Exception as e:
                        if "429" in str(e) or "quota" in str(e).lower():
                            logger.warning(f"[AIService] Quota reached for key index {idx}")
                            break # Move to next key
                        continue # Try next model
            except Exception as e:
                logger.error(f"[AIService] Error with key index {idx}: {e}")
        
        return None

    def _safe_generate(self, prompt, **kwargs):
        """Robust generation with automatic key failover."""
        for _ in range(len(AIService._api_keys)):
            if not self.model:
                self.model = self._get_active_model()
            if not self.model:
                break

            try:
                return self.model.generate_content(prompt, **kwargs)
            except Exception as e:
                if "429" in str(e) or "quota" in str(e).lower():
                    logger.warning(f"[AIService] Quota hit! Rotating key...")
                    AIService._current_key_index = (AIService._current_key_index + 1) % len(AIService._api_keys)
                    self.model = self._get_active_model()
                else:
                    raise e
        return None

    def get_vocabulary_suggestions(self, topic):
        """Get vocabulary suggestions from database + AI enhancement"""
        import os
        import json
        
        # Load from database
        vocab_db_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'vocabulary_database.json')
        try:
            with open(vocab_db_path, 'r', encoding='utf-8') as f:
                vocab_db = json.load(f)
                topic_vocab = vocab_db.get('topics', {}).get(topic, vocab_db['topics'].get('free', {}))
                return topic_vocab.get('vocabulary', {})
        except Exception as e:
            logger.warning(f"[AIService] Could not load vocabulary database: {e}")
            return {}

    def _build_enhanced_prompt(self, scenario, user_level='intermediate'):
        """Build comprehensive system prompt for speaking practice"""
        return f"""You are AESP AI, an expert English speaking tutor specialized in helping Vietnamese learners improve their speaking skills.

## YOUR ROLE
- Friendly, encouraging, and professional English tutor
- Provide real-time feedback on grammar, vocabulary, and potential pronunciation issues
- Give structured scores after each response

## CURRENT SESSION
- Topic: {scenario or 'Daily conversation'}
- User Level: {user_level}

## RESPONSE FORMAT
For EVERY user message, respond with:

1. **Natural Conversation Response** (in English)
   - Reply naturally to continue the conversation
   - Ask follow-up questions to encourage more speaking

2. **Inline Corrections** (if any errors found)
   Format: ✅ "incorrect phrase" → "correct phrase"

3. **📊 ĐÁNH GIÁ (Scoring Box)**
```
---
📊 **FEEDBACK**

🗣️ **Content:** [X/10] - [brief Vietnamese comment]
📖 **Grammar:** [X/10] 
   [List errors if any: ❌ "error" → ✅ "correct" (explanation in Vietnamese)]
🎤 **Pronunciation Tips:** 
   [Words that Vietnamese speakers often mispronounce with IPA]
💬 **Fluency:** [X/10] - [comment on sentence variety]

📈 **Overall:** [X/10]
💡 **Tip:** [One improvement suggestion in Vietnamese]
---
```

## SCORING CRITERIA

**Content (1-10):**
- 1-3: Off-topic, very basic
- 4-5: Basic ideas, limited vocabulary  
- 6-7: Good ideas, uses topic vocabulary
- 8-9: Well-developed, good vocabulary range
- 10: Excellent, creative, rich vocabulary

**Grammar (1-10):**
- 1-3: Many errors (tenses, subject-verb)
- 4-5: Some errors but understandable
- 6-7: Few minor errors
- 8-9: Very few errors, complex structures
- 10: Near-native accuracy

**Pronunciation Assessment (1-10):**
Based on common Vietnamese learner issues:
- Final consonants (cat→ca, bad→ba)
- "th" → "d" or "t" 
- "r" sound confusion
- Short/long vowels (ship/sheep)

**Fluency (1-10):**
- 1-3: Very short, simple sentences
- 4-5: Basic sentences, limited connectors
- 6-7: Some variety, uses "and", "but"
- 8-9: Good variety, advanced connectors
- 10: Natural, varied structures

## COMMON VIETNAMESE ERRORS TO CORRECT:
- Missing articles (a/an/the)
- Wrong tense usage
- Missing plural -s/-es
- Preposition confusion (in/on/at)
- Subject omission ("Is good" → "It is good")
- Wrong collocations ("make homework" → "do homework")

## STYLE:
- Use Vietnamese for explanations
- Be encouraging - start with what they did well
- Use emojis to make feedback engaging
- Keep conversation flowing naturally
"""

    def generate_response(self, user_input, history=None, scenario=None):
        """
        Generate a conversational response for English practice with failover.
        """
        system_prompt = self._build_enhanced_prompt(scenario)
        full_prompt = f"{system_prompt}\n\nUser: {user_input}"

        try:
            response = self._safe_generate(full_prompt)
            return response.text if response else "Tôi gặp vấn đề kỹ thuật tạm thời, hãy thử lại nhé!"
        except Exception as e:
            logger.error(f"[AIService] Error in generate_response: {e}")
            return f"Error communicating with AI: {str(e)}"

    def analyze_pronunciation(self, transcript, expected_text=None):
        """Analyze pronunciation based on transcript with failover."""
        prompt = f"Analyze the following transcript for pronunciation issues: {transcript}"
        try:
            response = self._safe_generate(prompt)
            return {"analysis": response.text if response else "No analysis available", "pronunciation_score": 80}
        except Exception as e:
            logger.error(f"[AIService] Error in analyze_pronunciation: {e}")
            return {"error": str(e), "score": 0}

    def analyze_practice(self, transcript):
        """Full session analysis with structured JSON scores and failover."""
        prompt = f"""
Analyze the following English speaking practice transcript and provide a detailed evaluation in JSON format.
Transcript: {transcript}

Return ONLY a JSON object with the following structure:
{{
  "pronunciation_score": [Numeric score 0-100],
  "grammar_score": [Numeric score 0-100],
  "vocabulary_score": [Numeric score 0-100],
  "fluency_score": [Numeric score 0-100],
  "overall_score": [Numeric score 0-100],
  "analysis": "[A detailed summary of the performance in Vietnamese, highlighting strengths and areas for improvement. Keep it under 500 characters.]",
  "grammar_errors": [
    {{"error": "incorrect phrase", "correction": "correct phrase", "explanation": "Why it's wrong in Vietnamese"}}
  ],
  "vocabulary_suggestions": [
    {{"word": "better word", "context": "where to use it", "vietnamese": "translation"}}
  ]
}}

Ensure all scores are integers between 0 and 100. Provide the analysis and explanations in Vietnamese.
"""
        try:
            response = self._safe_generate(prompt)
            return response.text if response else "{}"
        except Exception as e:
            logger.error(f"[AIService] Error in analyze_practice: {e}")
            return f"Error: {e}"

    def get_pronunciation_exercise(self, difficulty='medium', focus_area=None):
        """Generate practice exercise."""
        if not self.model:
            return {"error": "AI Service not configured"}
        
        prompt = f"Create an English pronunciation exercise for {difficulty} level."
        try:
            response = self.model.generate_content(prompt)
            return {"exercise": response.text}
        except Exception as e:
            logger.error(f"[AIService] Error in get_pronunciation_exercise: {e}")
            return {"error": str(e)}
