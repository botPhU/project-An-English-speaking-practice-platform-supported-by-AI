"""
Script to create booking and reviews tables on Railway MySQL
Run: python run_railway_migration.py
"""
import os
import sys

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

def run_migration():
    try:
        from sqlalchemy import create_engine, text
        from config import Config
        
        print("=" * 50)
        print("🚀 Railway MySQL Migration Script")
        print("=" * 50)
        
        # Get database URI from config
        db_uri = Config.DATABASE_URI
        print(f"\n📡 Connecting to: {db_uri[:50]}...")
        
        engine = create_engine(db_uri)
        
        with engine.connect() as conn:
            print("✅ Connected successfully!\n")
            
            # Create mentor_bookings table
            print("📋 Creating mentor_bookings table...")
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS mentor_bookings (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    learner_id INT NOT NULL,
                    mentor_id INT NOT NULL,
                    scheduled_date DATE NOT NULL,
                    scheduled_time TIME NOT NULL,
                    duration_minutes INT DEFAULT 30,
                    topic VARCHAR(255),
                    notes TEXT,
                    status VARCHAR(50) DEFAULT 'pending',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
                    confirmed_at DATETIME,
                    completed_at DATETIME
                )
            """))
            print("   ✅ mentor_bookings created!")
            
            # Create reviews table
            print("📋 Creating reviews table...")
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS reviews (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    learner_id INT NOT NULL,
                    mentor_id INT NOT NULL,
                    session_id INT,
                    booking_id INT,
                    rating INT NOT NULL,
                    comment TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            """))
            print("   ✅ reviews created!")
            
            conn.commit()
            
            # Verify tables
            print("\n📊 Verifying tables...")
            result = conn.execute(text("SHOW TABLES LIKE 'mentor_bookings'"))
            if result.fetchone():
                print("   ✅ mentor_bookings exists")
            else:
                print("   ❌ mentor_bookings NOT found")
                
            result = conn.execute(text("SHOW TABLES LIKE 'reviews'"))
            if result.fetchone():
                print("   ✅ reviews exists")
            else:
                print("   ❌ reviews NOT found")
            
            print("\n" + "=" * 50)
            print("🎉 Migration completed successfully!")
            print("=" * 50)
            
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nMake sure your .env file has the correct DATABASE_URI for Railway")
        return False
    
    return True

if __name__ == "__main__":
    run_migration()
