from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from contextlib import contextmanager
from config import Config
from infrastructure.databases.base import Base

# Database configuration
DATABASE_URI = Config.DATABASE_URI
engine = create_engine(DATABASE_URI)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
session = SessionLocal()

def init_mssql(app):
    Base.metadata.create_all(bind=engine)


@contextmanager
def get_db_session():
    """
    Context manager để quản lý database session đúng cách.
    Usage:
        with get_db_session() as session:
            user = session.query(UserModel).first()
    """
    db_session = SessionLocal()
    try:
        yield db_session
        db_session.commit()
    except Exception:
        db_session.rollback()
        raise
    finally:
        db_session.close()
