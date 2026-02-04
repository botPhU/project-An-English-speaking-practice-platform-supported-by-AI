"""
Check database for mentors - with file output
"""
import sys
import os
import traceback
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from config import Config

def check_mentors():
    output_lines = []
    def log(msg):
        print(msg)
        output_lines.append(msg)
    
    try:
        DATABASE_URI = Config.DATABASE_URI
        log(f"Connecting to: {DATABASE_URI[:80]}...")
        if 'mysql' in DATABASE_URI and '+pymysql' not in DATABASE_URI:
            DATABASE_URI = DATABASE_URI.replace('mysql://', 'mysql+pymysql://')
        
        engine = create_engine(DATABASE_URI)
        
        with engine.connect() as conn:
            # Check if flask_user table exists
            result = conn.execute(text("SHOW TABLES"))
            tables = [r[0] for r in result]
            log(f"Tables found: {len(tables)}")
            
            if 'flask_user' in tables:
                # Check columns
                cols = conn.execute(text("DESCRIBE flask_user"))
                col_names = [c[0] for c in cols]
                log(f"Columns in flask_user: {col_names}")
                
                # Check if new columns exist
                new_cols = ['specialty', 'average_rating', 'review_count', 'hourly_rate']
                missing = [c for c in new_cols if c not in col_names]
                if missing:
                    log(f"MISSING COLUMNS: {missing}")
                else:
                    log("All new columns exist!")
                
                # Check mentors
                mentors = conn.execute(text("SELECT id, user_name, full_name, role FROM flask_user WHERE role='mentor'"))
                mentor_list = list(mentors)
                log(f"Mentors in database: {len(mentor_list)}")
                for m in mentor_list:
                    log(f"  - ID={m[0]}, username={m[1]}, name={m[2]}")
            else:
                log("flask_user table not found!")
    except Exception as e:
        log(f"ERROR: {e}")
        traceback.print_exc()
    
    # Write to file
    with open('check_result.txt', 'w', encoding='utf-8') as f:
        f.write('\n'.join(output_lines))
    print(f"\nResults written to check_result.txt")

if __name__ == "__main__":
    check_mentors()
