'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function RenterFooter() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    toast.success('Thank you for subscribing to KLOSET newsletters.');
    setEmail('');
  };

  return (
    <footer className="bg-charcoal text-ivory border-t border-charcoal-mid pt-16 pb-12 font-sans select-none z-[10]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
        
        {/* Brand / Col 1 */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-1">
            <span className="font-display text-2xl font-bold tracking-widest text-ivory">
              KLOSET
            </span>
            <span className="text-[9px] font-mono tracking-widest text-champagne-light uppercase font-bold mt-2">
              Luxe
            </span>
          </Link>
          <p className="text-xs text-charcoal-light leading-relaxed font-light">
            Platform for renting luxury heritage wear, couture ensembles, and bridal collection accessories across Indian cities.
          </p>
        </div>

        {/* Links / Col 2 */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-widest font-bold text-champagne">
            Collections
          </h4>
          <ul className="space-y-2 text-xs text-charcoal-light">
            <li>
              <Link href="/discover?category=lehenga" className="hover:text-ivory transition-colors">
                Lehenga Cholis
              </Link>
            </li>
            <li>
              <Link href="/discover?category=saree" className="hover:text-ivory transition-colors">
                Designer Sarees
              </Link>
            </li>
            <li>
              <Link href="/discover?category=sherwani" className="hover:text-ivory transition-colors">
                Grooms Sherwanis
              </Link>
            </li>
            <li>
              <Link href="/discover?category=gown" className="hover:text-ivory transition-colors">
                Bridal Gowns
              </Link>
            </li>
          </ul>
        </div>

        {/* Policies / Col 3 */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-widest font-bold text-champagne">
            Studio Policies
          </h4>
          <ul className="space-y-2 text-xs text-charcoal-light">
            <li>
              <Link href="/support" className="hover:text-ivory transition-colors">
                Returns & Shipping
              </Link>
            </li>
            <li>
              <Link href="/support" className="hover:text-ivory transition-colors">
                Cancellation Rules
              </Link>
            </li>
            <li>
              <Link href="/support" className="hover:text-ivory transition-colors">
                Fittings & Exchange
              </Link>
            </li>
            <li>
              <Link href="/support" className="hover:text-ivory transition-colors">
                Customer Support
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter / Col 4 */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-widest font-bold text-champagne">
            Bespoke Newsletters
          </h4>
          <p className="text-xs text-charcoal-light leading-relaxed font-light">
            Receive exclusive updates, designer drop announcements, and style guidelines directly in your inbox.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[52px] px-4 text-xs font-sans bg-charcoal-mid border border-charcoal-light rounded text-white placeholder-charcoal-light/70 outline-none focus:border-champagne"
            />
            <button
              type="submit"
              className="btn btn-gold w-full text-xs font-mono tracking-widest uppercase font-bold"
            >
              Subscribe
            </button>
          </form>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-charcoal-mid/40 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal-light gap-4">
        <span>© 2026 Kloset Inc. All rights reserved. Crafted for elegance.</span>
        <div className="flex gap-6 font-mono text-[10px] uppercase">
          <Link href="/support" className="hover:text-ivory transition-colors">Privacy</Link>
          <Link href="/support" className="hover:text-ivory transition-colors">Terms</Link>
          <Link href="/support" className="hover:text-ivory transition-colors">Escrow Guidelines</Link>
        </div>
      </div>
    </footer>
  );
}
