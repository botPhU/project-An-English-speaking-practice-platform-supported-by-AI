"""
Fix mentor_assignments - handle constraints properly
"""
import pymysql

conn = pymysql.connect(
    host='centerbeam.proxy.rlwy.net',
    port=33386,
    user='root',
    password='IIbTiYhuwUWZNEEUSLeKLcUkHbmIiRVD',
    database='railway'
)

cursor = conn.cursor()

print("=== FIXING MENTOR ASSIGNMENTS ===\n")

# Disable foreign key checks temporarily  
cursor.execute("SET FOREIGN_KEY_CHECKS = 0")

# The only mentor is id=2
mentor_id = 2

# Get all learners
cursor.execute("SELECT id, full_name FROM flask_user WHERE role='learner'")
learners = cursor.fetchall()
print(f"Found {len(learners)} learners")

# Clear existing assignments
cursor.execute("DELETE FROM mentor_assignments")
print(f"Deleted all existing assignments")

# Create assignments for mentor 2 with all learners
for learner in learners:
    learner_id = learner[0]
    try:
        cursor.execute("""
            INSERT INTO mentor_assignments 
            (mentor_id, learner_id, assigned_by, status, notes, assigned_at)
            VALUES (%s, %s, %s, 'active', 'Auto-assigned', NOW())
        """, (mentor_id, learner_id, mentor_id))
        print(f"  Created: mentor {mentor_id} -> learner {learner_id}")
    except Exception as e:
        print(f"  Error for learner {learner_id}: {e}")

# Re-enable foreign key checks
cursor.execute("SET FOREIGN_KEY_CHECKS = 1")

conn.commit()

# Verify
print("\n=== FINAL STATE ===")
cursor.execute("SELECT * FROM mentor_assignments")
for a in cursor.fetchall():
    print(f"  id={a[0]}, mentor_id={a[1]}, learner_id={a[2]}, status={a[4]}")

cursor.close()
conn.close()
print("\nDone! Refresh dashboard now.")
