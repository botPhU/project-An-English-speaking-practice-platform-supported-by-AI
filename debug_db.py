"""
Check all users and their roles in Railway database
"""
import pymysql

conn = pymysql.connect(
    host='centerbeam.proxy.rlwy.net',
    port=33386,
    user='root',
    password='IIbTiYhuwUWZNEEUSLeKLcUkHbmIiRVD',
    database='railway'
)

cursor = conn.cursor(pymysql.cursors.DictCursor)

print("\n=== ALL USERS IN RAILWAY ===\n")
cursor.execute("SELECT id, full_name, email, role FROM flask_user ORDER BY id")
for u in cursor.fetchall():
    print(f"  id={u['id']}, name={u['full_name']}, email={u['email']}, role={u['role']}")

print("\n=== MENTOR_ASSIGNMENTS ===\n")
cursor.execute("SELECT * FROM mentor_assignments")
for a in cursor.fetchall():
    print(f"  {a}")

print("\n=== ANALYSIS ===\n")
# Get mentor list
cursor.execute("SELECT id, full_name FROM flask_user WHERE role='mentor'")
mentors = cursor.fetchall()
print(f"Mentors: {mentors}")

for mentor in mentors:
    cursor.execute("""
        SELECT ma.*, u.full_name as learner_name
        FROM mentor_assignments ma
        JOIN flask_user u ON ma.learner_id = u.id
        WHERE ma.mentor_id = %s AND ma.status = 'active'
    """, (mentor['id'],))
    assignments = cursor.fetchall()
    print(f"\nMentor {mentor['id']} ({mentor['full_name']}) has {len(assignments)} active learners:")
    for a in assignments:
        print(f"  - Learner: {a['learner_name']} (id={a['learner_id']})")

cursor.close()
conn.close()
