'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Mail, ShieldAlert, Terminal } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || isLoggingIn) return;

    setIsLoggingIn(true);
    setErrorMsg('');

    try {
      if (!isSupabaseConfigured) {
        // Mock fallback login logic for offline testing
        if (email === 'patelvrajpatel30@gmail.com' && password === 'admin') {
          // Set a temporary cookie to indicate local mock session
          document.cookie = 'sb-mock-session=true; path=/; max-age=3600';
          router.push('/admin');
        } else {
          setErrorMsg('Mock credentials invalid. Use: patelvrajpatel30@gmail.com / admin');
        }
        setIsLoggingIn(false);
        return;
      }

      // Live Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        throw error;
      }

      if (data.user?.email !== 'patelvrajpatel30@gmail.com') {
        // Log out immediately if user is not the designated admin
        await supabase.auth.signOut();
        throw new Error('Access Denied. You do not possess administrator rights.');
      }

      router.push('/admin');
    } catch (err: unknown) {
      console.error('Authentication failure:', err);
      const message = err instanceof Error ? err.message : 'Verification failed. Try again.';
      setErrorMsg(message);
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-20 px-4 min-h-[500px]">
      <Card className="w-full max-w-md p-8 relative flex flex-col gap-6 border-card-border bg-card-bg/90 backdrop-blur-md shadow-2xl">
        <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

        <div className="flex flex-col items-center text-center gap-3 relative z-10">
          <div className="h-12 w-12 rounded-xl bg-foreground/5 border border-card-border flex items-center justify-center text-foreground mb-1">
            <Lock className="h-6 w-6" />
          </div>
          
          <span className="text-[10px] font-bold uppercase tracking-widest text-secondary flex items-center gap-1.5 font-mono">
            <Terminal className="h-3.5 w-3.5" /> sec-auth-terminal
          </span>
          <h1 className="text-xl font-mono text-foreground tracking-tight">Admin System Authorizer</h1>
          
          <p className="text-xs text-secondary leading-relaxed max-w-xs font-medium">
            Authenticate session tokens using encrypted identity providers to synchronize the administrative control deck.
          </p>

          {!isSupabaseConfigured && (
            <p className="text-[9px] text-foreground font-bold bg-foreground/5 px-3 py-1 rounded-md border border-card-border font-mono mt-1">
              Local Dev Mode. Credentials: <span className="text-secondary font-medium">patelvrajpatel30@gmail.com / admin</span>
            </p>
          )}
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4 relative z-10">
          <div className="flex flex-col gap-3">
            {/* Email field */}
            <div className="flex flex-col gap-1.5 relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none">
                <Mail className="h-4 w-4" />
              </div>
              <Input
                type="email"
                placeholder="Admin email (e.g. patelvrajpatel30@gmail.com)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoggingIn}
                className="pl-10 font-mono text-xs py-2.5 rounded-xl border-card-border"
                required
              />
            </div>

            {/* Password field */}
            <div className="flex flex-col gap-1.5 relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none">
                <Lock className="h-4 w-4" />
              </div>
              <Input
                type="password"
                placeholder="Enter account security keys..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoggingIn}
                className="pl-10 font-mono text-xs py-2.5 rounded-xl border-card-border"
                required
              />
            </div>

            {errorMsg && (
              <div className="flex items-start gap-2 text-[10px] text-red-500 font-bold bg-red-500/5 border border-red-500/20 p-3 rounded-lg font-mono leading-relaxed mt-1">
                <ShieldAlert className="h-4 w-4 shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoggingIn || !email || !password}
            className="cursor-pointer font-bold w-full rounded-xl hover:shadow-lg transition-all"
          >
            {isLoggingIn ? 'Synchronizing credentials...' : 'Verify Identity Credentials'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
