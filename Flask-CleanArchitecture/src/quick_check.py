"""Quick check assignments"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))

from config import Config
from sqlalchemy import create_engine, text

engine = create_engine(Config.DATABASE_URI)

with engine.connect() as conn:
    # Check assignments
    result = conn.execute(text("""
        SELECT ma.id, ma.mentor_id, ma.learner_id, ma.status
        FROM mentor_assignments ma
        WHERE ma.status = 'active'
    """))
    rows = result.fetchall()
    print(f"Active assignments: {len(rows)}")
    for r in rows:
        print(f"  ID:{r[0]} Mentor:{r[1]} -> Learner:{r[2]} ({r[3]})")
    
    if len(rows) == 0:
        print("\nNo active assignments! Creating one...")
        # Get first mentor and learner
        mentor = conn.execute(text("SELECT id FROM flask_user WHERE role='mentor' LIMIT 1")).fetchone()
        learner = conn.execute(text("SELECT id FROM flask_user WHERE role='learner' LIMIT 1")).fetchone()
        
        if mentor and learner:
            conn.execute(text("""
                INSERT INTO mentor_assignments (mentor_id, learner_id, assigned_by, status)
                VALUES (:m, :l, 1, 'active')
            """), {"m": mentor[0], "l": learner[0]})
            conn.commit()
            print(f"Created: Mentor {mentor[0]} -> Learner {learner[0]}")
        else:
            print("No mentor or learner found in database!")
