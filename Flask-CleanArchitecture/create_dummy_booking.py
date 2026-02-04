import sys
import os
import pymysql
from datetime import datetime, timedelta

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
        # Check if users exist (Learner ID 3, Mentor ID 2)
        cursor.execute("SELECT id, role FROM flask_user WHERE id IN (2, 3)")
        users = {u['id']: u['role'] for u in cursor.fetchall()}
        
        if 2 not in users or users.get(2) != 'mentor':
            print("Warning: Mentor (ID 2) not found or wrong role. Checking any mentor...")
            cursor.execute("SELECT id FROM flask_user WHERE role='mentor' LIMIT 1")
            m = cursor.fetchone()
            if m: mentor_id = m['id']
            else: 
                print("No mentor found.")
                sys.exit(1)
        else:
            mentor_id = 2
            
        if 3 not in users:
            print("Warning: Learner (ID 3) not found. Checking any learner...")
            cursor.execute("SELECT id FROM flask_user WHERE role='learner' LIMIT 1")
            l = cursor.fetchone()
            if l: learner_id = l['id']
            else:
                print("No learner found. Creating one...")
                cursor.execute("INSERT INTO flask_user (username, password_hash, email, role, full_name, created_at, is_active) VALUES ('test_learner', 'hash', 'learner@test.com', 'learner', 'Học viên Test', NOW(), 1)")
                learner_id = cursor.lastrowid
                conn.commit()
        else:
            learner_id = 3

        print(f"Creating booking: Mentor {mentor_id} - Learner {learner_id}")
        
        # Create booking
        tomorrow = datetime.now() + timedelta(days=1)
        sql = """
        INSERT INTO mentor_bookings 
        (mentor_id, learner_id, scheduled_date, scheduled_time, duration_minutes, topic, notes, status)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(sql, (
            mentor_id, learner_id, 
            tomorrow.date(), '14:00:00', 45, 
            'Luyện phát âm cơ bản', 'Mong thầy giúp đỡ phần nối âm', 
            'pending'
        ))
        
        conn.commit()
        print(f"Booking created successfully! ID: {cursor.lastrowid}")
        
    conn.close()

except Exception as e:
    print(f"Error: {e}")
