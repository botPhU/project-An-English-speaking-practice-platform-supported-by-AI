"""
Seed Pending Mentor Applications using raw SQL
"""
import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from datetime import datetime, timedelta
from infrastructure.databases.mssql import engine
from sqlalchemy import text
import json

def seed_mentor_applications():
    print("=" * 60)
    print("SEEDING PENDING MENTOR APPLICATIONS (SQL)")
    print("=" * 60)
    
    applications = [
        {
            'full_name': 'Nguyễn Văn Minh',
            'email': 'nguyenvanminh@email.com',
            'phone': '0901234567',
            'date_of_birth': '1990-05-15',
            'current_job': 'English Teacher',
            'company': 'ABC Language Center',
            'years_experience': 5,
            'education_level': 'Master',
            'major': 'English Education',
            'university': 'Hanoi University',
            'english_certificates': json.dumps([
                {'name': 'IELTS', 'score': '8.0', 'year': 2022},
                {'name': 'TESOL', 'score': 'Certified', 'year': 2021}
            ]),
            'native_language': 'Vietnamese',
            'english_level': 'C1',
            'teaching_experience': '5 năm dạy IELTS và giao tiếp',
            'specializations': json.dumps(['IELTS', 'Conversation', 'Business English']),
            'target_students': json.dumps(['Intermediate', 'Advanced']),
            'available_hours_per_week': 20,
            'motivation': 'Muốn chia sẻ kiến thức và giúp nhiều người cải thiện tiếng Anh',
            'teaching_style': 'Interactive and practical approach',
            'status': 'pending'
        },
        {
            'full_name': 'Trần Thị Hương',
            'email': 'tranthihuong@email.com',
            'phone': '0912345678',
            'date_of_birth': '1995-08-20',
            'current_job': 'Corporate Trainer',
            'company': 'XYZ Corporation',
            'years_experience': 3,
            'education_level': 'Bachelor',
            'major': 'Business English',
            'university': 'HCMC University',
            'english_certificates': json.dumps([{'name': 'TOEIC', 'score': '950', 'year': 2023}]),
            'native_language': 'Vietnamese',
            'english_level': 'C1',
            'teaching_experience': '3 năm training tiếng Anh doanh nghiệp',
            'specializations': json.dumps(['Business English', 'TOEIC']),
            'target_students': json.dumps(['Business Professionals']),
            'available_hours_per_week': 15,
            'motivation': 'Đam mê giảng dạy và muốn mở rộng tầm ảnh hưởng',
            'teaching_style': 'Professional and case-study based',
            'status': 'pending'
        },
        {
            'full_name': 'Lê Hoàng Nam',
            'email': 'lehoangnam@email.com',
            'phone': '0923456789',
            'date_of_birth': '1988-03-10',
            'current_job': 'Freelance English Tutor',
            'company': 'Self-employed',
            'years_experience': 8,
            'education_level': 'Master',
            'major': 'Applied Linguistics',
            'university': 'VNU Hanoi',
            'english_certificates': json.dumps([
                {'name': 'IELTS', 'score': '8.5', 'year': 2020},
                {'name': 'CELTA', 'score': 'Pass A', 'year': 2019}
            ]),
            'native_language': 'Vietnamese',
            'english_level': 'C2',
            'teaching_experience': '8 năm dạy IELTS, nhiều học viên đạt 7.0+',
            'specializations': json.dumps(['IELTS Speaking', 'IELTS Writing']),
            'target_students': json.dumps(['Advanced', 'IELTS Candidates']),
            'available_hours_per_week': 30,
            'motivation': 'Muốn giúp học viên đạt mục tiêu du học',
            'teaching_style': 'Personalized feedback',
            'status': 'pending'
        },
        {
            'full_name': 'Phạm Quỳnh Chi',
            'email': 'phamquynhchi@email.com',
            'phone': '0934567890',
            'date_of_birth': '1992-11-25',
            'current_job': 'English Lecturer',
            'company': 'FPT University',
            'years_experience': 6,
            'education_level': 'PhD Candidate',
            'major': 'English Language Teaching',
            'university': 'FPT University',
            'english_certificates': json.dumps([
                {'name': 'IELTS', 'score': '8.0', 'year': 2021}
            ]),
            'native_language': 'Vietnamese',
            'english_level': 'C2',
            'teaching_experience': '6 năm giảng dạy đại học',
            'specializations': json.dumps(['Pronunciation', 'Grammar', 'Academic Writing']),
            'target_students': json.dumps(['University Students']),
            'available_hours_per_week': 10,
            'motivation': 'Muốn áp dụng phương pháp giảng dạy hiện đại',
            'teaching_style': 'Research-based and student-centered',
            'status': 'pending'
        }
    ]
    
    try:
        with engine.connect() as conn:
            # Check table structure first
            try:
                result = conn.execute(text("SELECT TOP 1 * FROM mentor_applications"))
                columns = result.keys()
                print(f"✓ Table columns: {list(columns)}")
            except Exception as e:
                print(f"⚠ Table check error: {e}")
            
            # Clear old pending
            conn.execute(text("DELETE FROM mentor_applications WHERE status = 'pending'"))
            conn.commit()
            print("✓ Cleared old pending applications")
            
            # Insert new applications - using dynamic column insert
            for app in applications:
                # Build insert based on available columns
                insert_sql = """
                INSERT INTO mentor_applications (
                    full_name, email, phone, date_of_birth, current_job, company,
                    years_experience, education_level, major, university,
                    english_certificates, native_language, english_level,
                    teaching_experience, specializations, target_students,
                    available_hours_per_week, motivation, teaching_style, status, created_at
                ) VALUES (
                    :full_name, :email, :phone, :date_of_birth, :current_job, :company,
                    :years_experience, :education_level, :major, :university,
                    :english_certificates, :native_language, :english_level,
                    :teaching_experience, :specializations, :target_students,
                    :available_hours_per_week, :motivation, :teaching_style, :status, GETDATE()
                )
                """
                try:
                    conn.execute(text(insert_sql), app)
                    print(f"   + Added: {app['full_name']}")
                except Exception as e:
                    # Try simpler insert with fewer columns
                    print(f"   ⚠ Full insert failed, trying simple insert...")
                    simple_sql = """
                    INSERT INTO mentor_applications (full_name, email, status, created_at)
                    VALUES (:full_name, :email, :status, GETDATE())
                    """
                    try:
                        conn.execute(text(simple_sql), {
                            'full_name': app['full_name'],
                            'email': app['email'],
                            'status': 'pending'
                        })
                        print(f"   + Added (simple): {app['full_name']}")
                    except Exception as e2:
                        print(f"   ❌ Error: {e2}")
            
            conn.commit()
            
            # Show stats
            result = conn.execute(text("SELECT status, COUNT(*) as cnt FROM mentor_applications GROUP BY status"))
            print("\n📊 Stats:")
            for row in result:
                print(f"   - {row[0]}: {row[1]}")
            
            print("\n✅ Done!")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    seed_mentor_applications()
