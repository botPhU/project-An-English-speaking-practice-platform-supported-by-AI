import sys
import os

# Set python path
sys.path.append(os.getcwd())
sys.path.append(os.path.join(os.getcwd(), 'src'))

from sqlalchemy import create_engine, text
from src.config import Config

# Connection
db_uri = Config.DATABASE_URI
if 'mysql+pymysql' not in db_uri:
    # Fallback if config fails to load env
    db_uri = 'mysql+pymysql://root:123@127.0.0.1:3306/aesp_db'

print(f"Connecting to: {db_uri}")
engine = create_engine(db_uri)

try:
    with engine.connect() as connection:
        print("\nChecking Mentor Bookings:")
        result = connection.execute(text("SELECT id, mentor_id, learner_id, status FROM mentor_bookings"))
        rows = result.fetchall()
        print(f"Total bookings found: {len(rows)}")
        for row in rows:
            print(f"Booking: {row}")
            
        # Also check users to confirm IDs
        print("\nChecking Users:")
        users = connection.execute(text("SELECT id, full_name, role FROM flask_user"))
        for u in users:
            print(f"User: {u}")
            
except Exception as e:
    print(f"Error: {e}")
