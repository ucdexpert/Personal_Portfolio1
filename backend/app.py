"""
FastAPI Backend for Portfolio Contact Form
Handles email sending for contact form submissions and AI Chatbot
"""

import os
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

from database import create_tables, init_db_session_maker
from routers import chat

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class Settings(BaseSettings):
    """Application settings"""

    smtp_host: str = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port: int = int(os.getenv("SMTP_PORT", "587"))
    smtp_user: str = os.getenv("SMTP_USER", "")
    smtp_pass: str = os.getenv("SMTP_PASS", "")
    from_email: str = os.getenv("FROM_EMAIL", "")
    to_email: str = os.getenv("TO_EMAIL", "")
    frontend_url: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "7860"))

    model_config = {"extra": "ignore"}


settings = Settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler for startup/shutdown events"""
    # Startup: initialize database
    logger.info("Initializing database...")
    init_db_session_maker()
    await create_tables()
    logger.info("Database initialized successfully")

    yield

    # Shutdown: cleanup if needed
    logger.info("Shutting down application...")


class ContactForm(BaseModel):
    """Contact form data model"""

    name: str = Field(..., min_length=2, max_length=100, description="Sender's name")
    email: EmailStr = Field(..., description="Sender's email address")
    subject: str = Field(..., min_length=3, max_length=200, description="Email subject")
    message: str = Field(..., min_length=10, max_length=5000, description="Email message")


class ContactResponse(BaseModel):
    """Contact form response model"""

    success: bool
    message: str


app = FastAPI(
    title="Portfolio Contact API",
    description="API for handling contact form submissions and AI chatbot",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["POST", "GET", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type"],
)

# Include routers
app.include_router(chat.router)

# Print registered routes on startup
@app.on_event("startup")
async def print_routes():
    logger.info("Registered routes:")
    for route in app.routes:
        if hasattr(route, "path") and hasattr(route, "methods"):
            logger.info(f"  {list(route.methods)[0] if route.methods else 'N/A':6} {route.path}")


def send_email(name: str, email: str, subject: str, message: str) -> bool:
    """
    Send email using SMTP

    Args:
        name: Sender's name
        email: Sender's email
        subject: Email subject
        message: Email message

    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
        # Create message
        msg = MIMEMultipart()
        msg["From"] = settings.from_email
        msg["To"] = settings.to_email
        msg["Subject"] = f"Contact Form: {subject}"

        # Email body
        body = f"""
        <html>
        <body>
            <h2>New Contact Form Submission</h2>
            <table style="border-collapse: collapse; width: 100%;">
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Name:</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">{name}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">{email}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Subject:</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">{subject}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Message:</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">{message}</td>
                </tr>
            </table>
        </body>
        </html>
        """

        msg.attach(MIMEText(body, "html"))

        # Connect to SMTP server and send email
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
            server.starttls()
            server.login(settings.smtp_user, settings.smtp_pass)
            server.send_message(msg)

        logger.info(f"Email sent successfully from {email}")
        return True

    except smtplib.SMTPAuthenticationError:
        logger.error("SMTP Authentication failed")
        return False
    except smtplib.SMTPException as e:
        logger.error(f"SMTP error occurred: {str(e)}")
        return False
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return False


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Portfolio Contact API",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


@app.post(
    "/api/contact",
    response_model=ContactResponse,
    status_code=status.HTTP_200_OK,
    summary="Submit Contact Form",
    description="Submit a contact form message and send it via email",
)
async def submit_contact(form: ContactForm):
    """
    Handle contact form submission

    Args:
        form: Contact form data containing name, email, subject, and message

    Returns:
        ContactResponse: Success or error message

    Raises:
        HTTPException: If email sending fails
    """
    logger.info(f"Received contact form submission from {form.email}")

    # Check if SMTP is configured
    if not settings.smtp_user or not settings.smtp_pass:
        logger.warning("SMTP not configured, simulating successful send")
        # For development without SMTP
        return ContactResponse(
            success=True,
            message="Message received! (SMTP not configured - running in demo mode)",
        )

    # Send email
    success = send_email(form.name, form.email, form.subject, form.message)

    if success:
        return ContactResponse(
            success=True,
            message="Thank you for your message! I'll get back to you soon.",
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send message. Please try again later or contact me directly via email.",
        )


@app.options("/api/contact")
async def contact_options():
    """Handle CORS preflight requests"""
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=7860)
