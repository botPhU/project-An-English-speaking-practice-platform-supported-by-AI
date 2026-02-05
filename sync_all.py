"""
Check bookings and create assignments for the actual mentor seeing the dashboard
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

# Check which mentor_id the bookings have
print("=== CONFIRMED BOOKINGS DETAILS ===")
cursor.execute("""
    SELECT b.id, b.mentor_id, b.learner_id, m.full_name, m.role
    FROM mentor_bookings b
    LEFT JOIN flask_user m ON b.mentor_id = m.id
    WHERE b.status = 'confirmed'
""")
bookings = cursor.fetchall()
for b in bookings:
    print(f"  Booking #{b[0]}: mentor_id={b[1]} ({b[3]}, role={b[4]}), learner_id={b[2]}")

# What is the mentor_id being used in bookings?
mentor_ids_in_bookings = set([b[1] for b in bookings])
print(f"\nMentor IDs in bookings: {mentor_ids_in_bookings}")

# Create assignments for each mentor_id in bookings (regardless of role)
print("\n=== CREATING ASSIGNMENTS FOR ALL MENTOR IDS IN BOOKINGS ===")
cursor.execute("SET FOREIGN_KEY_CHECKS = 0")

for b in bookings:
    booking_id, mentor_id, learner_id = b[0], b[1], b[2]
    
    cursor.execute("SELECT id FROM mentor_assignments WHERE mentor_id=%s AND learner_id=%s", (mentor_id, learner_id))
    existing = cursor.fetchone()
    
    if not existing:
        cursor.execute("""
            INSERT INTO mentor_assignments (mentor_id, learner_id, assigned_by, status, notes, assigned_at)
            VALUES (%s, %s, %s, 'active', %s, NOW())
        """, (mentor_id, learner_id, mentor_id, f"From booking #{booking_id}"))
        print(f"  CREATED: mentor_id={mentor_id} -> learner_id={learner_id}")
    else:
        print(f"  EXISTS: mentor_id={mentor_id} -> learner_id={learner_id}")

cursor.execute("SET FOREIGN_KEY_CHECKS = 1")
conn.commit()

# Show all assignments now
print("\n=== ALL ASSIGNMENTS ===")
cursor.execute("SELECT mentor_id, learner_id, status FROM mentor_assignments")
for a in cursor.fetchall():
    print(f"  mentor_id={a[0]} -> learner_id={a[1]}, status={a[2]}")

cursor.close()
conn.close()
print("\nDone! Refresh dashboard.")
