"""
Chat router for AI Chatbot
Handles chat conversations with Gemini API using HTTP requests
"""

import os
import uuid
import logging
import httpx
from datetime import datetime, timedelta
from typing import Optional, List

from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, Field
from sqlalchemy import select, desc, func
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db_session, Session, Message

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/chat", tags=["Chat"])

# Rate limiting configuration
RATE_LIMIT_MESSAGES = 20  # Max messages per session per hour
RATE_LIMIT_WINDOW = timedelta(hours=1)

# Gemini API Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

# Portfolio context for system prompt
PORTFOLIO_CONTEXT = """
You are an AI assistant for Muhammad Uzair's portfolio website. You are friendly, helpful, and conversational.

YOUR PERSONALITY:
- Respond in the same language the visitor uses (Urdu, English, or mix)
- Be warm and engaging, not robotic
- Keep responses concise (2-4 sentences max)
- If visitor shares about themselves, acknowledge it and relate to Muhammad's work

ABOUT MUHAMMAD UZAIR:
- Full Stack Developer from Karachi, Pakistan
- Skills: React, Next.js, TypeScript, Python, FastAPI, Node.js, PostgreSQL, MongoDB, Docker, Git, Tailwind CSS
- GitHub: github.com/ucdexpert
- Email: hk202504@gmail.com
- Phone: +92 317 0219387
- LinkedIn: linkedin.com/in/muhammad-uzair-9255433a0

PROJECTS:
1. E-Commerce Platform - Full stack shopping site (React, Node.js, MongoDB)
2. Task Management App - Kanban board with real-time updates (Next.js, Socket.io, PostgreSQL)
3. REST API Service - Scalable API with JWT auth (FastAPI, Redis, PostgreSQL)
4. Portfolio Website - This website (Next.js, Tailwind, Framer Motion)
5. Physical AI Textbook Platform - Interactive AI textbook with RAZ chatbot (Docusaurus, React, AI)
   Live: https://physical-ai-textbook-frontend001-he.vercel.app/
   GitHub: https://github.com/ucdexpert/physical-ai-textbook-frontend001-heckathon
6. Personal Library Manager - Python library management system
   GitHub: https://github.com/ucdexpert/Personal-Library-Manager
7. Password Strength Meter - Python password security analyzer
   GitHub: https://github.com/ucdexpert/password-strength-meter

EXPERIENCE:
- Senior Full Stack Developer (current)
- Full Stack Developer (previous)
- Frontend Developer (earlier)

CONVERSATION RULES:
- If visitor says "salam" or "hi" or "hello" → greet warmly and ask how you can help
- If visitor shares about themselves (like "I am a developer") → acknowledge nicely and offer to tell about Muhammad's relevant work
- If visitor asks about projects → list them with brief descriptions
- If visitor asks about skills → mention key technologies
- If visitor asks how to contact → give email and LinkedIn
- If visitor asks something unrelated to Muhammad → politely say you can only help with info about Muhammad Uzair
- NEVER repeat the same generic response twice
- ALWAYS vary your responses based on context

Example responses:
- Visitor: "I am a web developer" → "That's great! Muhammad is also a Full Stack Developer. You two might have a lot in common! Would you like to know about his projects or tech stack?"
- Visitor: "salam" → "Walaikum Assalam! Muhammad Uzair ke portfolio mein aapka swaagat hai. Main aapki kya madad kar sakta hun?"
"""


# Request/Response Models
class ChatRequest(BaseModel):
    """Chat request model"""
    message: str = Field(..., min_length=1, max_length=5000, description="User message")
    session_id: Optional[str] = Field(None, description="Existing session ID or null for new session")


class ChatResponse(BaseModel):
    """Chat response model"""
    response: str
    session_id: str


class MessageResponse(BaseModel):
    """Single message response model"""
    id: str
    role: str
    content: str
    created_at: datetime


class HistoryResponse(BaseModel):
    """Chat history response model"""
    session_id: str
    messages: List[MessageResponse]


class DeleteResponse(BaseModel):
    """Delete session response model"""
    success: bool
    message: str


async def check_rate_limit(session_id: uuid.UUID, db: AsyncSession) -> bool:
    """Check if session has exceeded rate limit"""
    one_hour_ago = datetime.utcnow() - RATE_LIMIT_WINDOW
    
    result = await db.execute(
        select(func.count(Message.id))
        .where(Message.session_id == session_id)
        .where(Message.created_at >= one_hour_ago)
    )
    message_count = result.scalar() or 0
    
    return message_count < RATE_LIMIT_MESSAGES


async def get_conversation_history(session_id: uuid.UUID, db: AsyncSession) -> List[dict]:
    """Retrieve conversation history from database"""
    result = await db.execute(
        select(Message)
        .where(Message.session_id == session_id)
        .order_by(Message.created_at)
    )
    messages = result.scalars().all()
    
    conversation = []
    for msg in messages:
        conversation.append({
            "role": "user" if msg.role == "user" else "model",
            "parts": [{"text": msg.content}]
        })
    
    return conversation


async def save_message(session_id: uuid.UUID, role: str, content: str, db: AsyncSession) -> Message:
    """Save a message to the database"""
    message = Message(
        session_id=session_id,
        role=role,
        content=content
    )
    db.add(message)
    await db.commit()
    await db.refresh(message)
    return message


async def call_gemini(messages: list, system_prompt: str) -> str:
    """Call Gemini API via HTTP request"""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not set in .env")

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    contents = []

    # Inject system prompt as first user message with model acknowledgment
    contents.append({
        "role": "user",
        "parts": [{"text": f"[INSTRUCTIONS - Follow these strictly]:\n{system_prompt}\n\n[INSTRUCTIONS END]\n\nAcknowledge you understand these instructions briefly."}]
    })
    contents.append({
        "role": "model",
        "parts": [{"text": "Understood. I am Muhammad Uzair's portfolio assistant. I will follow all instructions and respond in the visitor's language."}]
    })

    # Add actual conversation history
    for msg in messages:
        if "parts" in msg:
            text = msg["parts"][0].get("text", "")
        else:
            text = msg.get("content") or msg.get("text") or ""

        role = "user" if msg.get("role") == "user" else "model"
        if text.strip():
            contents.append({
                "role": role,
                "parts": [{"text": text}]
            })

    payload = {
        "contents": contents,
        "generationConfig": {
            "maxOutputTokens": 500,
            "temperature": 0.9
        }
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(url, json=payload)
        logger.info(f"Gemini status: {response.status_code}")
        if response.status_code != 200:
            logger.error(f"Gemini error: {response.text}")
            if response.status_code == 429:
                raise ValueError("Rate limit reached. Please wait a moment and try again.")
            raise ValueError(f"Gemini API returned {response.status_code}: {response.text}")
        data = response.json()
        return data["candidates"][0]["content"]["parts"][0]["text"]


def get_fallback_response(message: str) -> str:
    """Generate a smart fallback response based on keywords when Gemini fails"""
    message_lower = message.lower()
    
    # Project-related keywords
    if any(word in message_lower for word in ["project", "work", "experience", "portfolio", "website", "app"]):
        return "I'm Muhammad Uzair, a Full Stack Developer from Karachi. I've worked on projects like E-Commerce platforms, Task Management apps, REST APIs, and more using React, Next.js, Python, and Node.js. Check out my portfolio for details!"
    
    # Contact-related keywords
    if any(word in message_lower for word in ["contact", "email", "phone", "reach", "hire", "available"]):
        return "You can reach me at hk202504@gmail.com or +92 317 0219387. I'm also on GitHub (@ucdexpert) and LinkedIn. Feel free to connect!"
    
    # Skills-related keywords
    if any(word in message_lower for word in ["skill", "technology", "tech", "language", "framework", "tool"]):
        return "I work with React, Next.js, TypeScript, Python, FastAPI, Node.js, PostgreSQL, MongoDB, Docker, Git, and Tailwind CSS. Always learning new technologies!"
    
    # Greeting keywords
    if any(word in message_lower for word in ["hello", "hi", "hey", "greetings", "assalam"]):
        return "Hello! I'm Muhammad Uzair's portfolio assistant. How can I help you learn about Muhammad's work and experience?"
    
    # Education keywords
    if any(word in message_lower for word in ["education", "degree", "study", "learn", "certification"]):
        return "I have a Full Stack Web Development Certification and am always learning new technologies to improve my skills."
    
    # Default fallback
    return "Thanks for your message! I'm Muhammad Uzair's portfolio assistant. While I process your request, feel free to explore the portfolio or contact Muhammad directly at hk202504@gmail.com."


@router.post("", response_model=ChatResponse, status_code=status.HTTP_200_OK)
async def chat(request: ChatRequest, db: AsyncSession = Depends(get_db_session)):
    """
    Send a message and get AI response

    - Creates new session if session_id is not provided
    - Saves user message to database
    - Calls Gemini API with conversation history
    - Saves assistant response to database
    """
    try:
        # Get or create session
        if request.session_id:
            try:
                session_uuid = uuid.UUID(request.session_id)
                result = await db.execute(
                    select(Session).where(Session.id == session_uuid)
                )
                session = result.scalar_one_or_none()

                if not session:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="Session not found"
                    )
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid session ID format"
                )
        else:
            # Create new session
            session = Session(visitor_id=str(uuid.uuid4()))
            db.add(session)
            await db.commit()
            await db.refresh(session)
            session_uuid = session.id

        # Check rate limit
        rate_limit_ok = await check_rate_limit(session_uuid, db)
        if not rate_limit_ok:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Chat limit reached, please try again later"
            )

        # Save user message
        await save_message(session_uuid, "user", request.message, db)

        # Get conversation history
        conversation_history = await get_conversation_history(session_uuid, db)

        # Build system prompt with current message context
        system_prompt = f"{PORTFOLIO_CONTEXT}\n\nUser's message: {request.message}"

        # Debug log to see exact message format
        logger.info(f"conversation_history sample: {conversation_history[:2] if conversation_history else 'empty'}")

        # Call Gemini API via HTTP with fallback
        assistant_response = None
        try:
            assistant_response = await call_gemini(conversation_history, system_prompt)
            assistant_response = assistant_response.strip()
            logger.info(f"Gemini response received: {assistant_response[:100]}")
        except Exception as e:
            logger.error(f"Gemini API error details: {str(e)}")
            import traceback
            logger.error(traceback.format_exc())
            logger.info("Using fallback response")
            assistant_response = get_fallback_response(request.message)

        # Save assistant response
        logger.info(f"Saving to DB - role: assistant, content: {assistant_response[:50]}")
        await save_message(session_uuid, "assistant", assistant_response, db)

        response_data = ChatResponse(
            response=assistant_response,
            session_id=str(session_uuid)
        )
        logger.info(f"Returning to frontend: {{'response': '{assistant_response[:50]}...', 'session_id': '{str(session_uuid)}'}}")
        return response_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )


@router.get("/history/{session_id}", response_model=HistoryResponse)
async def get_chat_history(session_id: str, db: AsyncSession = Depends(get_db_session)):
    """
    Get chat history for a session
    
    Returns all messages for the specified session ordered by creation time
    """
    try:
        session_uuid = uuid.UUID(session_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid session ID format"
        )
    
    # Verify session exists
    result = await db.execute(
        select(Session).where(Session.id == session_uuid)
    )
    session = result.scalar_one_or_none()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    # Get messages
    result = await db.execute(
        select(Message)
        .where(Message.session_id == session_uuid)
        .order_by(Message.created_at)
    )
    messages = result.scalars().all()
    
    return HistoryResponse(
        session_id=session_id,
        messages=[
            MessageResponse(
                id=str(msg.id),
                role=msg.role,
                content=msg.content,
                created_at=msg.created_at
            )
            for msg in messages
        ]
    )


@router.delete("/session/{session_id}", response_model=DeleteResponse)
async def delete_chat_session(session_id: str, db: AsyncSession = Depends(get_db_session)):
    """
    Delete a chat session and all its messages
    
    Removes the session and all associated messages from the database
    """
    try:
        session_uuid = uuid.UUID(session_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid session ID format"
        )
    
    # Verify session exists
    result = await db.execute(
        select(Session).where(Session.id == session_uuid)
    )
    session = result.scalar_one_or_none()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    # Delete messages first (cascade should handle this, but being explicit)
    await db.execute(
        Message.__table__.delete().where(Message.session_id == session_uuid)
    )
    
    # Delete session
    await db.delete(session)
    await db.commit()
    
    return DeleteResponse(
        success=True,
        message="Session and all messages deleted successfully"
    )
