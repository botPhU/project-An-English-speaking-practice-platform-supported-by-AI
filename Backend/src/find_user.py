"""Script to find mentormeo user"""
from infrastructure.databases.mssql import SessionLocal
from sqlalchemy import text

s = SessionLocal()
try:
    # Find mentormeo user
    r = s.execute(text("SELECT id, user_name, email, role, status, created_at FROM flask_user WHERE user_name LIKE '%mentormeo%' OR email LIKE '%mentormeo%'"))
    rows = [row for row in r]
    print(f"=== TIM MENTORMEO ===")
    print(f"Tim thay {len(rows)} ket qua:")
    for row in rows:
        print(f"ID:{row[0]} | {row[1]} | {row[2]} | Role:{row[3]} | Status:{row[4]} | Created:{row[5]}")
    
    # Also check mentor_applications
    print("\n=== MENTOR APPLICATIONS ===")
    r2 = s.execute(text("SELECT id, user_id, full_name, email, status FROM mentor_applications WHERE full_name LIKE '%mentormeo%' OR email LIKE '%mentormeo%'"))
    rows2 = [row for row in r2]
    print(f"Tim thay {len(rows2)} don dang ky:")
    for row in rows2:
        print(f"AppID:{row[0]} | UserID:{row[1]} | {row[2]} | {row[3]} | Status:{row[4]}")
except Exception as e:
    print(f"Error: {e}")
finally:
    s.close()
