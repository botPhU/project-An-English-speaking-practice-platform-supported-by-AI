# Configuration settings for the Flask application

import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
# Check both src/.env and parent .env
env_path = Path(__file__).parent / '.env'
if env_path.exists():
    load_dotenv(env_path)
else:
    load_dotenv()

# Debug: Print if API key is loaded
_api_key = os.environ.get('GEMINI_API_KEY', '')
print(f"[Config] GEMINI_API_KEY loaded: {'Yes (starts with ' + _api_key[:10] + '...)' if _api_key and _api_key != 'YOUR_GEMINI_API_KEY_HERE' else 'No or placeholder'}")

class Config:
    """Base configuration."""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'a_default_secret_key'
    DEBUG = os.environ.get('DEBUG', 'False').lower() in ['true', '1']
    TESTING = os.environ.get('TESTING', 'False').lower() in ['true', '1']
    DATABASE_URI = os.environ.get('DATABASE_URI') or 'mysql+pymysql://root:123@127.0.0.1:3306/aesp_db'
    CORS_HEADERS = 'Content-Type'
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY') or 'YOUR_GEMINI_API_KEY_HERE'
    GEMINI_API_KEYS = [k.strip() for k in GEMINI_API_KEY.split(',') if k.strip()]

class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True
    DATABASE_URI = os.environ.get('DATABASE_URI') or 'mysql+pymysql://root:123@127.0.0.1:3306/aesp_db'


class TestingConfig(Config):
    """Testing configuration."""
    TESTING = True
    DATABASE_URI = os.environ.get('DATABASE_URI') or 'mysql+pymysql://root:123@127.0.0.1:3306/aesp_db'


class ProductionConfig(Config):
    """Production configuration."""
    DATABASE_URI = os.environ.get('DATABASE_URI') or 'mysql+pymysql://root:123@127.0.0.1:3306/aesp_db'

    
template = {
    "swagger": "2.0",
    "info": {
        "title": "Todo API",
        "description": "API for managing todos",
        "version": "1.0.0"
    },
    "basePath": "/",
    "schemes": [
        "http",
        "https"
    ],
    "consumes": [
        "application/json"
    ],
    "produces": [
        "application/json"
    ]
}
class SwaggerConfig:
    """Swagger configuration."""
    template = {
        "swagger": "2.0",
        "info": {
            "title": "Todo API",
            "description": "API for managing todos",
            "version": "1.0.0"
        },
        "basePath": "/",
        "schemes": [
            "http",
            "https"
        ],
        "consumes": [
            "application/json"
        ],
        "produces": [
            "application/json"
        ]
    }

    swagger_config = {
        "headers": [],
        "specs": [
            {
                "endpoint": 'apispec',
                "route": '/apispec.json',
                "rule_filter": lambda rule: True,
                "model_filter": lambda tag: True,
            }
        ],
        "static_url_path": "/flasgger_static",
        "swagger_ui": True,
        "specs_route": "/docs"
    }