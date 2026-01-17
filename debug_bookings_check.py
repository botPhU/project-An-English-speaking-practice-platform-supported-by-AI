"""Check bookings in database"""
import sys
sys.path.insert(0, 'Flask-CleanArchitecture/src')

from infrastructure.databases.mssql import session, get_db_session
from infrastructure.models.mentor_booking_model import MentorBookingModel
from infrastructure.models.user_model import UserModel

print("=" * 60)
print("BOOKING DEBUG REPORT")
print("=" * 60)

with get_db_session() as db:
    # Get all bookings
    bookings = db.query(MentorBookingModel).all()
    print(f"\n📋 Total bookings in database: {len(bookings)}")
    
    if bookings:
        print("\n📝 Booking Details:")
        print("-" * 60)
        for b in bookings:
            learner = db.query(UserModel).filter_by(id=b.learner_id).first()
            mentor = db.query(UserModel).filter_by(id=b.mentor_id).first()
            
            print(f"  ID: {b.id}")
            print(f"  Learner ID: {b.learner_id} ({learner.full_name if learner else 'N/A'})")
            print(f"  Mentor ID: {b.mentor_id} ({mentor.full_name if mentor else 'N/A'})")
            print(f"  Date: {b.scheduled_date}")
            print(f"  Time: {b.scheduled_time}")
            print(f"  Topic: {b.topic}")
            print(f"  Status: {b.status}")
            print("-" * 60)
    else:
        print("\n⚠️ No bookings found in database!")
    
    # Get all mentors
    mentors = db.query(UserModel).filter_by(role='mentor').all()
    print(f"\n👨‍🏫 Mentors in database:")
    for m in mentors:
        print(f"  ID: {m.id} - {m.full_name or m.user_name}")

print("\n✅ Debug complete!")
