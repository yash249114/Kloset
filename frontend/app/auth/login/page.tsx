'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams() || new URLSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please provide a valid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const authData = await authAPI.login({ email, password });
      
      // Store in auth store
      setAuth(authData.user, authData.access_token, authData.refresh_token);
      toast.success(`Welcome back, ${authData.user.name}`);

      // Redirect depending on user role or redirectParam
      const redirectTo = searchParams.get('redirect') || '';
      if (redirectTo) {
        router.push(redirectTo);
      } else if (authData.user.role === 'admin') {
        router.push('/admin');
      } else if (authData.user.role === 'seller') {
        router.push('/seller');
      } else {
        router.push('/discover');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-ivory min-h-screen pt-32 pb-16 flex items-center justify-center font-sans text-charcoal select-none">
      <div className="w-full max-w-md px-6">
        
        {/* Branding Title */}
        <div className="text-center mb-8">
          <span className="text-[10px] font-mono tracking-[0.25em] text-champagne uppercase font-bold block mb-1">
            Kloset Luxe Escrow Marketplace
          </span>
          <h1 className="text-4xl font-display font-medium text-charcoal">
            Welcome Back
          </h1>
          <p className="text-xs text-charcoal-light font-mono mt-1.5">
            Sign in to access your couture wardrobe studio.
          </p>
        </div>

        {/* Login Card */}
        <Card hoverEffect={false} padding="lg" className="bg-white border-border shadow-sm">
          <form onSubmit={handleLogin} className="space-y-6">
            
            <Input
              label="registered email address"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. client@kloset.in"
              error={errors.email}
              required
            />

            <div className="space-y-1 text-right">
              <Input
                label="account password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                error={errors.password}
                required
              />
              <Link 
                href="/auth/forgot-password" 
                className="text-[10px] font-mono uppercase tracking-wider text-charcoal-light hover:text-champagne transition-colors inline-block"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full h-[52px] cursor-pointer flex items-center justify-center gap-2"
            >
              Sign In to Wardrobe <ArrowRight size={14} />
            </Button>
          </form>

          {/* Social Sign-in Placeholder */}
          <div className="mt-8 pt-6 border-t border-border/60 text-center">
            <span className="text-[9px] font-mono uppercase text-charcoal-light/60 tracking-wider block mb-4">
              Or Connect Securely via Google
            </span>
            <Button
              type="button"
              variant="outline"
              onClick={() => toast.info('Google OAuth integration active in sandbox.')}
              className="w-full h-[52px] bg-transparent border-border hover:bg-ivory-dark cursor-pointer text-xs font-mono font-bold"
            >
              Sign In with Google Account
            </Button>
          </div>
        </Card>

        {/* Sign up prompt footer */}
        <div className="text-center mt-6">
          <p className="text-xs font-mono text-charcoal-light">
            New to Kloset Luxe?{' '}
            <Link 
              href="/auth/register" 
              className="text-champagne font-bold uppercase tracking-wider hover:text-gold transition-colors"
            >
              Request Access
            </Link>
          </p>
        </div>

        {/* Security policy footnote */}
        <div className="mt-12 text-center flex items-center justify-center gap-1.5 text-[9px] text-charcoal-light/60 font-mono">
          <ShieldCheck size={12} className="text-success" />
          <span>AES-256 Escrow verified connection</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="bg-ivory min-h-screen pt-36 text-center select-none font-mono text-xs text-charcoal-light">
        <div className="animate-spin inline-block w-6 h-6 border-2 border-champagne rounded-full border-t-transparent mb-2 animate-bounce" />
        <p>Initializing Secure Session...</p>
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  );
}
