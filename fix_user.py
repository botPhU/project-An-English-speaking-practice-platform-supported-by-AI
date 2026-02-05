"""
Find and fix Test User 2025 assignment
"""
import pymysql

conn = pymysql.connect(
    host='centerbeam.proxy.rlwy.net',
    port=33386,
    user='root', 
    password='IIbTiYhuwUWZNEEUSLeKLcUkHbmIiRVD',
    database='railway',
    charset='utf8mb4'
)

cursor = conn.cursor()

# Find the user
print("1. Finding user03@gmail.com...")
cursor.execute("SELECT id, full_name, email, role FROM flask_user WHERE email='user03@gmail.com'")
user = cursor.fetchone()
if user:
    print(f"   Found: #{user[0]} - {user[1]} ({user[2]}) - role: {user[3]}")
    learner_id = user[0]
else:
    print("   Not found!")
    exit()

# Find mentor
print("\n2. Finding mentor...")
cursor.execute("SELECT id, full_name, email FROM flask_user WHERE role='mentor'")
mentor = cursor.fetchone()
if mentor:
    print(f"   Found: #{mentor[0]} - {mentor[1]} ({mentor[2]})")
    mentor_id = mentor[0]
else:
    print("   No mentor found!")
    exit()

# Check bookings for this user
print(f"\n3. Bookings for learner {learner_id}:")
cursor.execute("SELECT id, mentor_id, status FROM mentor_bookings WHERE learner_id=%s", (learner_id,))
for b in cursor.fetchall():
    print(f"   Booking #{b[0]}: mentor_id={b[1]}, status={b[2]}")

# Create assignment
print(f"\n4. Creating assignment: mentor {mentor_id} -> learner {learner_id}")
cursor.execute("SET FOREIGN_KEY_CHECKS = 0")

cursor.execute("SELECT id FROM mentor_assignments WHERE mentor_id=%s AND learner_id=%s", (mentor_id, learner_id))
if not cursor.fetchone():
    cursor.execute("""
        INSERT INTO mentor_assignments (mentor_id, learner_id, assigned_by, status, notes, assigned_at)
        VALUES (%s, %s, %s, 'active', 'Manual fix for Test User 2025', NOW())
    """, (mentor_id, learner_id, mentor_id))
    print("   Created!")
else:
    cursor.execute("UPDATE mentor_assignments SET status='active' WHERE mentor_id=%s AND learner_id=%s", (mentor_id, learner_id))
    print("   Updated existing!")

cursor.execute("SET FOREIGN_KEY_CHECKS = 1")
conn.commit()

# Final check
print("\n5. All assignments for mentor:")
cursor.execute("""
    SELECT a.id, a.learner_id, u.full_name, u.email, a.status
    FROM mentor_assignments a
    JOIN flask_user u ON a.learner_id = u.id
    WHERE a.mentor_id = %s
""", (mentor_id,))
for a in cursor.fetchall():
    print(f"   #{a[0]}: {a[2]} ({a[3]}) - {a[4]}")

cursor.close()
conn.close()
print("\nDone! Refresh dashboard.")
