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
        cursor.execute("DESCRIBE flask_user")
        rows = cursor.fetchall()
        for row in rows:
            print(row)
            
    conn.close()

except Exception as e:
    print(f"Error: {e}")
