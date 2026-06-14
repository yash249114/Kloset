'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, User as UserIcon, Phone, ArrowRight, ShieldCheck, UserCheck, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'renter' | 'seller'>('renter');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please provide a valid email address';
    }
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Please provide a valid 10-digit phone number';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const authData = await authAPI.register({
        name,
        email,
        phone,
        password,
        role,
      });

      // Store in auth store
      setAuth(authData.user, authData.access_token, authData.refresh_token);
      toast.success(`Account created successfully! Welcome to Kloset, ${name}`);

      // Redirect depending on user role
      if (authData.user.role === 'seller') {
        router.push('/seller');
      } else {
        router.push('/discover');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || 'Registration failed. Check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-ivory min-h-screen pt-32 pb-16 flex items-center justify-center font-sans text-charcoal select-none">
      <div className="w-full max-w-lg px-6">
        
        {/* Branding Title */}
        <div className="text-center mb-8">
          <span className="text-[10px] font-mono tracking-[0.25em] text-champagne uppercase font-bold block mb-1">
            Kloset Luxe Escrow Marketplace
          </span>
          <h1 className="text-4xl font-display font-medium text-charcoal">
            Join the Wardrobe
          </h1>
          <p className="text-xs text-charcoal-light font-mono mt-1.5">
            Register below to list, rent, and share premium designer couture.
          </p>
        </div>

        {/* Register Card */}
        <Card hoverEffect={false} padding="lg" className="bg-white border-border shadow-sm text-left">
          
          {/* Custom Dual Role Card Selector */}
          <div className="mb-6">
            <span className="text-[10px] font-mono tracking-widest text-charcoal-light uppercase font-bold block mb-2">
              Select Membership Category
            </span>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('renter')}
                className={`p-4 rounded-lg border text-left flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                  role === 'renter' 
                    ? 'border-charcoal bg-charcoal/5 shadow-sm' 
                    : 'border-border bg-white hover:border-champagne/40'
                }`}
              >
                <UserCheck size={20} className={role === 'renter' ? 'text-champagne' : 'text-charcoal-light'} />
                <div className="mt-4">
                  <h4 className="text-xs font-mono font-bold text-charcoal uppercase">Couture Renter</h4>
                  <p className="text-[9px] text-charcoal-light mt-1 font-light leading-snug">
                    Access high-end designer wardrobes for brief luxury events.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('seller')}
                className={`p-4 rounded-lg border text-left flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                  role === 'seller' 
                    ? 'border-charcoal bg-charcoal/5 shadow-sm' 
                    : 'border-border bg-white hover:border-champagne/40'
                }`}
              >
                <ShoppingBag size={20} className={role === 'seller' ? 'text-champagne' : 'text-charcoal-light'} />
                <div className="mt-4">
                  <h4 className="text-xs font-mono font-bold text-charcoal uppercase">Bespoke Host</h4>
                  <p className="text-[9px] text-charcoal-light mt-1 font-light leading-snug">
                    List high-value couture and generate recurring rental income.
                  </p>
                </div>
              </button>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            
            <Input
              label="your full name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Devika Sen"
              error={errors.name}
              required
            />

            <Input
              label="email address"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. client@kloset.in"
              error={errors.email}
              required
            />

            <Input
              label="Contact Phone Number"
              name="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9876543210"
              error={errors.phone}
              required
            />

            <Input
              label="Secure Account Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              error={errors.password}
              required
            />

            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="w-full h-[52px] cursor-pointer flex items-center justify-center gap-2"
              >
                Complete Registration <ArrowRight size={14} />
              </Button>
            </div>
          </form>
        </Card>

        {/* Redirect prompt footer */}
        <div className="text-center mt-6">
          <p className="text-xs font-mono text-charcoal-light">
            Already have an account?{' '}
            <Link 
              href="/auth/login" 
              className="text-champagne font-bold uppercase tracking-wider hover:text-gold transition-colors"
            >
              Log In
            </Link>
          </p>
        </div>

        {/* Security footnote */}
        <div className="mt-12 text-center flex items-center justify-center gap-1.5 text-[9px] text-charcoal-light/60 font-mono">
          <ShieldCheck size={12} className="text-success" />
          <span>AES-256 Escrow verified connection</span>
        </div>
      </div>
    </div>
  );
}
