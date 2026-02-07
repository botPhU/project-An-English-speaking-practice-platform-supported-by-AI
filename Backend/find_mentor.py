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
    db_uri = 'mysql+pymysql://root:123@127.0.0.1:3306/aesp_db'

import re
match = re.search(r'mysql\+pymysql://(.*?):(.*?)@(.*?):(.*?)/(.*)', db_uri)
user, password, host, port, db_name = match.groups()

try:
    conn = pymysql.connect(
        host=host, user=user, password=password, port=int(port),
        database=db_name, cursorclass=pymysql.cursors.DictCursor
    )
    
    with conn.cursor() as cursor:
        print("Searching for 'mentor1'...")
        cursor.execute("SELECT id, user_name, email, role FROM flask_user WHERE user_name LIKE '%mentor%' OR full_name LIKE '%mentor%'")
        users = cursor.fetchall()
        for u in users:
            print(f"Found User: {u}")
            
        print("\nChecking bookings for these mentors:")
        for u in users:
            cursor.execute("SELECT * FROM mentor_bookings WHERE mentor_id = %s", (u['id'],))
            bookings = cursor.fetchall()
            print(f"User {u['id']} ({u['user_name']}) has {len(bookings)} bookings.")
            for b in bookings:
                print(f"  - Booking ID: {b['id']}, Status: {b['status']}")
        
    conn.close()

except Exception as e:
    print(f"Error: {e}")
