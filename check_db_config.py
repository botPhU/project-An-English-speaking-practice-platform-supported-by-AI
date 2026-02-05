"""
Check what database the backend is using
"""
import sys
sys.path.insert(0, 'Flask-CleanArchitecture/src')

from config import Config

print(f"\n=== DATABASE CONFIG ===")
print(f"DATABASE_URI: {Config.DATABASE_URI}")
print(f"\nIs Railway: {'railway' in Config.DATABASE_URI}")
