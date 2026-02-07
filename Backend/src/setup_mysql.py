"""
MySQL Database Setup Script
Use this for local development with MySQL to create the database if it doesn't exist.
"""
import pymysql
from config import Config
try:
    from urllib.parse import urlparse
except ImportError:
    from urlparse import urlparse

def create_database():
    """Create database from Config.DATABASE_URI"""
    uri = Config.DATABASE_URI
    
    # Simple check to ensure we are using MySQL
    if 'mysql' not in uri and 'mariadb' not in uri:
        print(f"Skipping MySQL setup: URI indicates {uri.split(':')[0]}")
        return

    # Parse connection string
    # mysql+pymysql://user:pass@host:port/dbname
    try:
        # Remove dialect if present
        if '+pymysql' in uri:
            uri = uri.replace('+pymysql', '')
            
        result = urlparse(uri)
        username = result.username
        password = result.password
        host = result.hostname
        port = result.port or 3306
        dbname = result.path.lstrip('/')
        
        print(f"Connecting to MySQL at {host}:{port}...")
        
        # Connect to MySQL server (no database selected)
        conn = pymysql.connect(
            host=host,
            user=username,
            password=password,
            port=port
        )
        
        try:
            with conn.cursor() as cursor:
                # Check if database exists
                cursor.execute(f"SHOW DATABASES LIKE '{dbname}'")
                if not cursor.fetchone():
                    print(f"Creating database '{dbname}'...")
                    cursor.execute(f"CREATE DATABASE {dbname} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
                    print(f"✓ Database '{dbname}' created successfully!")
                else:
                    print(f"✓ Database '{dbname}' already exists.")
        finally:
            conn.close()
            
        return True
        
    except Exception as e:
        print(f"✗ detailed error: {e}")
        print("Note: If you are using Railway, the database usually already exists.")
        return False

if __name__ == "__main__":
    print("-" * 50)
    print("MySQL Setup")
    print("-" * 50)
    
    if create_database():
        print("\nNow you can run: python init_db.py")
