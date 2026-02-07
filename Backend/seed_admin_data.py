"""
Seed Database with Sample Data for Admin Pages
Run this from Flask-CleanArchitecture folder:
    python seed_admin_data.py
"""
import os
import sys

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from datetime import datetime, timedelta
import random

def seed_database():
    """Seed all admin-related tables with sample data"""
    
    # Import inside function after path setup
    from infrastructure.databases.mssql import SessionLocal, engine
    from infrastructure.databases.base import Base
    from infrastructure.models.user_model import UserModel
    from infrastructure.models.package_model import PackageModel
    from infrastructure.models.purchase_model import PurchaseModel
    from infrastructure.models.mentor_application_model import MentorApplicationModel
    from infrastructure.models.admin_models import SupportTicketModel, TicketMessageModel, ActivityLogModel, SystemSettingModel
    
    # Create tables if not exist
    Base.metadata.create_all(bind=engine)
    
    session = SessionLocal()
    
    print("=" * 60)
    print("SEEDING ADMIN DATA")
    print("=" * 60)
    
    # =====================
    # 1. PACKAGES (Gói dịch vụ)
    # =====================
    print("\n[1] Seeding Packages...")
    
    packages_data = [
        {
            "name": "Basic",
            "description": "Gói cơ bản cho người mới bắt đầu. Truy cập bài học AI, luyện phát âm cơ bản.",
            "price": 0,
            "duration_days": 30,
            "has_mentor": False,
            "has_ai_advanced": False,
            "max_sessions_per_month": 10,
            "features": '["Luyện nói với AI","10 buổi/tháng","Bài học cơ bản","Theo dõi tiến độ"]',
            "is_active": True
        },
        {
            "name": "Premium",
            "description": "Gói nâng cao với mentor hỗ trợ 1-1. Phù hợp học viên muốn cải thiện nhanh.",
            "price": 299000,
            "duration_days": 30,
            "has_mentor": True,
            "has_ai_advanced": False,
            "max_sessions_per_month": 30,
            "features": '["Tất cả tính năng Basic","Mentor 1-1","30 buổi/tháng","Đánh giá chi tiết","Lộ trình cá nhân"]',
            "is_active": True
        },
        {
            "name": "Pro",
            "description": "Gói chuyên nghiệp với AI nâng cao và mentor VIP. Dành cho người học nghiêm túc.",
            "price": 599000,
            "duration_days": 30,
            "has_mentor": True,
            "has_ai_advanced": True,
            "max_sessions_per_month": 999,
            "features": '["Tất cả tính năng Premium","AI phân tích sâu","Không giới hạn buổi","Mentor VIP","Chứng chỉ hoàn thành"]',
            "is_active": True
        },
        {
            "name": "Trial",
            "description": "Gói dùng thử 7 ngày miễn phí. Trải nghiệm đầy đủ tính năng Premium.",
            "price": 0,
            "duration_days": 7,
            "has_mentor": True,
            "has_ai_advanced": False,
            "max_sessions_per_month": 5,
            "features": '["Dùng thử 7 ngày","5 buổi học","1 buổi mentor","Trải nghiệm Premium"]',
            "is_active": True
        }
    ]
    
    for pkg in packages_data:
        existing = session.query(PackageModel).filter_by(name=pkg["name"]).first()
        if not existing:
            p = PackageModel(**pkg, created_at=datetime.now(), updated_at=datetime.now())
            session.add(p)
            print(f"   ✓ Added package: {pkg['name']}")
        else:
            print(f"   - Package exists: {pkg['name']}")
    
    session.commit()
    
    # =====================
    # 2. MENTOR APPLICATIONS (Đơn đăng ký mentor)
    # =====================
    print("\n[2] Seeding Mentor Applications...")
    
    # Get existing users to link
    learners = session.query(UserModel).filter_by(role='learner').limit(10).all()
    
    mentor_apps = [
        {
            "full_name": "Trần Văn Minh",
            "email": "mentor.minh@gmail.com",
            "phone": "0901234567",
            "education_level": "Master",
            "major": "Ngôn ngữ Anh",
            "university": "Đại học Ngoại Ngữ Hà Nội",
            "years_experience": 3,
            "english_level": "C1",
            "english_certificates": '[{"name": "IELTS", "score": "8.0", "year": 2022}]',
            "specializations": '["IELTS Speaking", "Business English"]',
            "teaching_experience": "3 năm giảng dạy IELTS tại các trung tâm lớn.",
            "motivation": "Đam mê giúp học viên Việt Nam tự tin nói tiếng Anh.",
            "available_hours_per_week": 20,
            "status": "pending",
            "created_at": datetime.now() - timedelta(days=2)
        },
        {
            "full_name": "Nguyễn Thị Hoa",
            "email": "hoa.nguyen@gmail.com",
            "phone": "0912345678",
            "education_level": "Master",
            "major": "TESOL",
            "university": "University of Melbourne",
            "years_experience": 5,
            "english_level": "C2",
            "english_certificates": '[{"name": "CELTA", "score": "Pass A", "year": 2020}]',
            "specializations": '["Pronunciation", "Academic English"]',
            "teaching_experience": "5 năm giảng viên tại trung tâm Anh ngữ quốc tế. Chứng chỉ CELTA.",
            "motivation": "Giúp học viên phát âm chuẩn và tự tin giao tiếp.",
            "available_hours_per_week": 15,
            "status": "pending",
            "created_at": datetime.now() - timedelta(days=5)
        },
        {
            "full_name": "Lê Hoàng Nam",
            "email": "nam.le.teacher@gmail.com",
            "phone": "0987654321",
            "education_level": "Bachelor",
            "major": "Công nghệ thông tin",
            "university": "ĐH Bách Khoa TP.HCM",
            "years_experience": 2,
            "english_level": "C1",
            "english_certificates": '[{"name": "TOEFL iBT", "score": "115", "year": 2021}]',
            "specializations": '["Conversation", "Daily English"]',
            "teaching_experience": "2 năm làm việc tại công ty đa quốc gia, sử dụng tiếng Anh hàng ngày.",
            "motivation": "Chia sẻ kinh nghiệm giao tiếp tiếng Anh trong môi trường làm việc.",
            "available_hours_per_week": 10,
            "status": "approved",
            "created_at": datetime.now() - timedelta(days=10),
            "reviewed_at": datetime.now() - timedelta(days=8)
        },
        {
            "full_name": "Phạm Quỳnh Anh",
            "email": "quynh.anh.edu@gmail.com",
            "phone": "0976543210",
            "education_level": "Bachelor",
            "major": "Sư phạm Anh",
            "university": "FPT University",
            "years_experience": 1,
            "english_level": "B2",
            "english_certificates": '[{"name": "IELTS", "score": "7.5", "year": 2023}]',
            "specializations": '["Kids English", "Beginner"]',
            "teaching_experience": "1 năm gia sư tiếng Anh cho trẻ em.",
            "motivation": "Yêu trẻ em và muốn truyền đam mê học tiếng Anh cho các em.",
            "available_hours_per_week": 25,
            "status": "rejected",
            "created_at": datetime.now() - timedelta(days=15),
            "reviewed_at": datetime.now() - timedelta(days=12),
            "rejection_reason": "Cần thêm chứng chỉ giảng dạy chính thức (CELTA/TESOL)"
        }
    ]
    
    try:
        for app in mentor_apps:
            existing = session.query(MentorApplicationModel).filter_by(email=app["email"]).first()
            if not existing:
                ma = MentorApplicationModel(**app)
                session.add(ma)
                print(f"   ✓ Added mentor application: {app['full_name']} ({app['status']})")
            else:
                print(f"   - Application exists: {app['email']}")
        
        session.commit()
    except Exception as e:
        print(f"   ⚠ Error seeding mentor applications: {str(e)[:100]}")
        session.rollback()
    
    # =====================
    # 3. SUPPORT TICKETS (Yêu cầu hỗ trợ)
    # =====================
    print("\n[3] Seeding Support Tickets...")
    
    if learners:
        tickets_data = [
            {
                "user_id": learners[0].id if len(learners) > 0 else 1,
                "subject": "Không thể truy cập bài học Premium",
                "description": "Tôi đã mua gói Premium nhưng không thể mở các bài học nâng cao. Vui lòng kiểm tra giúp.",
                "category": "subscription",
                "status": "open",
                "priority": "high"
            },
            {
                "user_id": learners[1].id if len(learners) > 1 else 1,
                "subject": "Yêu cầu đổi mentor",
                "description": "Mentor hiện tại lịch học không phù hợp với tôi. Tôi muốn đổi sang mentor khác có lịch linh hoạt hơn.",
                "category": "booking",
                "status": "in_progress",
                "priority": "medium"
            },
            {
                "user_id": learners[2].id if len(learners) > 2 else 1,
                "subject": "Lỗi thanh toán VNPay",
                "description": "Tôi thanh toán qua VNPay nhưng bị trừ tiền mà gói không được kích hoạt. Mã giao dịch: TXN12345678",
                "category": "payment",
                "status": "open",
                "priority": "urgent"
            },
            {
                "user_id": learners[0].id if len(learners) > 0 else 1,
                "subject": "Góp ý tính năng mới",
                "description": "Tôi nghĩ nên thêm tính năng luyện phát âm offline để học khi không có mạng. Rất hữu ích!",
                "category": "other",
                "status": "resolved",
                "priority": "low"
            },
            {
                "user_id": learners[3].id if len(learners) > 3 else 1,
                "subject": "Hỏi về việc nâng cấp gói",
                "description": "Tôi muốn nâng từ Basic lên Pro. Có được giảm giá không? Tôi đã dùng được 2 tuần rồi.",
                "category": "subscription",
                "status": "closed",
                "priority": "medium"
            }
        ]
        
        for ticket in tickets_data:
            existing = session.query(SupportTicketModel).filter_by(
                subject=ticket["subject"], 
                user_id=ticket["user_id"]
            ).first()
            if not existing:
                t = SupportTicketModel(**ticket, created_at=datetime.now() - timedelta(hours=random.randint(1, 72)))
                session.add(t)
                print(f"   ✓ Added ticket: {ticket['subject'][:40]}... ({ticket['status']})")
            else:
                print(f"   - Ticket exists: {ticket['subject'][:30]}...")
        
        session.commit()
    else:
        print("   ⚠ No learners found to link tickets")
    
    # =====================
    # 4. PURCHASES (Lịch sử mua hàng)
    # =====================
    print("\n[4] Seeding Purchases...")
    
    packages = session.query(PackageModel).all()
    
    if learners and packages:
        premium_pkg = next((p for p in packages if p.name == "Premium"), packages[0])
        pro_pkg = next((p for p in packages if p.name == "Pro"), packages[0])
        basic_pkg = next((p for p in packages if p.name == "Basic"), packages[0])
        
        purchases_data = [
            {"user_id": learners[0].id, "package_id": premium_pkg.id, "amount": premium_pkg.price, "status": "completed", "days_ago": 5},
            {"user_id": learners[1].id, "package_id": pro_pkg.id, "amount": pro_pkg.price, "status": "completed", "days_ago": 10},
            {"user_id": learners[2].id, "package_id": basic_pkg.id, "amount": 0, "status": "completed", "days_ago": 15},
            {"user_id": learners[3].id if len(learners) > 3 else learners[0].id, "package_id": premium_pkg.id, "amount": premium_pkg.price, "status": "pending", "days_ago": 1},
        ]
        
        for purchase in purchases_data:
            days = purchase.pop("days_ago")
            existing = session.query(PurchaseModel).filter_by(
                user_id=purchase["user_id"],
                package_id=purchase["package_id"]
            ).first()
            if not existing:
                p = PurchaseModel(
                    **purchase,
                    payment_method="VNPay",
                    created_at=datetime.now() - timedelta(days=days),
                    expires_at=datetime.now() + timedelta(days=30-days)
                )
                session.add(p)
                print(f"   ✓ Added purchase: User {purchase['user_id']} - {purchase['status']}")
            else:
                print(f"   - Purchase exists for user {purchase['user_id']}")
        
        session.commit()
    
    # =====================
    # 5. ACTIVITY LOGS (Nhật ký hoạt động)
    # =====================
    print("\n[5] Seeding Activity Logs...")
    
    activities = [
        {"action_type": "user_registration", "description": "Người dùng mới đăng ký tài khoản", "entity_type": "user"},
        {"action_type": "package_purchase", "description": "Mua gói Premium thành công", "entity_type": "purchase"},
        {"action_type": "mentor_approved", "description": "Phê duyệt đơn đăng ký mentor", "entity_type": "mentor_application"},
        {"action_type": "session_completed", "description": "Hoàn thành buổi luyện nói với AI", "entity_type": "session"},
        {"action_type": "ticket_resolved", "description": "Đã xử lý yêu cầu hỗ trợ", "entity_type": "support_ticket"},
        {"action_type": "system_update", "description": "Cập nhật cấu hình hệ thống", "entity_type": "system"},
        {"action_type": "package_created", "description": "Thêm gói dịch vụ mới", "entity_type": "package"},
        {"action_type": "user_disabled", "description": "Vô hiệu hóa tài khoản vi phạm", "entity_type": "user"},
    ]
    
    admin = session.query(UserModel).filter_by(role='admin').first()
    admin_id = admin.id if admin else 1
    
    for i, act in enumerate(activities):
        log = ActivityLogModel(
            user_id=admin_id,
            action_type=act["action_type"],
            description=act["description"],
            entity_type=act["entity_type"],
            entity_id=i+1,
            ip_address=f"192.168.1.{random.randint(1, 255)}",
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
            created_at=datetime.now() - timedelta(hours=random.randint(1, 168))
        )
        session.add(log)
    
    session.commit()
    print(f"   ✓ Added {len(activities)} activity logs")
    
    # =====================
    # 6. SYSTEM SETTINGS (Cài đặt hệ thống)
    # =====================
    print("\n[6] Seeding System Settings...")
    
    settings = [
        {"key": "site_name", "value": "AESP - AI English Speaking Practice", "category": "general", "description": "Tên website"},
        {"key": "support_email", "value": "support@aesp.vn", "category": "general", "description": "Email hỗ trợ"},
        {"key": "max_free_sessions", "value": "10", "category": "general", "description": "Số buổi học miễn phí mỗi tháng"},
        {"key": "vnpay_enabled", "value": "true", "category": "payment", "description": "Bật/tắt thanh toán VNPay"},
        {"key": "momo_enabled", "value": "true", "category": "payment", "description": "Bật/tắt thanh toán MoMo"},
        {"key": "email_notifications", "value": "true", "category": "notification", "description": "Gửi thông báo qua email"},
        {"key": "session_timeout", "value": "3600", "category": "security", "description": "Thời gian session timeout (giây)"},
        {"key": "maintenance_mode", "value": "false", "category": "general", "description": "Chế độ bảo trì"},
    ]
    
    for setting in settings:
        existing = session.query(SystemSettingModel).filter_by(key=setting["key"]).first()
        if not existing:
            s = SystemSettingModel(**setting, updated_by=admin_id, updated_at=datetime.now())
            session.add(s)
            print(f"   ✓ Added setting: {setting['key']}")
        else:
            print(f"   - Setting exists: {setting['key']}")
    
    session.commit()
    
    print("\n" + "=" * 60)
    print("✅ DATABASE SEEDING COMPLETED!")
    print("=" * 60)
    print("\nRefresh admin pages to see the new data.")
    
    session.close()

if __name__ == "__main__":
    seed_database()
