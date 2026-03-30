"""
Database configuration and models for AI Chatbot
Uses async SQLAlchemy with PostgreSQL (NeonDB)
"""

import os
import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import String, Text, DateTime, ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.dialects.postgresql import UUID as PG_UUID


class Base(DeclarativeBase):
    """Base class for all database models"""
    pass


# Database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL", "")


def get_engine():
    """Create and return async engine"""
    if not DATABASE_URL:
        raise ValueError("DATABASE_URL environment variable is not set")
    
    # For NeonDB, we need to handle SSL properly
    # Remove sslmode from URL and use connect_args instead
    clean_url = DATABASE_URL.replace("?sslmode=require", "").replace("&channel_binding=require", "")
    
    return create_async_engine(
        clean_url,
        echo=False,
        pool_pre_ping=True,
        connect_args={"ssl": True}
    )


def get_session_maker():
    """Create and return async session maker"""
    engine = get_engine()
    return async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


# Global session maker instance
async_session_maker: Optional[async_sessionmaker] = None


def init_db_session_maker():
    """Initialize the global session maker"""
    global async_session_maker
    async_session_maker = get_session_maker()
    return async_session_maker


async def get_db_session():
    """Get database session for dependency injection (async generator)"""
    if async_session_maker is None:
        init_db_session_maker()
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.close()


class Session(Base):
    """Chat session model"""
    __tablename__ = "sessions"

    id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    visitor_id: Mapped[str] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False),
        default=datetime.utcnow,
        nullable=False
    )

    # Relationship to messages
    messages: Mapped[list["Message"]] = relationship(
        "Message",
        back_populates="session",
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<Session(id={self.id}, visitor_id={self.visitor_id})>"


class Message(Base):
    """Chat message model"""
    __tablename__ = "messages"

    id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    session_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("sessions.id", ondelete="CASCADE"),
        nullable=False
    )
    role: Mapped[str] = mapped_column(String(50), nullable=False)  # 'user' or 'assistant'
    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False),
        default=datetime.utcnow,
        nullable=False
    )

    # Relationship to session
    session: Mapped["Session"] = relationship("Session", back_populates="messages")

    def __repr__(self):
        return f"<Message(id={self.id}, role={self.role}, session_id={self.session_id})>"


async def create_tables():
    """Create all database tables"""
    engine = get_engine()
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def drop_tables():
    """Drop all database tables (for development)"""
    engine = get_engine()
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
