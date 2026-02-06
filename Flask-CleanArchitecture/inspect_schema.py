"""
Inspect Database Schema
Run this to list columns of tables
"""
import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))
from sqlalchemy import text
from infrastructure.databases.mssql import engine

def inspect_schema():
    print("=" * 60)
    print("DATABASE SCHEMA INSPECTION")
    print("=" * 60)
    
    tables_to_check = [
        'courses'
    ]
    
    with engine.connect() as conn:
        for table in tables_to_check:
            print(f"\n[Table: {table}]")
            try:
                # MySQL syntax for describing table
                result = conn.execute(text(f"DESCRIBE {table}"))
                columns = [row[0] for row in result]
                print(f"   Columns: {', '.join(columns)}")
            except Exception as e:
                print(f"   ⚠ Error or table does not exist: {str(e)[:100]}")

if __name__ == "__main__":
    inspect_schema()
