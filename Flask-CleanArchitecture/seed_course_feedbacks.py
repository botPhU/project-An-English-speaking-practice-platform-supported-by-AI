"""
Seed Course and Feedbacks
"""
import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))
from sqlalchemy import text

def seed_cf():
    from infrastructure.databases.mssql import engine
    print("SEEDING COURSE AND FEEDBACKS")
    
    with engine.connect() as conn:
        # 1. Seed Course
        course_id = None
        try:
            check = conn.execute(text("SELECT id FROM courses LIMIT 1")).fetchone()
            if check:
                course_id = check[0]
                print(f"   - Course exists: {course_id}")
            else:
                conn.execute(text("""
                    INSERT INTO courses (course_name, description, status, start_date, end_date, created_at, updated_at)
                    VALUES (:name, :desc, 'active', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW())
                """), {"name": "English Communication 101", "desc": "Basic communication skills"})
                course_id = conn.execute(text("SELECT LAST_INSERT_ID()")).scalar()
                print(f"   ✓ Created course: English Communication 101 (ID: {course_id})")
        except Exception as e:
            print(f"   ⚠ Error course: {str(e)[:80]}")

        conn.commit()

        # 2. Seed Feedbacks
        if course_id:
            learners = conn.execute(text("SELECT id FROM flask_user WHERE role = 'learner' LIMIT 5")).fetchall()
            learner_ids = [l[0] for l in learners] if learners else []
            
            if learner_ids:
                feedbacks = [
                    ("Khóa học rất hay, AI chấm điểm chuẩn.", 5.0),
                    ("Bài tập hơi khó nhưng bổ ích.", 4.0),
                    ("Cần thêm nhiều bài luyện tập hơn.", 3.5),
                    ("Giao diện đẹp, dễ sử dụng.", 5.0),
                ]
                
                for i, f in enumerate(feedbacks):
                    uid = learner_ids[i % len(learner_ids)]
                    try:
                        conn.execute(text("""
                            INSERT INTO feedbacks 
                            (feedback_text, evaluation, course_id, user_id, created_at, updated_at)
                            VALUES (:text, :eval, :cid, :uid, NOW(), NOW())
                        """), {
                            "text": f[0], "eval": f[1], "cid": course_id, "uid": uid
                        })
                        print(f"   ✓ Added feedback: {f[0][:30]}...")
                    except Exception as e:
                        print(f"   ⚠ Error feedback: {str(e)[:80]}")
                conn.commit()
            else:
                print("   ⚠ No learners found")
        else:
            print("   ⚠ Could not get course ID")

if __name__ == "__main__":
    seed_cf()
