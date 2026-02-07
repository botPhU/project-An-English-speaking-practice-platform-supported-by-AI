"""
Seed Database with Sample Data using raw SQL (MySQL compatible)
Run this from Flask-CleanArchitecture folder:
    python seed_admin_sql.py
"""
import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from datetime import datetime, timedelta
import random
from sqlalchemy import text

def seed_database():
    from infrastructure.databases.mssql import engine
    
    print("=" * 60)
    print("SEEDING ADMIN DATA (SQL)")
    print("=" * 60)
    
    with engine.connect() as conn:
        
        # =====================
        # 1. MENTOR APPLICATIONS
        # =====================
        print("\n[1] Seeding Mentor Applications...")
        
        mentor_apps = [
            ("Trần Văn Minh", "mentor.minh@gmail.com", "0901234567", "pending", "Master", "Ngôn ngữ Anh", "ĐH Ngoại Ngữ Hà Nội", 3, "C1"),
            ("Nguyễn Thị Hoa", "hoa.nguyen@gmail.com", "0912345678", "pending", "Master", "TESOL", "University of Melbourne", 5, "C2"),
            ("Lê Hoàng Nam", "nam.le.teacher@gmail.com", "0987654321", "approved", "Bachelor", "CNTT", "ĐH Bách Khoa TP.HCM", 2, "C1"),
            ("Phạm Quỳnh Anh", "quynh.anh.edu@gmail.com", "0976543210", "rejected", "Bachelor", "Sư phạm Anh", "FPT University", 1, "B2"),
        ]
        
        for m in mentor_apps:
            try:
                check = conn.execute(text("SELECT id FROM mentor_applications WHERE email = :email LIMIT 1"), {"email": m[1]})
                if check.fetchone():
                    print(f"   - Exists: {m[0]}")
                    continue
                    
                conn.execute(text("""
                    INSERT INTO mentor_applications 
                    (full_name, email, phone, status, education_level, major, university, years_experience, english_level, created_at)
                    VALUES (:name, :email, :phone, :status, :edu, :major, :uni, :years, :level, NOW())
                """), {
                    "name": m[0], "email": m[1], "phone": m[2], "status": m[3],
                    "edu": m[4], "major": m[5], "uni": m[6], "years": m[7], "level": m[8]
                })
                print(f"   ✓ Added: {m[0]} ({m[3]})")
            except Exception as e:
                print(f"   ⚠ Error with {m[0]}: {str(e)[:80]}")
        
        conn.commit()
        
        # =====================
        # 2. SUPPORT TICKETS
        # =====================
        print("\n[2] Seeding Support Tickets...")
        
        # Get first learner (MySQL syntax)
        learner = conn.execute(text("SELECT id FROM flask_user WHERE role = 'learner' LIMIT 1")).fetchone()
        learner_id = learner[0] if learner else 1
        
        tickets = [
            (learner_id, "Không thể truy cập bài học Premium", "Tôi đã mua gói Premium nhưng không mở được bài học.", "subscription", "open", "high"),
            (learner_id, "Yêu cầu đổi mentor", "Mentor hiện tại lịch học không phù hợp.", "booking", "in_progress", "medium"),
            (learner_id, "Lỗi thanh toán VNPay", "Bị trừ tiền nhưng gói không kích hoạt. Mã: TXN12345", "payment", "open", "urgent"),
            (learner_id, "Góp ý tính năng mới", "Thêm tính năng luyện phát âm offline.", "other", "resolved", "low"),
        ]
        
        for t in tickets:
            try:
                check = conn.execute(text("SELECT id FROM support_tickets WHERE subject = :subject AND user_id = :uid LIMIT 1"), 
                                     {"subject": t[1], "uid": t[0]})
                if check.fetchone():
                    print(f"   - Exists: {t[1][:30]}...")
                    continue
                    
                conn.execute(text("""
                    INSERT INTO support_tickets 
                    (user_id, subject, description, category, status, priority, created_at)
                    VALUES (:uid, :subj, :desc, :cat, :status, :pri, NOW())
                """), {
                    "uid": t[0], "subj": t[1], "desc": t[2], "cat": t[3], "status": t[4], "pri": t[5]
                })
                print(f"   ✓ Added: {t[1][:35]}...")
            except Exception as e:
                print(f"   ⚠ Error: {str(e)[:80]}")
        
        conn.commit()
        
        # =====================
        # 3. ACTIVITY LOGS
        # =====================
        print("\n[3] Seeding Activity Logs...")
        
        admin = conn.execute(text("SELECT id FROM flask_user WHERE role = 'admin' LIMIT 1")).fetchone()
        admin_id = admin[0] if admin else 1
        
        activities = [
            ("user_registration", "Người dùng mới đăng ký", "user"),
            ("package_purchase", "Mua gói Premium thành công", "purchase"),
            ("mentor_approved", "Phê duyệt đơn mentor", "mentor"),
            ("session_completed", "Hoàn thành buổi luyện nói AI", "session"),
            ("ticket_resolved", "Xử lý yêu cầu hỗ trợ", "ticket"),
        ]
        
        for a in activities:
            try:
                conn.execute(text("""
                    INSERT INTO activity_logs 
                    (user_id, action_type, description, entity_type, ip_address, created_at)
                    VALUES (:uid, :action, :desc, :entity, :ip, NOW())
                """), {
                    "uid": admin_id, "action": a[0], "desc": a[1], "entity": a[2],
                    "ip": f"192.168.1.{random.randint(1,255)}"
                })
                print(f"   ✓ Added: {a[1]}")
            except Exception as e:
                print(f"   ⚠ Error: {str(e)[:80]}")
        
        conn.commit()
        
        # =====================
        # 4. SYSTEM SETTINGS  
        # =====================
        print("\n[4] Seeding System Settings...")
        
        settings = [
            ("site_name", "AESP - AI English Speaking Practice", "general"),
            ("support_email", "support@aesp.vn", "general"),
            ("max_free_sessions", "10", "general"),
            ("vnpay_enabled", "true", "payment"),
            ("momo_enabled", "true", "payment"),
        ]
        
        for s in settings:
            try:
                check = conn.execute(text("SELECT id FROM system_settings WHERE `key` = :key LIMIT 1"), {"key": s[0]})
                if check.fetchone():
                    print(f"   - Exists: {s[0]}")
                    continue
                    
                conn.execute(text("""
                    INSERT INTO system_settings (`key`, value, category, updated_at)
                    VALUES (:key, :val, :cat, NOW())
                """), {"key": s[0], "val": s[1], "cat": s[2]})
                print(f"   ✓ Added: {s[0]}")
            except Exception as e:
                print(f"   ⚠ Error: {str(e)[:80]}")
        
        conn.commit()
    
    print("\n" + "=" * 60)
    print("✅ COMPLETED! Refresh admin pages to see data.")
    print("=" * 60)

if __name__ == "__main__":
    seed_database()
