'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, User, ArrowRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const quickPrompts = [
  'Who is Vraj Patel?',
  'What is Vraj’s strongest project?',
  'Explain Enermass Solar ERP.',
  'Explain NF-LRD technically.',
  'Summarize Vraj for a recruiter.',
  'What makes him different?',
];

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export default function AIWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hi! Ask me anything about Vraj Patel\'s engineering projects, CSE coursework at Nirma, or technical skills.',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('ai_session_id') || null;
    }
    return null;
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isOpen, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const chatHistory = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.role === 'user' ? ('user' as const) : ('model' as const),
          parts: [{ text: m.content }],
        }));

      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: textToSend,
          sessionId: activeSessionId || undefined,
          stream: true,
          history: chatHistory,
        }),
      });

      const returnedSessionId = response.headers.get('x-session-id');
      if (returnedSessionId) {
        setActiveSessionId(returnedSessionId);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('ai_session_id', returnedSessionId);
        }
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to stream AI response.');
      }

      const assistantMsgId = generateId();
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMsgId,
          role: 'assistant',
          content: '',
        },
      ]);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('Reader not available.');

      let chunksList: string[] = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const textChunk = decoder.decode(value, { stream: true });
        chunksList = [...chunksList, textChunk];
        const currentContent = chunksList.join('');

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId ? { ...msg, content: currentContent } : msg
          )
        );
      }
    } catch (err) {
      console.error('Widget chat stream error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: 'assistant',
          content: 'I failed to answer. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSession = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('ai_session_id');
    }
    setActiveSessionId(null);
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Session reset. Ask me anything about Vraj Patel!',
      },
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Expanded Chat Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="w-[350px] sm:w-[380px] h-[500px] flex flex-col rounded-2xl border border-card-border bg-card-bg/95 backdrop-blur-md shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-card-border flex items-center justify-between bg-foreground/[0.02] shrink-0">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-foreground/5 border border-card-border flex items-center justify-center text-foreground">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-foreground font-mono">Vraj Patel AI Agent</span>
                  <span className="text-[9px] text-secondary font-mono">Ask about projects & skills</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5">
                {messages.length > 1 && (
                  <button
                    onClick={handleResetSession}
                    title="Reset Session"
                    className="p-1.5 text-secondary hover:text-foreground rounded-md hover:bg-foreground/5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-secondary hover:text-foreground rounded-md hover:bg-foreground/5 transition-colors cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Message Feed */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-thin">
              {messages.map((message) => {
                const isUser = message.role === 'user';
                return (
                  <div
                    key={message.id}
                    className={`flex gap-2 max-w-[85%] ${isUser ? 'self-end flex-row-reverse' : 'self-start'}`}
                  >
                    <div
                      className={`h-6 w-6 rounded-md flex items-center justify-center border shrink-0 text-[10px] ${
                        isUser
                          ? 'bg-foreground border-foreground text-background'
                          : 'bg-foreground/5 border-card-border text-foreground'
                      }`}
                    >
                      {isUser ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                    </div>

                    <div
                      className={`rounded-2xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                        isUser
                          ? 'bg-foreground text-background font-medium border border-foreground rounded-tr-none'
                          : 'bg-foreground/[0.03] text-foreground border border-card-border rounded-tl-none'
                      }`}
                    >
                      {message.content ? (
                        message.content
                      ) : (
                        <span className="flex items-center gap-0.5 py-1">
                          <span className="h-1 w-1 rounded-full bg-foreground animate-pulse" />
                          <span className="h-1 w-1 rounded-full bg-foreground animate-pulse" style={{ animationDelay: '150ms' }} />
                          <span className="h-1 w-1 rounded-full bg-foreground animate-pulse" style={{ animationDelay: '300ms' }} />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestion & Input Panel */}
            <div className="p-3 border-t border-card-border bg-foreground/[0.01] flex flex-col gap-2 shrink-0">
              {/* CURATED SUGGESTIONS */}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-1 max-h-[85px] overflow-y-auto scrollbar-thin">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSendMessage(prompt)}
                      disabled={isLoading}
                      className="text-[9px] font-bold text-secondary hover:text-foreground bg-foreground/5 border border-card-border px-2 py-1 rounded-md hover:bg-foreground/10 hover:border-foreground/15 transition-all cursor-pointer flex items-center gap-0.5 font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {prompt} <ArrowRight className="h-2 w-2 text-secondary/40" />
                    </button>
                  ))}
                </div>
              )}

              {/* Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputValue);
                }}
                className="flex gap-1.5"
              >
                <Input
                  type="text"
                  placeholder="Ask Vraj AI..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isLoading}
                  className="flex-1 py-1.5 px-3 rounded-lg text-xs"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!inputValue.trim() || isLoading}
                  className="p-2 aspect-square rounded-lg flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="h-12 w-12 rounded-full bg-foreground border border-foreground text-background flex items-center justify-center shadow-xl cursor-pointer hover:shadow-2xl transition-shadow relative"
        title="Ask Vraj AI"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="h-5 w-5 text-background" />
            </motion.div>
          ) : (
            <motion.div
              key="bot"
              initial={{ rotate: 45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -45, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative"
            >
              <Bot className="h-5 w-5 text-background" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
