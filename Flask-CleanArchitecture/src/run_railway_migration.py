"""
AESP - Railway Database Migration Script
Run this script to sync tables to Railway database
"""

import pymysql
import os
from pathlib import Path

# Railway connection details (from your .env)
RAILWAY_CONFIG = {
    'host': 'centerbeam.proxy.rlwy.net',
    'port': 33386,
    'user': 'root',
    'password': 'IIbTiYhuwUWZNEEUSLeKLcUkHbmIiRVD',
    'database': 'railway',
    'charset': 'utf8mb4'
}

def run_migration():
    print("🚀 Connecting to Railway MySQL...")
    
    try:
        connection = pymysql.connect(**RAILWAY_CONFIG)
        cursor = connection.cursor()
        print("✅ Connected to Railway!")
        
        # First, show existing tables
        cursor.execute("SHOW TABLES")
        existing_tables = [row[0] for row in cursor.fetchall()]
        print(f"\n📋 Existing tables on Railway: {len(existing_tables)}")
        for t in existing_tables:
            print(f"   - {t}")
        
        # Read the migration SQL file
        sql_file = Path(__file__).parent / 'scripts' / 'sync_railway_all_tables.sql'
        if not sql_file.exists():
            print(f"❌ SQL file not found: {sql_file}")
            return
        
        print(f"\n📄 Reading migration file: {sql_file}")
        
        with open(sql_file, 'r', encoding='utf-8') as f:
            sql_content = f.read()
        
        # Remove USE statement and comments at the beginning
        # Split by statements
        statements = []
        current = ""
        for line in sql_content.split('\n'):
            line = line.strip()
            if line.startswith('--') or line.startswith('USE '):
                continue
            if line:
                current += line + " "
                if line.endswith(';'):
                    statements.append(current.strip())
                    current = ""
        
        # Filter only CREATE TABLE statements
        create_statements = [s for s in statements if s.upper().startswith('CREATE TABLE')]
        
        print(f"\n🔧 Found {len(create_statements)} CREATE TABLE statements")
        print("⏳ Running migration...")
        
        created = 0
        skipped = 0
        errors = 0
        
        for stmt in create_statements:
            try:
                cursor.execute(stmt)
                # Extract table name for logging
                table_name = stmt.split('(')[0].split()[-1].replace('`', '')
                if table_name.upper() not in [t.upper() for t in existing_tables]:
                    print(f"   ✅ Created: {table_name}")
                    created += 1
                else:
                    skipped += 1
            except pymysql.err.OperationalError as e:
                if "already exists" in str(e):
                    skipped += 1
                else:
                    print(f"   ❌ Error: {e}")
                    errors += 1
            except Exception as e:
                print(f"   ❌ Error: {e}")
                errors += 1
        
        connection.commit()
        
        # Show final table count
        cursor.execute("SHOW TABLES")
        final_tables = [row[0] for row in cursor.fetchall()]
        
        print(f"\n" + "="*50)
        print(f"📊 Migration Complete!")
        print(f"   - Created: {created} new tables")
        print(f"   - Skipped: {skipped} (already exist)")
        print(f"   - Errors: {errors}")
        print(f"   - Total tables on Railway: {len(final_tables)}")
        print("="*50)
        
        print(f"\n📋 All tables on Railway now:")
        for t in sorted(final_tables):
            print(f"   - {t}")
        
        cursor.close()
        connection.close()
        print("\n✅ Done! Connection closed.")
        
    except Exception as e:
        print(f"❌ Connection error: {e}")
        raise

if __name__ == "__main__":
    run_migration()
