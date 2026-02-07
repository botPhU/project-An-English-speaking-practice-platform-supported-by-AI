"""Script to activate all mentor accounts"""
from sqlalchemy import text
from infrastructure.databases.mssql import SessionLocal

session = SessionLocal()
try:
    # Activate all mentor accounts
    result = session.execute(text("UPDATE flask_user SET status=1 WHERE role='mentor' OR user_name LIKE 'mentor%' OR user_name LIKE 'Mentor%'"))
    session.commit()
    print(f"Activated mentor accounts")
    
    # Show updated accounts
    result = session.execute(text("SELECT id, user_name, role, status FROM flask_user WHERE role='mentor' OR user_name LIKE 'mentor%'"))
    print("\nMentor accounts:")
    for row in result:
        print(f"  ID: {row[0]}, Username: {row[1]}, Role: {row[2]}, Status: {row[3]}")
except Exception as e:
    print(f"Error: {e}")
finally:
    session.close()
