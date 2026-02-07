"""
Create messages table for chat functionality
"""
import sys
sys.path.insert(0, '.')

from infrastructure.databases.mssql import engine
from sqlalchemy import text


def create_messages_table():
    """Create the messages table if it doesn't exist"""
    
    print("Creating messages table...")
    print(f"Database: {engine.url}\n")
    
    create_table_sql = """
    CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender_id INT NOT NULL,
        receiver_id INT NOT NULL,
        content TEXT NOT NULL,
        is_read TINYINT(1) DEFAULT 0,
        read_at DATETIME NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES flask_user(id),
        FOREIGN KEY (receiver_id) REFERENCES flask_user(id),
        INDEX idx_sender_receiver (sender_id, receiver_id),
        INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """
    
    with engine.connect() as conn:
        try:
            conn.execute(text(create_table_sql))
            conn.commit()
            print("  ✓ Messages table created successfully")
        except Exception as e:
            if "already exists" in str(e).lower():
                print("  - Messages table already exists, skipping")
            else:
                print(f"  ✗ Error creating messages table: {e}")
    
    print("\nMigration completed!")


if __name__ == "__main__":
    create_messages_table()
