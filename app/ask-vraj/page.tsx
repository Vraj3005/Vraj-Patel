'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Terminal, ArrowRight, User, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageTitleReveal } from '@/components/motion/page-transition';
import AICoreAvatar, { AIStatus } from '@/components/ai/ai-core-avatar';
import AIStatusRing from '@/components/ai/ai-status-ring';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const suggestedPrompts = [
  'Who is Vraj Patel?',
  'What is Vraj’s strongest project?',
  'What client software has Vraj built?',
  'Explain Enermass Solar ERP.',
  'Explain Bhagwati Interior ERP.',
  'Explain Driedhub Marketplace.',
  'What is Surendra & Co. website?',
  'What quant projects has Vraj built?',
  'Explain NF-LRD technically.',
  'Is Vraj suitable for full-stack roles?',
  'Is Vraj suitable for AI automation roles?',
  'Is Vraj suitable for quant or fintech roles?',
  'Summarize Vraj for a recruiter.',
  'What makes Vraj different from other CSE students?',
];

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export default function AskVraj() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I am Vraj Patel\'s AI Assistant. You can ask me details about Vraj\'s CSE coursework at Nirma University, check parameters on his 10 engineering projects, examine his notice period, or enquire about his technical skill set. What would you like to explore?',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState<AIStatus>('ready');
  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('ai_session_id') || null;
    }
    return null;
  });
  const feedRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat thread to bottom
  const scrollToBottom = () => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  // Handle message send submission
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
    setAiStatus('thinking');

    try {
      // Package conversation history for context (excluding welcome greeting, mapping roles for Gemini compatibility)
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

      // Track session ID returned in response headers
      const returnedSessionId = response.headers.get('x-session-id');
      if (returnedSessionId) {
        setActiveSessionId(returnedSessionId);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('ai_session_id', returnedSessionId);
        }
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to fetch AI response stream.');
      }

      // Initialize assistant placeholder message
      const assistantMsgId = generateId();
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMsgId,
          role: 'assistant',
          content: '',
        },
      ]);
      setAiStatus('responding');

      // Read chunked data
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('Response body reader is not available.');

      let chunksList: string[] = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          setAiStatus('ready');
          break;
        }

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
      console.error('Chat stream error:', err);
      setAiStatus('error');
      setTimeout(() => setAiStatus('ready'), 4000);
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: 'assistant',
          content: 'Oops, something went wrong. Please try again, or view Vraj\'s background on the "/resume" page.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSession = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('ai_session_id');
    }
    setActiveSessionId(null);
    setAiStatus('ready');
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Conversation session cleared. Ask me anything about Vraj\'s qualification, projects, or background!',
      },
    ]);
  };

  const handleInputFocus = () => {
    if (!isLoading) {
      setAiStatus('listening');
    }
  };

  const handleInputBlur = () => {
    if (aiStatus === 'listening') {
      setAiStatus('ready');
    }
  };

  return (
    <div className="flex flex-col gap-6 py-6 w-full mx-auto h-[calc(100vh-100px)] min-h-[600px]">
      {/* Page header banner */}
      <div className="flex items-center justify-between border-b border-card-border pb-4 shrink-0">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-widest text-secondary flex items-center gap-1.5 font-mono">
            <Sparkles className="h-4 w-4 text-foreground animate-pulse" /> portfolio assistant
          </span>
          <PageTitleReveal className="text-xl md:text-2xl font-mono text-foreground tracking-tight flex items-center gap-2">
            Ask Vraj AI <span className="text-[10px] text-secondary font-mono font-medium flex items-center gap-1"><Terminal className="h-3 w-3" /> stream_v2.0</span>
          </PageTitleReveal>
        </div>
        
        {messages.length > 1 && (
          <Button
            onClick={handleResetSession}
            variant="secondary"
            size="sm"
            className="flex items-center gap-1 text-[10px] font-mono font-bold"
          >
            <RefreshCw className="h-3 w-3" /> Reset Session
          </Button>
        )}
      </div>

      {/* Split Workspace Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 overflow-hidden min-h-0">
        
        {/* Left Side: Hardware Diagnostics Cockpit (Desktop Only) */}
        <Card className="hidden lg:flex lg:col-span-4 p-6 flex-col items-center justify-center relative overflow-hidden bg-foreground/[0.01] border-white/5">
          {/* Subtle details background grid */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
          
          <div className="absolute top-4 left-4 font-mono text-[8px] text-muted flex flex-col gap-0.5">
            <span>SYSTEM_NODE: gemini_flash_lite</span>
            <span className="flex items-center gap-1">
              STATUS_LINK: <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> SYNCED
            </span>
          </div>

          <AIStatusRing>
            <AICoreAvatar status={aiStatus} size="lg" />
          </AIStatusRing>

          <div className="mt-20 font-mono text-center flex flex-col gap-1 z-10">
            <span className="text-[8px] text-muted uppercase tracking-wider font-bold">Orb Status telemetry</span>
            <span className={cn(
              "text-xs font-bold tracking-widest uppercase",
              aiStatus === "ready" && "text-cyan-400",
              aiStatus === "listening" && "text-blue-400",
              aiStatus === "thinking" && "text-violet-400 animate-pulse",
              aiStatus === "responding" && "text-rose-400 animate-pulse",
              aiStatus === "error" && "text-red-500 animate-pulse"
            )}>
              {aiStatus}
            </span>
          </div>
        </Card>

        {/* Right Side: Conversation Box */}
        <Card className="lg:col-span-8 flex-1 flex flex-col overflow-hidden p-0 relative border-white/5">
          <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />

          {/* Message Feed container */}
          <div ref={feedRef} className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-5 scrollbar-thin relative z-10">
            <AnimatePresence initial={false}>
              {messages.map((message, idx) => {
                const isUser = message.role === 'user';
                const isLatestBotMsg = !isUser && idx === messages.length - 1 && isLoading;
                
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-3 max-w-[85%] ${isUser ? 'self-end flex-row-reverse' : 'self-start'}`}
                  >
                    {/* Glowing Core avatar replacement */}
                    {isUser ? (
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center border shrink-0 bg-foreground border-foreground text-background">
                        <User className="h-4 w-4" />
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded-lg border border-card-border bg-foreground/5 shrink-0 flex items-center justify-center overflow-hidden">
                        <AICoreAvatar 
                          status={isLatestBotMsg ? 'responding' : 'ready'} 
                          size="sm" 
                        />
                      </div>
                    )}

                    {/* Message Bubble text */}
                    <div
                      className={`rounded-2xl px-4 py-3 text-xs md:text-sm leading-relaxed whitespace-pre-wrap ${
                        isUser
                          ? 'bg-foreground text-background font-medium border border-foreground rounded-tr-none'
                          : 'bg-foreground/[0.03] text-foreground border border-card-border rounded-tl-none'
                      }`}
                    >
                      {message.content ? (
                        message.content.split('\n').map((line, index) => (
                          <p key={index} className={index > 0 ? 'mt-2' : ''}>
                            {line}
                          </p>
                        ))
                      ) : (
                        <span className="flex items-center gap-1 py-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-foreground animate-pulse" />
                          <span className="h-1.5 w-1.5 rounded-full bg-foreground animate-pulse" style={{ animationDelay: '150ms' }} />
                          <span className="h-1.5 w-1.5 rounded-full bg-foreground animate-pulse" style={{ animationDelay: '300ms' }} />
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {/* Pulsing loading state bubble */}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3 self-start"
                >
                  <div className="h-8 w-8 rounded-lg border border-card-border bg-foreground/5 shrink-0 flex items-center justify-center overflow-hidden">
                    <AICoreAvatar status="thinking" size="sm" />
                  </div>
                  <div className="bg-foreground/[0.03] border border-card-border rounded-2xl rounded-tl-none px-5 py-3.5 flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="h-2 w-2 rounded-full bg-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="h-2 w-2 rounded-full bg-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input submission container */}
          <div className="p-4 border-t border-card-border bg-foreground/[0.01] relative z-10 flex flex-col gap-4">
            {/* Quick Prompts list (Scrollable grid of suggested questions) */}
            <div className="flex flex-col gap-2">
              <span className="text-[9px] font-bold text-secondary font-mono uppercase tracking-wider">Suggested Questions</span>
              <div className="flex flex-wrap gap-1.5 max-h-[110px] overflow-y-auto pr-1 scrollbar-thin">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSendMessage(prompt)}
                    disabled={isLoading}
                    className="text-[9px] font-bold text-secondary hover:text-foreground bg-foreground/5 border border-card-border px-2.5 py-1.5 rounded-lg hover:bg-foreground/10 hover:border-foreground/15 transition-all cursor-pointer flex items-center gap-1 font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {prompt} <ArrowRight className="h-2.5 w-2.5 text-secondary/50" />
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="flex gap-2"
            >
              <Input
                type="text"
                placeholder={isLoading ? 'Streaming intelligence responses...' : 'Ask about solar calculating ERP, Nirma University, quant research models...'}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                disabled={isLoading}
                className="flex-1 py-2.5 px-4 rounded-xl font-medium"
                aria-label="Ask Vraj AI query"
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={!inputValue.trim() || isLoading}
                className="shrink-0 flex items-center justify-center p-3 rounded-xl aspect-square cursor-pointer"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
