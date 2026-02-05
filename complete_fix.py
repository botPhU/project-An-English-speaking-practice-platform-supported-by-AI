"""
Complete debug and fix - handle encoding
"""
import pymysql
import sys
sys.stdout.reconfigure(encoding='utf-8')

conn = pymysql.connect(
    host='centerbeam.proxy.rlwy.net',
    port=33386,
    user='root', 
    password='IIbTiYhuwUWZNEEUSLeKLcUkHbmIiRVD',
    database='railway',
    charset='utf8mb4'
)

cursor = conn.cursor()

print("=" * 60)
print("RAILWAY DATABASE DEBUG")
print("=" * 60)

# 1. Mentors
print("\n1. MENTORS:")
cursor.execute("SELECT id, full_name, email FROM flask_user WHERE role='mentor'")
mentors = cursor.fetchall()
for m in mentors:
    print(f"   #{m[0]}: {m[1]} ({m[2]})")

mentor_ids = [m[0] for m in mentors]

# 2. Recent bookings
print("\n2. RECENT CONFIRMED BOOKINGS:")
cursor.execute("""
    SELECT id, mentor_id, learner_id FROM mentor_bookings 
    WHERE status='confirmed' ORDER BY id DESC LIMIT 10
""")
bookings = cursor.fetchall()
for b in bookings:
    print(f"   #{b[0]}: mentor_id={b[1]}, learner_id={b[2]}")

# 3. Fix assignments
print("\n" + "=" * 60)
print("FIXING")
print("=" * 60)

cursor.execute("SET FOREIGN_KEY_CHECKS = 0")

# Delete invalid
cursor.execute(f"DELETE FROM mentor_assignments WHERE mentor_id NOT IN ({','.join(map(str, mentor_ids))})")
print(f"Deleted {cursor.rowcount} invalid assignments")

# Create from bookings
for b in bookings:
    booking_id, mentor_id, learner_id = b
    
    if mentor_id not in mentor_ids:
        print(f"   Skip: mentor {mentor_id} not a mentor")
        continue
    
    cursor.execute("SELECT id FROM mentor_assignments WHERE mentor_id=%s AND learner_id=%s", (mentor_id, learner_id))
    if not cursor.fetchone():
        try:
            cursor.execute("""
                INSERT INTO mentor_assignments (mentor_id, learner_id, assigned_by, status, notes, assigned_at)
                VALUES (%s, %s, %s, 'active', 'Auto-synced', NOW())
            """, (mentor_id, learner_id, mentor_id))
            print(f"   Created: mentor {mentor_id} -> learner {learner_id}")
        except Exception as e:
            print(f"   Error: {e}")
    else:
        cursor.execute("UPDATE mentor_assignments SET status='active' WHERE mentor_id=%s AND learner_id=%s", (mentor_id, learner_id))
        print(f"   Updated: mentor {mentor_id} -> learner {learner_id}")

cursor.execute("SET FOREIGN_KEY_CHECKS = 1")
conn.commit()

# 4. Final
print("\n" + "=" * 60)
print("FINAL ASSIGNMENTS")
print("=" * 60)
cursor.execute("SELECT id, mentor_id, learner_id, status FROM mentor_assignments")
for a in cursor.fetchall():
    print(f"   #{a[0]}: mentor {a[1]} -> learner {a[2]} | {a[3]}")

cursor.close()
conn.close()
print("\nDone!")
