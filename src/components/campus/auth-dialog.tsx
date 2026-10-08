import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { GraduationCap, ArrowRight, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';

export function AuthDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true);
    const values = new FormData(event.currentTarget);
    const email = String(values.get('email') ?? ''); const password = String(values.get('password') ?? '');
    try {
      if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth` });
        if (error) throw error; toast.success('Check your email for a password reset link.');
      } else if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: String(values.get('name') ?? '') }, emailRedirectTo: `${window.location.origin}/auth` } });
        if (error) throw error;
        if (!data.session) toast.success('Check your email to confirm your campus account.');
        else { onOpenChange(false); await navigate({ to: '/' }); }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error; onOpenChange(false); await navigate({ to: '/' });
      }
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to sign in.'); } finally { setBusy(false); }
  }
  async function google() {
    setBusy(true);
    try { const result = await lovable.auth.signInWithOAuth('google', { redirect_uri: `${window.location.origin}/auth` }); if (result.error) throw result.error; if (!result.redirected) { onOpenChange(false); await navigate({ to: '/' }); } }
    catch (error) { toast.error(error instanceof Error ? error.message : 'Google sign-in could not start.'); } finally { setBusy(false); }
  }
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="auth-dialog"><div className="brand-symbol"><GraduationCap /></div><DialogTitle>{mode === 'signup' ? 'Your campus starts here.' : mode === 'reset' ? 'Let’s get you back in.' : 'Welcome to your campus.'}</DialogTitle><DialogDescription>{mode === 'signup' ? 'Create your student account. Staff and parent access is assigned by the university.' : 'One account. Your whole university.'}</DialogDescription>
    {mode !== 'reset' && <><Button variant="outline" className="w-full" onClick={google} disabled={busy}><span className="google-letter">G</span> Continue with Google</Button><div className="auth-divider">or continue with email</div></>}
    <form onSubmit={submit} className="space-y-4">{mode === 'signup' && <div><Label htmlFor="name">Full name</Label><Input id="name" name="name" required autoComplete="name" /></div>}<div><Label htmlFor="email">University email</Label><Input id="email" name="email" type="email" required placeholder="you@university.edu" autoComplete="email" /></div>{mode !== 'reset' && <div><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" minLength={8} required autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} /></div>}<Button className="w-full" disabled={busy}>{busy ? <LoaderCircle className="animate-spin" /> : <ArrowRight />} {mode === 'signup' ? 'Create account' : mode === 'reset' ? 'Send reset link' : 'Enter my campus'}</Button></form>
    <div className="flex flex-wrap items-center justify-between gap-2"><Button variant="link" size="sm" onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}>{mode === 'signup' ? 'Already have an account? Sign in' : 'Create an account'}</Button><Button variant="link" size="sm" onClick={() => setMode('reset')}>Forgot password?</Button></div>
  </DialogContent></Dialog>;
}