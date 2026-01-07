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
    def __init__(self):
        logger.info("[AIService] __init__ called")
        from config import Config
        try:
            # Safely get config
            self.api_key = current_app.config.get('GEMINI_API_KEY') if current_app else Config.GEMINI_API_KEY
        except Exception:
            self.api_key = Config.GEMINI_API_KEY

        if self.api_key and self.api_key != 'YOUR_GEMINI_API_KEY_HERE':
            try:
                genai.configure(api_key=self.api_key)
                
                # Try models in order. We MUST test each one because initialization doesn't check availability.
                models_to_try = [
                    'gemini-2.0-flash', 
                    'gemini-2.0-flash-lite', 
                    'gemini-1.5-flash', 
                    'gemini-flash-latest',
                    'gemini-2.5-flash',
                    'gemini-pro-latest',
                    'gemini-pro',
                    'gemini-1.0-pro'
                ]
                self.model = None
                
                for model_name in models_to_try:
                    try:
                        logger.info(f"[AIService] Checking model availability: {model_name}")
                        m = genai.GenerativeModel(model_name)
                        # Simple test call
                        m.generate_content("ping", generation_config={"max_output_tokens": 1})
                        self.model = m
                        logger.info(f"[AIService] Successfully selected and verified {model_name}")
                        break
                    except Exception as me:
                        # Try with 'models/' prefix if short name fails
                        if not model_name.startswith('models/'):
                            try:
                                full_model_name = f"models/{model_name}"
                                logger.info(f"[AIService] Retrying with prefix: {full_model_name}")
                                m = genai.GenerativeModel(full_model_name)
                                m.generate_content("ping", generation_config={"max_output_tokens": 1})
                                self.model = m
                                logger.info(f"[AIService] Successfully selected and verified {full_model_name}")
                                break
                            except Exception:
                                pass
                        logger.warning(f"[AIService] Model {model_name} is not available: {me}")
                
            except Exception as e:
                logger.error(f"[AIService] Error during Gemini configuration: {e}")
                self.model = None
        else:
            logger.warning("[AIService] Gemini API key not configured")
            self.model = None

    def generate_response(self, user_input, history=None, scenario=None):
        """
        Generate a conversational response for English practice.
        """
        if not self.model:
            return "AI Service is not configured. Please check your API key."

        system_prompt = f"""You are a friendly and professional English speaking tutor named "AESP AI".
Match the user's English level and provide gentle corrections.
Current Topic: {scenario or 'Daily conversation'}
"""

        try:
            chat = self.model.start_chat(history=history or [])
            response = chat.send_message(f"{system_prompt}\n\nUser: {user_input}")
            return response.text
        except Exception as e:
            logger.error(f"[AIService] Error in generate_response: {e}")
            # If 404 specifically, maybe try switching model name if possible, 
            # but for now just report it.
            return f"Error communicating with AI: {str(e)}"

    def analyze_pronunciation(self, transcript, expected_text=None):
        """Analyze pronunciation based on transcript."""
        if not self.model:
            return {"error": "AI Service not configured", "score": 0}

        prompt = f"Analyze the following transcript for pronunciation issues: {transcript}"
        try:
            response = self.model.generate_content(prompt)
            return {"analysis": response.text, "pronunciation_score": 80}
        except Exception as e:
            logger.error(f"[AIService] Error in analyze_pronunciation: {e}")
            return {"error": str(e), "score": 0}

    def analyze_practice(self, transcript):
        """Full session analysis."""
        if not self.model:
            return "AI Service not configured"
        
        prompt = f"Analyze this conversation and provide scores: {transcript}"
        try:
            response = self.model.generate_content(prompt)
            return response.text
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
