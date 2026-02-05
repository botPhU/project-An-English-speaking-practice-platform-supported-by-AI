"""
Simple fix script - run from Flask-CleanArchitecture/src
"""
import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Import after chdir
import sys
sys.path.insert(0, 'Flask-CleanArchitecture/src')

from sqlalchemy import create_engine, text
from datetime import datetime

# Direct DB connection
DATABASE_URL = "mssql+pyodbc://sa:Phuhung123@PHUHUNG-DELL\\SQLEXPRESS2024/aesp_db?driver=ODBC+Driver+17+for+SQL+Server"
engine = create_engine(DATABASE_URL)

with engine.connect() as conn:
    # Get confirmed bookings
    print("\n📅 CONFIRMED BOOKINGS:")
    bookings = conn.execute(text("""
        SELECT b.id, b.mentor_id, b.learner_id, b.scheduled_date, b.status, u.full_name as learner_name
        FROM mentor_bookings b
        JOIN flask_user u ON b.learner_id = u.id
        WHERE b.status = 'confirmed'
    """)).fetchall()
    
    for b in bookings:
        print(f"  - Booking #{b.id}: {b.learner_name} (learner_id={b.learner_id}, mentor_id={b.mentor_id})")
    
    # Get existing assignments
    print("\n👥 EXISTING ASSIGNMENTS:")
    assignments = conn.execute(text("""
        SELECT a.id, a.mentor_id, a.learner_id, a.status, u.full_name as learner_name
        FROM mentor_assignments a
        JOIN flask_user u ON a.learner_id = u.id
    """)).fetchall()
    
    if assignments:
        for a in assignments:
            print(f"  - Assignment #{a.id}: {a.learner_name} Status: {a.status}")
    else:
        print("  ❌ No assignments found!")
    
    # Create missing assignments
    print("\n🔧 CREATING MISSING ASSIGNMENTS...")
    for b in bookings:
        # Check if exists
        existing = conn.execute(text("""
            SELECT id FROM mentor_assignments 
            WHERE mentor_id = :mentor_id AND learner_id = :learner_id
        """), {"mentor_id": b.mentor_id, "learner_id": b.learner_id}).fetchone()
        
        if not existing:
            conn.execute(text("""
                INSERT INTO mentor_assignments (mentor_id, learner_id, assigned_by, status, notes, assigned_at)
                VALUES (:mentor_id, :learner_id, :assigned_by, 'active', :notes, GETDATE())
            """), {
                "mentor_id": b.mentor_id,
                "learner_id": b.learner_id,
                "assigned_by": b.mentor_id,
                "notes": f"Auto-fixed from booking #{b.id}"
            })
            print(f"  ✅ Created assignment: mentor {b.mentor_id} -> learner {b.learner_id}")
        else:
            # Update to active if needed
            conn.execute(text("""
                UPDATE mentor_assignments SET status = 'active' 
                WHERE mentor_id = :mentor_id AND learner_id = :learner_id
            """), {"mentor_id": b.mentor_id, "learner_id": b.learner_id})
            print(f"  ⏭ Assignment already exists for learner_id={b.learner_id}")
    
    conn.commit()
    print("\n✅ Done! Refresh the dashboard now.")
