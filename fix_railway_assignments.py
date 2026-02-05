"""
Check and fix mentor_assignments in Railway database
"""
import pymysql

# Railway MySQL connection
conn = pymysql.connect(
    host='centerbeam.proxy.rlwy.net',
    port=33386,
    user='root',
    password='IIbTiYhuwUWZNEEUSLeKLcUkHbmIiRVD',
    database='railway'
)

cursor = conn.cursor()

print("\n=== CHECKING RAILWAY DATABASE ===\n")

# Check tables
cursor.execute("SHOW TABLES")
tables = [t[0] for t in cursor.fetchall()]
print(f"Tables: {tables}")

# Create mentor_assignments if not exists
if 'mentor_assignments' not in tables:
    print("\n❌ mentor_assignments table NOT FOUND! Creating...")
    cursor.execute("""
        CREATE TABLE mentor_assignments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            mentor_id INT NOT NULL,
            learner_id INT NOT NULL,
            assigned_by INT NOT NULL,
            status VARCHAR(50) DEFAULT 'active',
            notes TEXT,
            assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
            ended_at DATETIME,
            UNIQUE KEY uq_mentor_learner (mentor_id, learner_id)
        )
    """)
    conn.commit()
    print("✅ Created mentor_assignments table")
else:
    print("\n✅ mentor_assignments table exists")
    cursor.execute("SELECT * FROM mentor_assignments")
    assignments = cursor.fetchall()
    print(f"Assignments count: {len(assignments)}")
    
    # Get column names
    cursor.execute("DESCRIBE mentor_assignments")
    columns = [c[0] for c in cursor.fetchall()]
    print(f"Columns: {columns}")

# Check confirmed bookings
print("\n📅 CONFIRMED BOOKINGS:")
try:
    cursor.execute("SELECT id, mentor_id, learner_id, status FROM mentor_bookings WHERE status='confirmed'")
    bookings = cursor.fetchall()
    print(f"Confirmed bookings: {len(bookings)}")
    for b in bookings:
        print(f"  Booking #{b[0]}: mentor={b[1]}, learner={b[2]}, status={b[3]}")
        
    # Create missing assignments
    print("\n🔧 CREATING MISSING ASSIGNMENTS...")
    for b in bookings:
        booking_id, mentor_id, learner_id, _ = b
        
        # Check if exists
        cursor.execute("""
            SELECT id FROM mentor_assignments 
            WHERE mentor_id=%s AND learner_id=%s
        """, (mentor_id, learner_id))
        existing = cursor.fetchone()
        
        if not existing:
            try:
                cursor.execute("""
                    INSERT INTO mentor_assignments 
                    (mentor_id, learner_id, assigned_by, status, notes, assigned_at)
                    VALUES (%s, %s, %s, 'active', %s, NOW())
                """, (mentor_id, learner_id, mentor_id, f"Auto-fixed from booking #{booking_id}"))
                print(f"  ✅ Created: mentor {mentor_id} -> learner {learner_id}")
            except Exception as e:
                print(f"  ❌ Error creating: {e}")
        else:
            # Update to active
            cursor.execute("""
                UPDATE mentor_assignments SET status='active' 
                WHERE mentor_id=%s AND learner_id=%s
            """, (mentor_id, learner_id))
            print(f"  ⏭ Updated existing: mentor {mentor_id} -> learner {learner_id}")

    conn.commit()
    
except Exception as e:
    print(f"Error: {e}")

# Show final state
print("\n📊 FINAL STATE:")
cursor.execute("SELECT * FROM mentor_assignments")
for row in cursor.fetchall():
    print(f"  {row}")

print("\n✅ Done! Refresh dashboard now.")

cursor.close()
conn.close()
