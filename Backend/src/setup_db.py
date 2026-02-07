"""
Quick script to create database and test connection
"""
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Connection params
DB_HOST = "127.0.0.1"
DB_PORT = "5432"
DB_USER = "postgres"
DB_PASSWORD = "123"
DB_NAME = "aesp_db"

def test_connection():
    """Test PostgreSQL connection"""
    print("Testing PostgreSQL connection...")
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            database="postgres"  # Connect to default database first
        )
        print("✓ Connection successful!")
        conn.close()
        return True
    except Exception as e:
        print(f"✗ Connection failed: {e}")
        return False

def create_database():
    """Create aesp_db database if not exists"""
    print(f"\nCreating database '{DB_NAME}'...")
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            database="postgres"
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Check if database exists
        cursor.execute(f"SELECT 1 FROM pg_database WHERE datname = '{DB_NAME}'")
        exists = cursor.fetchone()
        
        if not exists:
            cursor.execute(f"CREATE DATABASE {DB_NAME}")
            print(f"✓ Database '{DB_NAME}' created!")
        else:
            print(f"✓ Database '{DB_NAME}' already exists")
        
        cursor.close()
        conn.close()
        return True
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

def run_sql_script():
    """Run the create_tables.sql script"""
    print("\nCreating tables...")
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )
        cursor = conn.cursor()
        
        # Read and execute SQL file
        with open("scripts/create_tables.sql", "r", encoding="utf-8") as f:
            sql = f.read()
        
        cursor.execute(sql)
        conn.commit()
        
        # List tables
        cursor.execute("""
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public' ORDER BY table_name
        """)
        tables = cursor.fetchall()
        
        print("✓ Tables created successfully!")
        print("\nTables in database:")
        for table in tables:
            print(f"  - {table[0]}")
        
        cursor.close()
        conn.close()
        return True
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("AESP PostgreSQL Database Setup")
    print("=" * 50)
    
    if test_connection():
        if create_database():
            run_sql_script()
    
    print("\n" + "=" * 50)
    print("Setup complete!")
    print("=" * 50)
