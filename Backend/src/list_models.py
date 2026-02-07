import os
import google.generativeai as genai
from dotenv import load_dotenv
from pathlib import Path

# Load env
env_path = Path(__file__).parent / '.env'
if env_path.exists():
    load_dotenv(env_path)
else:
    load_dotenv()

api_key = os.environ.get('GEMINI_API_KEY')
genai.configure(api_key=api_key)

target = 'gemini-1.5-flash'
print(f"Checking for {target}...")
try:
    models = [m.name for m in genai.list_models()]
    if any(target in m for m in models):
        print(f"Found {target} in: {[m for m in models if target in m]}")
    else:
        print(f"{target} NOT FOUND. Available Gemini models:")
        for m in models:
            if 'gemini' in m.lower():
                print(m)
except Exception as e:
    print(f"Error: {e}")
