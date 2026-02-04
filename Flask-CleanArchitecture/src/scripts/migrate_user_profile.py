"""
MySQL Migration Script for User Profile Fields
Run this to add new columns to flask_user table
"""

import sys
sys.path.insert(0, '.')

from infrastructure.databases.mssql import engine
from sqlalchemy import text


def migrate():
    """Add new profile columns to MySQL database"""
    
    # MySQL ALTER TABLE statements
    alter_statements = [
        "ALTER TABLE flask_user ADD COLUMN phone_number VARCHAR(20) NULL",
        "ALTER TABLE flask_user ADD COLUMN date_of_birth DATE NULL",
        "ALTER TABLE flask_user ADD COLUMN gender VARCHAR(10) NULL",
        "ALTER TABLE flask_user ADD COLUMN address VARCHAR(255) NULL",
        "ALTER TABLE flask_user ADD COLUMN city VARCHAR(100) NULL",
        "ALTER TABLE flask_user ADD COLUMN country VARCHAR(100) NULL",
        "ALTER TABLE flask_user ADD COLUMN avatar_url VARCHAR(500) NULL",
        "ALTER TABLE flask_user ADD COLUMN bio TEXT NULL",
        "ALTER TABLE flask_user ADD COLUMN profile_completed TINYINT(1) DEFAULT 0",
    ]
    
    print("Starting MySQL migration...")
    print(f"Database: {engine.url}\n")
    
    with engine.connect() as conn:
        for stmt in alter_statements:
            col_name = stmt.split("ADD COLUMN ")[1].split(" ")[0]
            try:
                conn.execute(text(stmt))
                conn.commit()
                print(f"  ✓ Added column '{col_name}'")
            except Exception as e:
                if "Duplicate column name" in str(e):
                    print(f"  - Column '{col_name}' already exists, skipping")
                else:
                    print(f"  ✗ Error adding '{col_name}': {e}")
        
        # Mark all existing users as profile_completed = 1
        try:
            result = conn.execute(text(
                "UPDATE flask_user SET profile_completed = 1 WHERE profile_completed IS NULL OR profile_completed = 0"
            ))
            conn.commit()
            print(f"\n✓ Updated {result.rowcount} existing users with profile_completed = 1")
        except Exception as e:
            print(f"\n✗ Error updating existing users: {e}")
    
    print("\nMigration completed!")


if __name__ == "__main__":
    migrate()
