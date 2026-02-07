"""
Seed Remaining Admin Data (Mentors, Policies, Feedbacks)
Using raw SQL for MySQL
"""
import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from datetime import datetime, timedelta
import random
from sqlalchemy import text
from werkzeug.security import generate_password_hash

def seed_remaining():
    from infrastructure.databases.mssql import engine
    
    print("=" * 60)
    print("SEEDING REMAINING ADMIN DATA")
    print("=" * 60)
    
    with engine.connect() as conn:
        
        # =====================
        # 0. PREPARE USERS FOR MENTORS
        # =====================
        print("\n[0] Preparing Mentor Users...")
        
        mentors_data = [
            ("mentor.minh@gmail.com", "Trần Văn Minh"),
            ("hoa.nguyen@gmail.com", "Nguyễn Thị Hoa"),
            ("nam.le.teacher@gmail.com", "Lê Hoàng Nam"),
            ("quynh.anh.edu@gmail.com", "Phạm Quỳnh Anh")
        ]
        
        mentor_ids = {}
        password_hash = generate_password_hash("123456")
        
        for email, name in mentors_data:
            try:
                # Check exist
                user = conn.execute(text("SELECT id FROM flask_user WHERE email = :email LIMIT 1"), {"email": email}).fetchone()
                if user:
                    mentor_ids[email] = user[0]
                    print(f"   - User exists: {email} (ID: {user[0]})")
                else:
                    # Create user
                    conn.execute(text("""
                        INSERT INTO flask_user (email, user_name, full_name, password, role, status, created_at)
                        VALUES (:email, :username, :name, :hash, 'mentor', 1, NOW())
                    """), {
                        "email": email, "username": email.split('@')[0], "name": name, "hash": password_hash
                    })
                    # Get ID
                    user_id = conn.execute(text("SELECT LAST_INSERT_ID()")).scalar()
                    mentor_ids[email] = user_id
                    print(f"   ✓ Created user: {email} (ID: {user_id})")
            except Exception as e:
                print(f"   ⚠ Error creating user {email}: {str(e)[:80]}")
        
        conn.commit()
        
        # =====================
        # 1. MENTOR APPLICATIONS (Correct Schema)
        # =====================
        print("\n[1] Seeding Mentor Applications...")
        # Schema: id, user_id, specialty, experience_years, bio, certifications, cv_url, status, reviewed_by, reviewed_at, reject_reason, created_at
        
        apps_data = [
            {
                "email": "mentor.minh@gmail.com",
                "specialty": "IELTS Speaking",
                "exp": 3,
                "bio": "Giáo viên IELTS 3 năm kinh nghiệm.",
                "certs": "IELTS 8.0, TESOL",
                "status": "pending",
                "reason": None
            },
            {
                "email": "hoa.nguyen@gmail.com",
                "specialty": "Pronunciation",
                "exp": 5,
                "bio": "Chuyên gia luyện phát âm.",
                "certs": "CELTA, MA TESOL",
                "status": "pending",
                "reason": None
            },
            {
                "email": "nam.le.teacher@gmail.com",
                "specialty": "Business English",
                "exp": 2,
                "bio": "Tiếng Anh cho người đi làm.",
                "certs": "TOEIC 950",
                "status": "approved",
                "reason": None
            },
            {
                "email": "quynh.anh.edu@gmail.com",
                "specialty": "Kids English",
                "exp": 1,
                "bio": "Dạy tiếng Anh trẻ em.",
                "certs": "IELTS 7.5",
                "status": "rejected",
                "reason": "Thiếu chứng chỉ sư phạm"
            }
        ]
        
        for app in apps_data:
            uid = mentor_ids.get(app["email"])
            if not uid:
                continue
                
            try:
                check = conn.execute(text("SELECT id FROM mentor_applications WHERE user_id = :uid LIMIT 1"), {"uid": uid}).fetchone()
                if check:
                    print(f"   - App exists for: {app['email']}")
                    continue
                
                conn.execute(text("""
                    INSERT INTO mentor_applications 
                    (user_id, specialty, experience_years, bio, certifications, cv_url, status, reject_reason, created_at)
                    VALUES (:uid, :spec, :exp, :bio, :certs, '', :status, :reason, NOW())
                """), {
                    "uid": uid, "spec": app["specialty"], "exp": app["exp"], 
                    "bio": app["bio"], "certs": app["certs"], 
                    "status": app["status"], "reason": app["reason"]
                })
                print(f"   ✓ Added app for: {app['email']}")
            except Exception as e:
                print(f"   ⚠ Error app {app['email']}: {str(e)[:80]}")
        
        conn.commit()
        
        # =====================
        # 2. POLICIES
        # =====================
        print("\n[2] Seeding Policies...")
        # Schema: id, title, content, policy_type, version, is_active, effective_date, created_by, created_at, updated_at
        
        policies = [
            ("Điều khoản sử dụng", "Nội dung điều khoản sử dụng...", "terms", "1.0"),
            ("Chính sách bảo mật", "Chúng tôi cam kết bảo mật...", "privacy", "1.2"),
            ("Chính sách hoàn tiền", "Hoàn tiền trong 7 ngày...", "refund", "1.0"),
            ("Quy chuẩn cộng đồng", "Không spam, không chửi bới...", "community", "1.0"),
        ]
        
        admin = conn.execute(text("SELECT id FROM flask_user WHERE role = 'admin' LIMIT 1")).fetchone()
        admin_id = admin[0] if admin else 1
        
        for p in policies:
            try:
                check = conn.execute(text("SELECT id FROM policies WHERE title = :title LIMIT 1"), {"title": p[0]}).fetchone()
                if check:
                    print(f"   - Policy exists: {p[0]}")
                    continue
                    
                conn.execute(text("""
                    INSERT INTO policies 
                    (title, content, policy_type, version, is_active, effective_date, created_by, created_at, updated_at)
                    VALUES (:title, :content, :type, :ver, 1, NOW(), :uid, NOW(), NOW())
                """), {
                    "title": p[0], "content": p[1], "type": p[2], "ver": p[3], "uid": admin_id
                })
                print(f"   ✓ Added policy: {p[0]}")
            except Exception as e:
                print(f"   ⚠ Error policy {p[0]}: {str(e)[:80]}")
        
        conn.commit()
        
        # =====================
        # 3. FEEDBACKS
        # =====================
        print("\n[3] Seeding Feedbacks...")
        # Schema: id, feedback_text, evaluation, created_at, updated_at, course_id, user_id
        
        course = conn.execute(text("SELECT id FROM courses LIMIT 1")).fetchone()
        course_id = course[0] if course else None
        
        learners = conn.execute(text("SELECT id FROM flask_user WHERE role = 'learner' LIMIT 5")).fetchall()
        learner_ids = [l[0] for l in learners] if learners else []
        
        if course_id and learner_ids:
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
            print("   ⚠ No courses or learners found for feedbacks")
        
    print("\n✅ DONE")

if __name__ == "__main__":
    seed_remaining()
