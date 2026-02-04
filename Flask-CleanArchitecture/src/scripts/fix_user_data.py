"""
Fix User Data Migration Script
1. Populate full_name where NULL (set to user_name)
2. Create test mentor assignment if none exists
"""
import sys
sys.path.insert(0, '.')

from infrastructure.databases.mssql import engine
from sqlalchemy import text


def fix_user_data():
    """Fix user data issues"""
    
    print("=" * 50)
    print("User Data Fix Migration")
    print("=" * 50)
    print(f"Database: {engine.url}\n")
    
    with engine.connect() as conn:
        # Step 1: Populate full_name where NULL
        print("[Step 1] Populating full_name where NULL...")
        try:
            result = conn.execute(text(
                "UPDATE flask_user SET full_name = user_name WHERE full_name IS NULL OR full_name = ''"
            ))
            conn.commit()
            print(f"  ✓ Updated {result.rowcount} users with full_name = user_name")
        except Exception as e:
            print(f"  ✗ Error: {e}")
        
        # Step 2: Show current users
        print("\n[Step 2] Current users in database:")
        try:
            users = conn.execute(text(
                "SELECT id, user_name, full_name, email, role FROM flask_user ORDER BY id"
            ))
            for user in users:
                print(f"  ID:{user[0]} | {user[1]} | {user[2]} | {user[3]} | {user[4]}")
        except Exception as e:
            print(f"  ✗ Error: {e}")
        
        # Step 3: Check mentor assignments
        print("\n[Step 3] Checking mentor assignments...")
        try:
            assignments = conn.execute(text(
                "SELECT ma.id, ma.mentor_id, ma.learner_id, ma.status, "
                "m.full_name as mentor_name, l.full_name as learner_name "
                "FROM mentor_assignments ma "
                "JOIN flask_user m ON ma.mentor_id = m.id "
                "JOIN flask_user l ON ma.learner_id = l.id "
                "WHERE ma.status = 'active'"
            ))
            rows = assignments.fetchall()
            if rows:
                print(f"  Found {len(rows)} active assignment(s):")
                for row in rows:
                    print(f"    ID:{row[0]} | Mentor:{row[4]}(ID:{row[1]}) -> Learner:{row[5]}(ID:{row[2]})")
            else:
                print("  No active assignments found!")
                print("  Creating test assignment...")
                
                # Find a mentor and learner
                mentor = conn.execute(text(
                    "SELECT id, full_name FROM flask_user WHERE role = 'mentor' LIMIT 1"
                )).fetchone()
                learner = conn.execute(text(
                    "SELECT id, full_name FROM flask_user WHERE role = 'learner' LIMIT 1"
                )).fetchone()
                admin = conn.execute(text(
                    "SELECT id FROM flask_user WHERE role = 'admin' LIMIT 1"
                )).fetchone()
                
                if mentor and learner:
                    try:
                        conn.execute(text(
                            "INSERT INTO mentor_assignments (mentor_id, learner_id, assigned_by, status, assigned_at) "
                            "VALUES (:mentor_id, :learner_id, :admin_id, 'active', NOW())"
                        ), {
                            'mentor_id': mentor[0],
                            'learner_id': learner[0],
                            'admin_id': admin[0] if admin else mentor[0]
                        })
                        conn.commit()
                        print(f"  ✓ Created assignment: {mentor[1]} -> {learner[1]}")
                    except Exception as e:
                        if "Duplicate" in str(e):
                            print(f"  - Assignment already exists (possibly ended)")
                        else:
                            print(f"  ✗ Error creating assignment: {e}")
                else:
                    print("  ✗ No mentor or learner found to create assignment!")
                    if not mentor:
                        print("    -> Need user with role='mentor'")
                    if not learner:
                        print("    -> Need user with role='learner'")
        except Exception as e:
            print(f"  ✗ Error checking assignments: {e}")
    
    print("\n" + "=" * 50)
    print("Migration completed!")
    print("=" * 50)


if __name__ == "__main__":
    fix_user_data()
