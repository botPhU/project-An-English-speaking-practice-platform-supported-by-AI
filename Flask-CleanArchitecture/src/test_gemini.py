import os
import google.generativeai as genai
from dotenv import load_dotenv
from pathlib import Path

# Load env
env_path = Path(__file__).parent / '.env'
load_dotenv(env_path)

api_key = os.environ.get('GEMINI_API_KEY')
print(f"Using API Key: {api_key[:10]}...")
genai.configure(api_key=api_key)

models_to_test = [
    'gemini-2.0-flash', 
    'gemini-2.0-flash-lite', 
    'gemini-1.5-flash', 
    'gemini-flash-latest',
    'gemini-2.5-flash',
    'gemini-pro-latest'
]

for model_name in models_to_test:
    print(f"\nTesting {model_name}...")
    try:
        model = genai.GenerativeModel(model_name)
        response = model.generate_content("Hello", generation_config={"max_output_tokens": 5})
        print(f"SUCCESS: {response.text}")
    except Exception as e:
        # Try with prefix
        try:
            full_name = f"models/{model_name}"
            print(f"Retrying with {full_name}...")
            model = genai.GenerativeModel(full_name)
            response = model.generate_content("Hello", generation_config={"max_output_tokens": 5})
            print(f"SUCCESS (with prefix): {response.text}")
        except Exception as e2:
            print(f"FAILED: {e2}")
