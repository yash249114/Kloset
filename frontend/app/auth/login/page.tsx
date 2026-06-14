'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { authAPI } from '@/lib/api';
import Button from '@/components/ui/Button';

const springTransition = { type: 'spring' as const, stiffness: 300, damping: 30 };

function AuthLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  const { setAuth, isLoading, setLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      const resp = await authAPI.login({ email: email.trim(), password });
      setAuth(resp.user, resp.access_token, resp.refresh_token);
      toast.success('Welcome back to Kloset Luxe.');
      router.push(redirectTo);
    } catch {
      toast.error('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-ivory min-h-screen pt-28 pb-16 font-sans text-charcoal select-none flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springTransition}
          className="bg-white border border-border rounded-xl p-8 shadow-sm"
        >
          <div className="text-center mb-8 space-y-2">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] text-champagne uppercase font-bold"
            >
              <Sparkles size={14} /> Sign In
            </motion.span>
            <h1 className="text-2xl font-display font-medium text-charcoal">Welcome to Kloset Luxe</h1>
            <p className="text-xs text-charcoal-light font-light">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            <div className="space-y-1">
              <label className="text-[10px] font-mono tracking-widest text-charcoal-light uppercase font-bold block mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full h-[52px] pl-12 pr-4 text-sm font-sans bg-white border border-border rounded outline-none focus:border-champagne"
                  required
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-light" size={16} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono tracking-widest text-charcoal-light uppercase font-bold block mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-[52px] pl-12 pr-12 text-sm font-sans bg-white border border-border rounded outline-none focus:border-champagne"
                  required
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-light" size={16} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-light hover:text-charcoal cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono">
              <label className="flex items-center gap-2 text-charcoal-light cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 accent-champagne" />
                Remember me
              </label>
              <Link href="/support" className="text-champagne hover:text-charcoal transition-colors font-bold">
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full h-[52px] cursor-pointer"
            >
              <ArrowRight size={16} className="mr-2" /> Sign In
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border/60 text-center">
            <p className="text-[10px] font-mono text-charcoal-light">
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" className="text-champagne font-bold hover:text-charcoal transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function AuthLoginPage() {
  return (
    <Suspense fallback={
      <div className="bg-ivory min-h-screen pt-36 text-center font-mono text-xs text-charcoal-light">
        Loading...
      </div>
    }>
      <AuthLoginForm />
    </Suspense>
  );
}
