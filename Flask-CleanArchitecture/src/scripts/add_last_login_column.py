"""
Add last_login column to flask_user table
"""
import sys
sys.path.insert(0, '.')

from infrastructure.databases.mssql import engine
from sqlalchemy import text


def add_last_login_column():
    """Add last_login column to MySQL database"""
    
    print("Starting last_login migration...")
    print(f"Database: {engine.url}\n")
    
    with engine.connect() as conn:
        try:
            conn.execute(text(
                "ALTER TABLE flask_user ADD COLUMN last_login DATETIME NULL"
            ))
            conn.commit()
            print("  ✓ Added column 'last_login'")
        except Exception as e:
            if "Duplicate column name" in str(e):
                print("  - Column 'last_login' already exists, skipping")
            else:
                print(f"  ✗ Error adding 'last_login': {e}")
    
    print("\nMigration completed!")


if __name__ == "__main__":
    add_last_login_column()

