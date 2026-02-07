"""List users and assignments"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))

from config import Config
from sqlalchemy import create_engine, text

engine = create_engine(Config.DATABASE_URI)

with engine.connect() as conn:
    print("=== USERS (mentors and learners) ===")
    result = conn.execute(text("SELECT id, user_name, full_name, role FROM flask_user WHERE role IN ('mentor','learner') ORDER BY id"))
    for x in result.fetchall():
        print(f"  ID:{x[0]} {x[1]} ({x[2]}) - {x[3]}")
    
    print("\n=== ALL ASSIGNMENTS ===")
    result = conn.execute(text("SELECT * FROM mentor_assignments"))
    for x in result.fetchall():
        print(f"  {x}")
