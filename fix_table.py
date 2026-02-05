"""
Debug mentor_assignments table and fix FK issues
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

# Check table structure
print("1. mentor_assignments structure:")
cursor.execute("DESCRIBE mentor_assignments")
for col in cursor.fetchall():
    print(f"   {col[0]}: {col[1]} | Null: {col[2]} | Key: {col[3]}")

# Check foreign keys
print("\n2. Foreign keys:")
cursor.execute("""
    SELECT CONSTRAINT_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_NAME = 'mentor_assignments' AND REFERENCED_TABLE_NAME IS NOT NULL
""")
for fk in cursor.fetchall():
    print(f"   {fk[0]}: {fk[1]} -> {fk[2]}.{fk[3]}")

# Find user and mentor
print("\n3. Users:")
cursor.execute("SELECT id, full_name, email, role FROM flask_user WHERE email IN ('user03@gmail.com', 'mentor1@test.com')")
for u in cursor.fetchall():
    print(f"   #{u[0]}: {u[1]} ({u[2]}) - {u[3]}")

# Try dropping and recreating the assignments table without FK
print("\n4. Fixing table...")
cursor.execute("SET FOREIGN_KEY_CHECKS = 0")

# Get all data first
cursor.execute("SELECT * FROM mentor_assignments")
old_data = cursor.fetchall()
print(f"   Old data: {len(old_data)} rows")

# Drop and recreate without FK
cursor.execute("DROP TABLE IF EXISTS mentor_assignments")
cursor.execute("""
    CREATE TABLE mentor_assignments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        mentor_id INT NOT NULL,
        learner_id INT NOT NULL,
        assigned_by INT,
        status VARCHAR(50) DEFAULT 'active',
        notes TEXT,
        assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME,
        ended_at DATETIME,
        UNIQUE KEY uq_mentor_learner (mentor_id, learner_id)
    )
""")
print("   Recreated table!")

# Insert learner for mentor 2
learner_id = 11  # user03@gmail.com
mentor_id = 2    # mentor1

cursor.execute("""
    INSERT INTO mentor_assignments (mentor_id, learner_id, assigned_by, status, notes, assigned_at)
    VALUES (%s, %s, %s, 'active', 'Fixed assignment', NOW())
""", (mentor_id, learner_id, mentor_id))
print(f"   Created: mentor {mentor_id} -> learner {learner_id}")

# Also add Thanh Phu
cursor.execute("""
    INSERT INTO mentor_assignments (mentor_id, learner_id, assigned_by, status, notes, assigned_at)
    VALUES (%s, %s, %s, 'active', 'Fixed assignment', NOW())
""", (2, 1, 2))
print("   Created: mentor 2 -> learner 1")

cursor.execute("SET FOREIGN_KEY_CHECKS = 1")
conn.commit()

print("\n5. Final assignments:")
cursor.execute("""
    SELECT a.id, a.mentor_id, a.learner_id, u.full_name, u.email
    FROM mentor_assignments a
    LEFT JOIN flask_user u ON a.learner_id = u.id
""")
for a in cursor.fetchall():
    print(f"   #{a[0]}: mentor {a[1]} -> {a[3]} ({a[4]})")

cursor.close()
conn.close()
print("\nDone!")
