'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Lock, Unlock, Mail, User, Clock, Search, ArrowLeft, RefreshCw, KeyRound, AlertCircle, Eye, EyeOff
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export default function InboxPage() {
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Check if session has passcode stored on mount
  useEffect(() => {
    const saved = sessionStorage.getItem('vraj_inbox_passcode');
    if (saved) {
      setPasscode(saved);
      attemptUnlock(saved);
    }
  }, []);

  const attemptUnlock = async (codeToTry: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/contact/inbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: codeToTry }),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error || 'Failed to authenticate.');
      }

      const payload = await response.json();
      setMessages(payload.messages || []);
      setIsUnlocked(true);
      sessionStorage.setItem('vraj_inbox_passcode', codeToTry);
    } catch (err: any) {
      setError(err.message || 'Verification challenge failed.');
      sessionStorage.removeItem('vraj_inbox_passcode');
      setIsUnlocked(false);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setError('Passcode cannot be empty.');
      return;
    }
    attemptUnlock(passcode);
  };

  const handleLock = () => {
    setPasscode('');
    setIsUnlocked(false);
    setMessages([]);
    sessionStorage.removeItem('vraj_inbox_passcode');
  };

  const handleRefresh = () => {
    const saved = sessionStorage.getItem('vraj_inbox_passcode');
    if (saved) {
      attemptUnlock(saved);
    }
  };

  const formatMessageTime = (timestamp: string) => {
    try {
      const d = new Date(timestamp);
      if (isNaN(d.getTime())) return 'N/A';
      return d.toLocaleString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'N/A';
    }
  };

  // Filter messages based on search term
  const filteredMessages = messages.filter((m) => {
    const term = searchTerm.toLowerCase();
    return (
      m.name.toLowerCase().includes(term) ||
      m.email.toLowerCase().includes(term) ||
      m.subject.toLowerCase().includes(term) ||
      m.message.toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex flex-col gap-8 py-6 md:py-10 max-w-5xl mx-auto w-full px-4 sm:px-6 font-sans">
      
      {/* ═══════════════════════════════════════════
          STATE 1: LOCKED VIEW (GATEWAY)
          ═══════════════════════════════════════════ */}
      {!isUnlocked ? (
        <div className="flex-1 flex flex-col justify-center items-center py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
          >
            <Card className="p-8 relative overflow-hidden bg-card-bg/40 border-card-border backdrop-blur-md flex flex-col gap-6 items-center text-center shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
              
              {/* Lock Badge */}
              <div className="relative flex items-center justify-center h-16 w-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)] animate-pulse shrink-0">
                <Lock className="h-7 w-7" />
              </div>

              <div className="flex flex-col gap-2 relative z-10 select-none">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-secondary">
                  Access Restrictions
                </span>
                <h1 className="text-2xl font-medium font-serif text-foreground tracking-tight">
                  Inquiries Secure Gate
                </h1>
                <p className="text-xs text-secondary leading-relaxed font-semibold max-w-xs mx-auto">
                  Please enter your admin credentials token below to decrypt and unlock the contact inquiries ledger.
                </p>
              </div>

              {/* Password Form */}
              <form onSubmit={handleUnlockSubmit} className="w-full flex flex-col gap-4 relative z-10">
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-secondary">
                    <KeyRound className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter decrypt passcode..."
                    className="w-full pl-10 pr-10 py-2.5 bg-[#0e0e11] border border-card-border hover:border-white/10 focus:border-cyan-500/50 rounded-xl text-white placeholder-muted font-mono text-xs focus:ring-0 focus:outline-none transition-all"
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-secondary hover:text-foreground cursor-pointer focus:outline-none"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-rose-500/5 border border-rose-500/15 rounded-xl text-[10.5px] text-rose-400 font-mono font-medium text-left">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full flex items-center justify-center gap-1.5 font-bold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin text-cyan-400" />
                      <span>Verifying Token...</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="h-4 w-4" />
                      <span>Authenticate Credentials</span>
                    </>
                  )}
                </Button>
              </form>

              <Link href="/" className="text-[10px] font-mono text-secondary hover:text-foreground transition-colors mt-2 flex items-center gap-1">
                <ArrowLeft className="h-3 w-3" /> Back to Portfolio Home
              </Link>
            </Card>
          </motion.div>
        </div>
      ) : (
        
        // ═══════════════════════════════════════════
        // STATE 2: UNLOCKED VIEW (INBOX)
        // ═══════════════════════════════════════════
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-6 w-full"
        >
          {/* Header toolbar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-card-border pb-6 gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5 select-none">
                <Unlock className="h-4 w-4 text-cyan-400" /> Decrypted Security Database
              </span>
              <h1 className="text-3xl font-medium font-serif text-foreground tracking-tight select-none">
                Contact Inquiries Inbox
              </h1>
              <p className="text-xs text-secondary leading-relaxed max-w-xl font-medium select-none">
                Review visitor messages submitted through the portfolio contact form. Database is loaded dynamically in memory.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="p-2 border border-card-border bg-card-bg rounded-lg hover:bg-white/5 text-secondary hover:text-foreground transition-all cursor-pointer"
                title="Refresh messages"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={handleLock}
                className="px-4 py-2 border border-rose-500/20 bg-rose-950/15 hover:bg-rose-900/30 text-rose-400 hover:text-rose-300 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Lock className="h-3.5 w-3.5" /> Lock Console
              </button>
            </div>
          </div>

          {/* Search bar & statistics card */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-3 relative flex items-center">
              <div className="absolute left-3 text-secondary">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search messages by sender, email, subject, or message text..."
                className="w-full pl-9 pr-4 py-2 bg-card-bg/40 border border-card-border hover:border-white/10 focus:border-cyan-500/50 rounded-xl text-white placeholder-muted font-mono text-xs focus:ring-0 focus:outline-none transition-all"
              />
            </div>
            
            {/* Total items stats */}
            <Card className="md:col-span-1 py-2.5 px-4 bg-white/[0.01] border border-white/5 rounded-xl flex items-center justify-between text-xs font-mono text-secondary">
              <span>Total Listings:</span>
              <span className="text-foreground font-bold font-sans">{filteredMessages.length} of {messages.length}</span>
            </Card>
          </div>

          {/* Message List Grid */}
          <div className="flex flex-col gap-4 mt-2">
            {loading && messages.length === 0 ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="h-36 w-full bg-white/5 rounded-xl animate-pulse border border-white/5" />
              ))
            ) : filteredMessages.length === 0 ? (
              <Card className="p-12 text-center text-xs font-mono text-secondary bg-card-bg/20 border-card-border flex flex-col items-center justify-center gap-2">
                <Mail className="h-6 w-6 text-muted animate-bounce" />
                <span>{messages.length === 0 ? 'Inbox is currently empty. No submissions received.' : 'No messages match your active search filter.'}</span>
              </Card>
            ) : (
              filteredMessages.map((m) => (
                <Card
                  key={m.id}
                  className="p-6 bg-card-bg/40 border-card-border hover:border-cyan-500/20 group transition-all duration-300 flex flex-col gap-4 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
                  
                  {/* Status Badge indicator */}
                  <div className="absolute top-4 right-4 select-none">
                    <Badge variant="outline" className="text-[7.5px] uppercase font-mono tracking-widest bg-cyan-950/20 border-cyan-800/30 text-cyan-400 font-bold px-2 py-0.5 rounded-full">
                      {m.status || 'new'}
                    </Badge>
                  </div>

                  {/* Header info: Sender Details */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/5 pb-3">
                    <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-xs select-text">
                      <div className="flex items-center gap-2 font-serif text-white font-bold">
                        <User className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                        <span>{m.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-secondary font-mono">
                        <Mail className="h-3.5 w-3.5 text-secondary shrink-0" />
                        <a href={`mailto:${m.email}`} className="hover:text-cyan-400 hover:underline transition-colors">{m.email}</a>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted font-medium select-none">
                      <Clock className="h-3.5 w-3.5 text-muted shrink-0" />
                      <span>{formatMessageTime(m.created_at)}</span>
                    </div>
                  </div>

                  {/* Content: Subject + Message body */}
                  <div className="flex flex-col gap-2.5 select-text">
                    <div className="text-xs font-mono">
                      <span className="text-secondary mr-2">Subject:</span>
                      <span className="text-foreground font-bold">{m.subject}</span>
                    </div>
                    
                    <div className="p-4 rounded-xl border border-white/3 bg-black/40 text-xs text-white/90 leading-relaxed whitespace-pre-wrap select-text font-medium text-left">
                      {m.message}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
