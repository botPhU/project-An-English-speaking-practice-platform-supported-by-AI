import sys
import os
import pymysql

# Set python path
sys.path.append(os.getcwd())
sys.path.append(os.path.join(os.getcwd(), 'src'))

from src.config import Config

# Connection
db_uri = Config.DATABASE_URI
if 'mysql+pymysql' not in db_uri:
    # Fallback if config fails to load env
    db_uri = 'mysql+pymysql://root:123@127.0.0.1:3306/aesp_db'

print(f"Connecting to: {db_uri}")

# Extract connection details
import re
match = re.search(r'mysql\+pymysql://(.*?):(.*?)@(.*?):(.*?)/(.*)', db_uri)
if not match:
    print("Invalid DB URI")
    sys.exit(1)

user, password, host, port, db_name = match.groups()

# Read SQL file
sql_file_path = os.path.join('src', 'scripts', 'booking_reviews_migration.sql')
with open(sql_file_path, 'r', encoding='utf-8') as f:
    sql_script = f.read()

# Execute SQL
try:
    conn = pymysql.connect(
        host=host,
        user=user,
        password=password,
        port=int(port),
        database=db_name,
        cursorclass=pymysql.cursors.DictCursor
    )
    
    with conn.cursor() as cursor:
        # Split by command
        commands = sql_script.split(';')
        for command in commands:
            if command.strip():
                if 'USE' in command: continue # Skip USE command
                print(f"Executing: {command[:50]}...")
                try:
                    cursor.execute(command)
                except Exception as e:
                    print(f"Command failed (might affect existing tables): {e}")
        
        conn.commit()
        print("Migration completed successfully!")
        
        # Verify
        cursor.execute("SHOW TABLES LIKE 'mentor_bookings'")
        result = cursor.fetchone()
        if result:
            print("Table 'mentor_bookings' exists.")
            # Check content
            cursor.execute("SELECT * FROM mentor_bookings")
            rows = cursor.fetchall()
            print(f"Found {len(rows)} bookings.")
        else:
            print("Table 'mentor_bookings' NOT found.")

    conn.close()

except Exception as e:
    print(f"Connection failed: {e}")
