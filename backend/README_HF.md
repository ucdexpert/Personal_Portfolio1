---
title: Muhammad Uzair Portfolio Backend
emoji: 🚀
colorFrom: blue
colorTo: violet
sdk: docker
pinned: false
---

# Portfolio Backend API

FastAPI backend for Muhammad Uzair's portfolio chatbot.

## Features

- **AI Chatbot** - Conversational assistant powered by Google Gemini
- **Contact Form** - Email handling for portfolio contact form
- **PostgreSQL Database** - Stores chat history and sessions
- **CORS Enabled** - Ready for frontend integration

## API Endpoints

- `GET /` - API info
- `GET /health` - Health check
- `POST /api/contact` - Submit contact form
- `POST /api/chat` - Send chat message
- `GET /api/chat/history/{session_id}` - Get chat history
- `DELETE /api/chat/session/{session_id}` - Delete chat session

## Deployment

This Space runs on Docker. To deploy:

1. Set environment variables in Hugging Face Spaces settings:
   - `DATABASE_URL` - PostgreSQL connection string
   - `GEMINI_API_KEY` - Google Gemini API key
   - `FRONTEND_URL` - Your frontend URL
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` - Email settings

2. The Docker container will automatically start on port 7860

## Local Development

```bash
pip install -r requirements-hf.txt
uvicorn app:app --reload --port 7860
```

## License

MIT
