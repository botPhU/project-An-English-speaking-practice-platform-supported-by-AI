"""Create assignment for any mentor user"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))

from config import Config
from sqlalchemy import create_engine, text

engine = create_engine(Config.DATABASE_URI)

with engine.connect() as conn:
    print("=== ALL MENTORS ===")
    mentors = conn.execute(text("SELECT id, user_name, full_name FROM flask_user WHERE role='mentor' ORDER BY id")).fetchall()
    for m in mentors:
        print(f"  ID:{m[0]} - {m[1]} ({m[2]})")
    
    print("\n=== ALL LEARNERS ===")
    learners = conn.execute(text("SELECT id, user_name, full_name FROM flask_user WHERE role='learner' ORDER BY id")).fetchall()
    for l in learners:
        print(f"  ID:{l[0]} - {l[1]} ({l[2]})")
    
    print("\n=== CURRENT ASSIGNMENTS ===")
    assigns = conn.execute(text("SELECT mentor_id, learner_id, status FROM mentor_assignments")).fetchall()
    for a in assigns:
        print(f"  Mentor:{a[0]} -> Learner:{a[1]} ({a[2]})")
    
    # Create assignments for ALL mentors if they don't have one
    print("\n=== CREATING MISSING ASSIGNMENTS ===")
    for mentor in mentors:
        # Check if this mentor has any assignment
        existing = conn.execute(text(
            "SELECT id FROM mentor_assignments WHERE mentor_id = :mid AND status='active'"
        ), {"mid": mentor[0]}).fetchone()
        
        if not existing and len(learners) > 0:
            # Pick a learner (cycle through)
            learner = learners[mentor[0] % len(learners)]
            conn.execute(text("""
                INSERT INTO mentor_assignments (mentor_id, learner_id, assigned_by, status)
                VALUES (:mid, :lid, 1, 'active')
            """), {"mid": mentor[0], "lid": learner[0]})
            print(f"  Created: Mentor {mentor[0]} ({mentor[2]}) -> Learner {learner[0]} ({learner[2]})")
        else:
            print(f"  Mentor {mentor[0]} already has assignment")
    
    conn.commit()
    print("\nDone!")
