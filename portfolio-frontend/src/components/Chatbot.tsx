"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { Bot, X, Send, Trash2 } from "lucide-react";
import { useTheme } from "next-themes";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

interface QuickReply {
  text: string;
  emoji: string;
}

const QUICK_REPLIES: QuickReply[] = [
  { text: "What projects have you built?", emoji: "🚀" },
  { text: "What are your skills?", emoji: "💻" },
  { text: "How can I contact you?", emoji: "📧" },
];

const WELCOME_MESSAGE =
  "Hi! I'm Uzair's AI assistant. Ask me anything about his projects, skills, or how to contact him! 👋";

const API_URL = "https://uzair001-portfolio-web.hf.space/api/chat";

// Smart fallback responses
const SMART_RESPONSES: Record<string, string> = {
  project: `🚀 **Muhammad Uzair's Projects:**

1. **E-Commerce Platform** - Full stack shopping site with cart, payments, auth (React, Node.js, MongoDB)
2. **Task Management App** - Kanban board with real-time updates (Next.js, Socket.io, PostgreSQL)
3. **REST API Service** - Scalable API with JWT auth, rate limiting (FastAPI, Redis, PostgreSQL)
4. **Portfolio Website** - This website! (Next.js, Tailwind, Framer Motion)
5. **Real-time Chat App** - WebSocket chat (React, FastAPI, WebSockets)
6. **Analytics Dashboard** - Data visualization (React, D3.js, Python)

Which project would you like to know more about?`,

  contact: `📧 **Contact Muhammad Uzair:**

- **Email:** [hk202504@gmail.com](mailto:hk202504@gmail.com)
- **GitHub:** [ucdexpert](https://github.com/ucdexpert)
- **Phone:** +92 317 0219387
- **LinkedIn:** [linkedin.com/in/muhammad-uzair-9255433a0](https://linkedin.com/in/muhammad-uzair-9255433a0)

Or use the contact form on this website!`,

  skill: `💻 **Muhammad Uzair's Skills:**

**Frontend:**
- React, Next.js, TypeScript, JavaScript
- Tailwind CSS, Framer Motion, D3.js

**Backend:**
- Python, FastAPI, Node.js
- PostgreSQL, MongoDB, Redis

**DevOps & Tools:**
- Docker, Git, WebSockets

**Experience:**
- Senior Full Stack Developer
- Full Stack Developer
- Frontend Developer

What would you like to know more about?`,
};

function getSmartResponse(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes("project")) {
    return SMART_RESPONSES.project;
  }
  if (lowerMessage.includes("contact") || lowerMessage.includes("email")) {
    return SMART_RESPONSES.contact;
  }
  if (lowerMessage.includes("skill") || lowerMessage.includes("tech")) {
    return SMART_RESPONSES.skill;
  }
  
  return null;
}

export function Chatbot() {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasOpened, setHasOpened] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [showBadge, setShowBadge] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize session ID and badge state on mount (client-side only)
  useEffect(() => {
    const storedSessionId = localStorage.getItem("chat_session_id");
    if (storedSessionId) {
      setSessionId(storedSessionId);
    }

    // Check if user has opened chat before (for notification badge)
    const hasOpenedBefore = localStorage.getItem("chat_has_opened");
    if (!hasOpenedBefore) {
      setShowBadge(true);
    }
  }, []);

  // Scroll to bottom on new message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Fetch chat history on mount (only if sessionId exists)
  useEffect(() => {
    // Only fetch if sessionId exists and looks like a valid UUID
    if (!sessionId || sessionId.trim() === "" || sessionId.length < 10) {
      return;
    }

    const fetchHistory = async () => {
      try {
        const response = await fetch(`${API_URL}/history/${sessionId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.messages && data.messages.length > 0) {
            setMessages(data.messages);
            setShowQuickReplies(false);
          }
        }
      } catch {
        // Silently fail - no history or API not available
      }
    };
    fetchHistory();
  }, [sessionId]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    setIsLoading(true);
    setError(null);
    setIsRateLimited(false);

    // Add user message to state immediately
    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content: messageText.trim(),
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setShowQuickReplies(false);

    try {
      const payload: { message: string; session_id?: string } = {
        message: messageText.trim(),
      };
      if (sessionId) {
        payload.session_id = sessionId;
      }

      let response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Retry once without session_id if the stored session is invalid
      if (response.status === 404 && sessionId) {
        localStorage.removeItem("chat_session_id");
        setSessionId("");

        response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: messageText.trim() }),
        });
      }

      // Handle rate limiting
      if (response.status === 429) {
        setIsRateLimited(true);
        setMessages((prev) => [
          ...prev,
          {
            id: uuidv4(),
            role: "assistant",
            content: "⏱️ You've reached the chat limit for this hour. Please try again in a few minutes!",
            created_at: new Date().toISOString(),
          },
        ]);
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      console.log("API Response:", data);
      console.log("Message content:", data.response);

      if (data.session_id && data.session_id !== sessionId) {
        localStorage.setItem("chat_session_id", data.session_id);
        setSessionId(data.session_id);
      }

      const botMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: data.response,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      // Try smart fallback response
      const smartResponse = getSmartResponse(messageText);
      
      if (smartResponse) {
        setMessages((prev) => [
          ...prev,
          {
            id: uuidv4(),
            role: "assistant",
            content: smartResponse,
            created_at: new Date().toISOString(),
          },
        ]);
      } else {
        setError("Sorry, I'm having trouble connecting");
        setMessages((prev) => [
          ...prev,
          {
            id: uuidv4(),
            role: "assistant",
            content: "Sorry, I'm having trouble connecting. Please check your internet connection or try again later.",
            created_at: new Date().toISOString(),
          },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickReply = (reply: QuickReply) => {
    sendMessage(`${reply.text} ${reply.emoji}`);
  };

  const handleClearChat = async () => {
    try {
      if (sessionId) {
        await fetch(`${API_URL}/session/${sessionId}`, {
          method: "DELETE",
        });
      }
      setMessages([]);
      setShowQuickReplies(true);
      setIsRateLimited(false);
      localStorage.removeItem("chat_session_id");
      setSessionId("");
    } catch {
      // Silently fail
    }
  };

  const handleOpenChat = () => {
    setIsOpen(true);
    setHasOpened(true);
    setShowBadge(false);
    localStorage.setItem("chat_has_opened", "true");
    if (messages.length === 0) {
      setShowQuickReplies(true);
    }
  };

  const handleCloseChat = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenChat}
            className="fixed bottom-4 right-4 z-40 w-12 h-12 md:bottom-6 md:right-6 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-2xl flex items-center justify-center hover:shadow-purple-500/25 transition-all sm:w-14 sm:h-14"
            style={{
              animation: "pulse 2s infinite",
            }}
          >
            {/* Notification Badge */}
            <AnimatePresence>
              {showBadge && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs font-bold flex items-center justify-center border-2 border-white dark:border-slate-900"
                >
                  1
                </motion.span>
              )}
            </AnimatePresence>
            
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: 10,
                times: [0, 0.2, 0.4, 0.6],
              }}
            >
              <Bot className="w-8 h-8" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed bottom-4 right-4 z-40 w-[380px] h-[500px] rounded-2xl overflow-hidden shadow-2xl backdrop-blur-lg border md:bottom-6 md:right-6 sm:w-[380px] sm:h-[500px]"
            style={{
              backgroundColor:
                theme === "dark"
                  ? "rgba(15, 23, 42, 0.95)"
                  : "rgba(255, 255, 255, 0.95)",
              borderColor:
                theme === "dark" ? "rgba(51, 65, 85, 0.5)" : "rgba(229, 231, 235, 0.8)",
            }}
          >
            {/* Mobile: Full screen */}
            <div className="sm:hidden fixed inset-0 z-50" style={{ display: "none" }} />
            
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{
                borderColor:
                  theme === "dark" ? "rgba(51, 65, 85, 0.5)" : "rgba(229, 231, 235, 0.8)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900" />
                </div>
                <div>
                  <h3
                    className="font-semibold text-sm"
                    style={{
                      color: theme === "dark" ? "#f1f5f9" : "#1e293b",
                    }}
                  >
                    Muhammad Uzair&apos;s Assistant
                  </h3>
                  <p className="text-xs text-green-500">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClearChat}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                  title="Clear chat"
                >
                  <Trash2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCloseChat}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </motion.button>
              </div>
            </div>

            {/* Messages Area */}
            <div
              className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
              style={{
                height: "calc(100% - 140px)",
              }}
            >
              {/* Welcome Message */}
              {!hasOpened && messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4"
                >
                  <div
                    className="p-3 rounded-2xl rounded-bl-sm max-w-[85%]"
                    style={{
                      backgroundColor: theme === "dark" ? "#1e293b" : "#f3f4f6",
                      color: theme === "dark" ? "#f1f5f9" : "#1e293b",
                    }}
                  >
                    <p className="text-sm">{WELCOME_MESSAGE}</p>
                  </div>
                </motion.div>
              )}

              {/* Quick Replies */}
              {showQuickReplies && messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-wrap gap-2 mb-4"
                >
                  {QUICK_REPLIES.map((reply, index) => (
                    <motion.button
                      key={reply.text}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleQuickReply(reply)}
                      className="px-3 py-2 text-xs rounded-full bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:from-purple-200 hover:to-blue-200 dark:hover:from-purple-900/50 dark:hover:to-blue-900/50 transition-all"
                    >
                      {reply.text} {reply.emoji}
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {/* Messages */}
              <motion.div layout className="space-y-3">
                <AnimatePresence>
                  {messages.map((msg, index) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.05,
                      }}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex items-end gap-2 max-w-[80%] ${
                          msg.role === "user" ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        {/* Bot Avatar for bot messages */}
                        {msg.role === "assistant" && (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-sm ${
                            msg.role === "user"
                              ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-br-sm"
                              : ""
                          }`}
                          style={
                            msg.role === "assistant"
                              ? {
                                  backgroundColor:
                                    theme === "dark" ? "#1e293b" : "#f3f4f6",
                                  color: theme === "dark" ? "#f1f5f9" : "#1e293b",
                                }
                              : {}
                          }
                        >
                          <p className="whitespace-pre-wrap break-words">
                            {msg.content}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Typing Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-end gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div
                      className="px-4 py-3 rounded-2xl rounded-bl-sm"
                      style={{
                        backgroundColor: theme === "dark" ? "#1e293b" : "#f3f4f6",
                      }}
                    >
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              delay: i * 0.15,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center"
                >
                  <div className="px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs">
                    {error}
                  </div>
                </motion.div>
              )}

              {/* Rate Limit Message */}
              {isRateLimited && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center"
                >
                  <div className="px-3 py-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs">
                    ⏱️ You&apos;ve reached the chat limit for this hour.
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div
              className="absolute bottom-0 left-0 right-0 p-4 border-t"
              style={{
                borderColor:
                  theme === "dark" ? "rgba(51, 65, 85, 0.5)" : "rgba(229, 231, 235, 0.8)",
                backgroundColor:
                  theme === "dark"
                    ? "rgba(15, 23, 42, 0.95)"
                    : "rgba(255, 255, 255, 0.95)",
              }}
            >
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading || isRateLimited}
                  className="flex-1 px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all disabled:opacity-50"
                  style={{
                    backgroundColor: theme === "dark" ? "#1e293b" : "#ffffff",
                    borderColor: theme === "dark" ? "#334155" : "#e5e7eb",
                    color: theme === "dark" ? "#f1f5f9" : "#1e293b",
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading || isRateLimited}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-purple-500/25"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Full Screen Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="sm:hidden fixed inset-0 bg-black/50 z-40"
            onClick={handleCloseChat}
          />
        )}
      </AnimatePresence>

      {/* Global Styles for animations */}
      <style jsx global>{`
        @keyframes pulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(147, 51, 234, 0.4);
          }
          50% {
            box-shadow: 0 0 0 15px rgba(147, 51, 234, 0);
          }
        }
        
        /* Mobile responsive styles */
        @media (max-width: 640px) {
          .chatbot-window {
            position: fixed !important;
            inset: 0 !important;
            width: 100% !important;
            height: 100% !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
    </>
  );
}
