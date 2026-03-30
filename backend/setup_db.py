"""
Database Setup Script for Portfolio Chatbot
Run this script once to create all tables in NeonDB

Usage:
    python setup_db.py
"""

import asyncio
import sys
from database import create_tables, get_engine, Base


async def setup_database():
    """Initialize database and create all tables"""
    print("=" * 50)
    print("Portfolio Chatbot - Database Setup")
    print("=" * 50)
    print()

    try:
        # Check if DATABASE_URL is set
        import os
        from dotenv import load_dotenv
        load_dotenv()

        database_url = os.getenv("DATABASE_URL")
        if not database_url:
            print("❌ Error: DATABASE_URL not found in .env file")
            print("   Please copy .env.example to .env and configure your NeonDB connection string")
            return False

        print(f"✓ Database URL configured")
        print(f"  Connection: {database_url.split('@')[1].split('?')[0] if '@' in database_url else 'configured'}")
        print()

        # Create tables
        print("Creating database tables...")
        await create_tables()
        print("✓ Tables created successfully!")
        print()

        # Verify tables
        print("Verifying tables...")
        engine = get_engine()
        async with engine.begin() as conn:
            from sqlalchemy import text
            result = await conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name IN ('sessions', 'messages')
                ORDER BY table_name
            """))
            tables = [row[0] for row in result.fetchall()]

        if "sessions" in tables and "messages" in tables:
            print("✓ All tables verified:")
            print("  - sessions")
            print("  - messages")
            print()
            print("=" * 50)
            print("🎉 Database setup complete!")
            print("=" * 50)
            print()
            print("You can now start the FastAPI server:")
            print("  python main.py")
            print()
            return True
        else:
            print("❌ Error: Some tables were not created")
            return False

    except Exception as e:
        print(f"❌ Error setting up database: {str(e)}")
        print()
        print("Troubleshooting tips:")
        print("1. Check your DATABASE_URL in .env file")
        print("2. Ensure your NeonDB project is active")
        print("3. Verify your network connection")
        print("4. Check if SSL is enabled in your NeonDB connection string")
        return False


if __name__ == "__main__":
    success = asyncio.run(setup_database())
    sys.exit(0 if success else 1)
