'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { Lock, Mail, ArrowLeft, RefreshCw, KeyRound, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkUser = async () => {
      if (!isSupabaseConfigured) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push(redirectUrl);
      }
    };
    checkUser();
  }, [router, redirectUrl]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    // If Supabase is not configured locally, simulate success in dev
    if (!isSupabaseConfigured) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[Supabase Client Mock]: Simulating successful login.');
        router.push(redirectUrl);
        return;
      }
      setError('Supabase credentials are not configured.');
      setLoading(false);
      return;
    }

    try {
      const { data, error: signInErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInErr) {
        throw signInErr;
      }

      if (data.user) {
        // Query to check if this user exists in admin_users table
        const { data: adminRecord, error: adminErr } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', data.user.id)
          .maybeSingle();

        if (adminErr || !adminRecord) {
          // Log out immediately as they are not admin
          await supabase.auth.signOut();
          if (adminErr) {
            throw new Error(`Database error: ${adminErr.message} (Code: ${adminErr.code})`);
          }
          throw new Error('Access Denied: You are not authorized as an administrator.');
        }

        router.push(redirectUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 py-16 md:py-24 max-w-md mx-auto w-full px-4 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-8 relative overflow-hidden bg-card-bg/40 border-card-border backdrop-blur-md flex flex-col gap-6 items-center text-center shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />

          {/* Secure Gate Emblem */}
          <div className="relative flex items-center justify-center h-16 w-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)] animate-pulse shrink-0">
            <Lock className="h-7 w-7" />
          </div>

          <div className="flex flex-col gap-2 relative z-10 select-none">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-secondary">
              Console Unlock Gate
            </span>
            <h1 className="text-2xl font-medium font-serif text-foreground tracking-tight">
              Authenticate Operator
            </h1>
            <p className="text-xs text-secondary leading-relaxed font-semibold max-w-xs mx-auto">
              Provide authorization key matching the operator identity parameters to establish a secure session.
            </p>
          </div>

          {/* Credentials Sign In Form */}
          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4 relative z-10 text-left">
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-bold text-secondary uppercase">Operator ID</label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-secondary">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@patel-vraj.vercel.app"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0e0e11] border border-card-border hover:border-white/10 focus:border-cyan-500/50 rounded-xl text-white placeholder-muted font-sans text-xs focus:ring-0 focus:outline-none transition-all"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-bold text-secondary uppercase">Access Token</label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-secondary">
                  <KeyRound className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter access token..."
                  style={{ WebkitTextSecurity: showPassword ? 'none' : 'disc' } as React.CSSProperties}
                  className="w-full pl-10 pr-10 py-2.5 bg-[#0e0e11] border border-card-border hover:border-white/10 focus:border-cyan-500/50 rounded-xl text-white placeholder-muted font-mono text-xs focus:ring-0 focus:outline-none transition-all"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-secondary hover:text-foreground cursor-pointer focus:outline-none"
                  title={showPassword ? 'Hide token' : 'Show token'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-rose-500/5 border border-rose-500/15 rounded-xl text-[10.5px] text-rose-400 font-mono font-medium">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full flex items-center justify-center gap-1.5 font-bold mt-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-cyan-400" />
                  <span>Verifying Session...</span>
                </>
              ) : (
                <span>Unlock Terminal Session</span>
              )}
            </Button>
          </form>

          <Link href="/" className="text-[10px] font-mono text-secondary hover:text-foreground transition-colors mt-2 flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" /> Back to Portfolio Home
          </Link>
        </Card>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center font-mono text-xs text-secondary">Initializing secure gateway auth...</div>}>
      <LoginContent />
    </Suspense>
  );
}
