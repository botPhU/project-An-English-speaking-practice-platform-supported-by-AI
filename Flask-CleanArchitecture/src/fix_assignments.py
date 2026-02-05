"""
Fix assignments script - run from Flask-CleanArchitecture/src folder
"""
from infrastructure.databases.mssql import get_db_session
from infrastructure.models.mentor_assignment_model import MentorAssignmentModel
from infrastructure.models.mentor_booking_model import MentorBookingModel
from infrastructure.models.user_model import UserModel
from datetime import datetime

def fix_assignments():
    with get_db_session() as session:
        # Get all confirmed bookings
        print("\n📅 CONFIRMED BOOKINGS:")
        bookings = session.query(MentorBookingModel).filter(
            MentorBookingModel.status == 'confirmed'
        ).all()
        
        for b in bookings:
            learner = session.query(UserModel).get(b.learner_id)
            mentor = session.query(UserModel).get(b.mentor_id)
            print(f"  - Booking #{b.id}: {learner.full_name if learner else '?'} -> {mentor.full_name if mentor else '?'}")
        
        # Get existing assignments
        print("\n👥 EXISTING ASSIGNMENTS:")
        assignments = session.query(MentorAssignmentModel).filter(
            MentorAssignmentModel.status == 'active'
        ).all()
        
        if assignments:
            for a in assignments:
                learner = session.query(UserModel).get(a.learner_id)
                print(f"  - Assignment #{a.id}: {learner.full_name if learner else '?'}")
        else:
            print("  ❌ No active assignments found!")
        
        # Create missing assignments
        print("\n🔧 CREATING MISSING ASSIGNMENTS...")
        for b in bookings:
            existing = session.query(MentorAssignmentModel).filter(
                MentorAssignmentModel.mentor_id == b.mentor_id,
                MentorAssignmentModel.learner_id == b.learner_id
            ).first()
            
            if not existing:
                new_assignment = MentorAssignmentModel(
                    mentor_id=b.mentor_id,
                    learner_id=b.learner_id,
                    assigned_by=b.mentor_id,
                    status='active',
                    notes=f"Auto-fixed from booking #{b.id}",
                    assigned_at=datetime.now()
                )
                session.add(new_assignment)
                session.flush()
                learner = session.query(UserModel).get(b.learner_id)
                print(f"  ✅ Created: {learner.full_name if learner else '?'}")
            elif existing.status != 'active':
                existing.status = 'active'
                existing.updated_at = datetime.now()
                learner = session.query(UserModel).get(b.learner_id)
                print(f"  ✅ Reactivated: {learner.full_name if learner else '?'}")
        
        print("\n✅ Done! Refresh dashboard now.")

if __name__ == '__main__':
    fix_assignments()
