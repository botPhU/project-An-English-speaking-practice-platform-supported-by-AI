import os
import google.generativeai as genai
from dotenv import load_dotenv
from pathlib import Path

# Load env
env_path = Path(__file__).parent / '.env'
load_dotenv(env_path)

api_key = os.environ.get('GEMINI_API_KEY')
genai.configure(api_key=api_key)

print("Access check - Listing ALL models:")
try:
    models = genai.list_models()
    for m in models:
        print(f"{m.name} | Methods: {m.supported_generation_methods}")
except Exception as e:
    print(f"Error listing models: {e}")
