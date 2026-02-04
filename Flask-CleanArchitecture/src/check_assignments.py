"""
Check and create test assignment for mentor-learner
Run: python check_assignments.py
"""
import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

def check_and_fix():
    try:
        from config import Config
        from sqlalchemy import create_engine, text
        
        print("=" * 50)
        print("[CHECK] Checking Mentor Assignments")
        print("=" * 50)
        
        engine = create_engine(Config.DATABASE_URI)
        
        with engine.connect() as conn:
            # Check if mentor_assignments table exists
            result = conn.execute(text("SHOW TABLES LIKE 'mentor_assignments'"))
            if not result.fetchone():
                print("[X] Table mentor_assignments does not exist!")
                print("Creating table...")
                conn.execute(text("""
                    CREATE TABLE IF NOT EXISTS mentor_assignments (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        mentor_id INT NOT NULL,
                        learner_id INT NOT NULL,
                        assigned_by INT,
                        status VARCHAR(20) DEFAULT 'active',
                        sessions_remaining INT DEFAULT 0,
                        notes TEXT,
                        assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        ended_at DATETIME
                    )
                """))
                conn.commit()
                print("[OK] Table created!")
            else:
                print("[OK] Table mentor_assignments exists")
            
            # Get mentors and learners
            mentors = conn.execute(text("SELECT id, full_name FROM flask_user WHERE role='mentor' LIMIT 5")).fetchall()
            learners = conn.execute(text("SELECT id, full_name FROM flask_user WHERE role='learner' LIMIT 5")).fetchall()
            
            print(f"\n[INFO] Found {len(mentors)} mentors and {len(learners)} learners")
            
            for m in mentors:
                print(f"   Mentor: {m[1]} (ID: {m[0]})")
            for l in learners:
                print(f"   Learner: {l[1]} (ID: {l[0]})")
            
            # Check current assignments
            assignments = conn.execute(text("""
                SELECT ma.id, ma.mentor_id, ma.learner_id, ma.status,
                       m.full_name as mentor_name, l.full_name as learner_name
                FROM mentor_assignments ma
                JOIN flask_user m ON ma.mentor_id = m.id
                JOIN flask_user l ON ma.learner_id = l.id
            """)).fetchall()
            
            print(f"\n[INFO] Current assignments: {len(assignments)}")
            for a in assignments:
                print(f"   #{a[0]}: {a[4]} -> {a[5]} ({a[3]})")
            
            # If no assignments, create one
            if len(assignments) == 0 and len(mentors) > 0 and len(learners) > 0:
                print("\n[FIX] No assignments found. Creating test assignment...")
                mentor_id = mentors[0][0]
                learner_id = learners[0][0]
                
                conn.execute(text("""
                    INSERT INTO mentor_assignments (mentor_id, learner_id, assigned_by, status)
                    VALUES (:mentor_id, :learner_id, 1, 'active')
                """), {"mentor_id": mentor_id, "learner_id": learner_id})
                conn.commit()
                print(f"[OK] Created: Mentor {mentors[0][1]} -> Learner {learners[0][1]}")
            
            print("\n" + "=" * 50)
            print("[DONE] Check completed!")
            print("=" * 50)
            
    except Exception as e:
        print(f"[ERROR] {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    check_and_fix()
