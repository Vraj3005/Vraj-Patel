'use client';

import { useState } from 'react';
import { Sparkles, Send, Bot, User, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIPreview() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m Vraj\'s AI assistant. Ask me anything about his projects, skills, or experience.',
    },
  ]);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const triggerAsk = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    setMessages((prev) => [...prev, { role: 'user', content: textToSend }]);
    setPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend }),
      });

      const data = await response.json();

      if (response.ok && data.response) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        throw new Error(data.error || 'Connection error.');
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Connection interrupted. Check the /resume page for details.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-widest text-secondary flex items-center gap-1.5 font-mono">
              <Sparkles className="h-3.5 w-3.5 text-secondary" /> AI Assistant
            </span>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
              Ask me anything
            </h2>
            <p className="text-xs text-muted max-w-xl leading-relaxed">
              Powered by Gemini. Ask about projects, tech stack, experience, or availability.
            </p>
          </div>
          <Link href="/ask-vraj">
            <Button variant="secondary" size="sm" className="flex items-center gap-1">
              Full Chat <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {/* Chat Box */}
        <Card className="overflow-hidden p-0 relative flex flex-col min-h-[300px] max-h-[360px]">
          <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 scrollbar-thin flex flex-col gap-4 relative z-10">
            {messages.map((m, idx) => {
              const isBot = m.role === 'assistant';
              return (
                <div key={idx} className={`flex gap-3 max-w-[85%] ${isBot ? 'self-start' : 'self-end flex-row-reverse'}`}>
                  <div className={`h-7 w-7 rounded-lg border flex items-center justify-center shrink-0 ${
                    isBot ? 'bg-card-bg border-card-border text-foreground' : 'bg-white border-white text-black'
                  }`}>
                    {isBot ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                  </div>
                  <div className={`rounded-xl px-3.5 py-2 text-xs leading-relaxed ${
                    isBot ? 'bg-white/5 border border-card-border text-foreground' : 'bg-white text-black font-medium border border-white'
                  }`}>
                    {m.content}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-3 self-start">
                <div className="h-7 w-7 rounded-lg bg-card-bg border border-card-border flex items-center justify-center text-foreground animate-pulse">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="bg-white/5 border border-card-border rounded-xl px-4 py-2 flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-card-border bg-card-bg relative z-10 flex flex-col gap-3.5">
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2">
                {['What projects has Vraj built?', 'Tech stack?', 'Available for work?'].map((q) => (
                  <button
                    key={q}
                    onClick={() => triggerAsk(q)}
                    className="text-[10px] font-medium text-secondary hover:text-foreground bg-white/5 border border-card-border px-2.5 py-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                triggerAsk(prompt);
              }}
              className="flex gap-2"
            >
              <Input
                type="text"
                placeholder="Ask something..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isLoading}
                className="flex-1 py-2 px-3 rounded-lg text-xs"
                aria-label="Ask Vraj AI query"
              />
              <Button
                type="submit"
                variant="primary"
                disabled={!prompt.trim() || isLoading}
                className="p-2 aspect-square rounded-lg flex items-center justify-center"
                aria-label="Send message"
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </section>
  );
}
