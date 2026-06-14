'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Sparkles, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';

export default function RenterNavbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const cartItems = useCartStore((s) => s.cartItems);
  const setCartOpen = useUIStore((s) => s.setCartOpen);
  const setAIStylistOpen = useUIStore((s) => s.setAIStylistOpen);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="fixed top-0 left-0 right-0 h-[72px] bg-warm-white/80 backdrop-blur-md border-b border-border z-[100] transition-all duration-300 select-none">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        
        {/* Editorial Logo */}
        <Link href="/" className="flex items-center gap-1 group">
          <span className="font-display text-2xl font-bold tracking-widest text-charcoal group-hover:text-champagne transition-colors">
            KLOSET
          </span>
          <span className="text-[9px] font-mono tracking-widest text-champagne-light uppercase font-extrabold mt-2.5">
            Luxe
          </span>
        </Link>

        {/* Navigation items */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-widest font-bold">
          <Link href="/discover" className="text-charcoal hover:text-champagne transition-colors py-2">
            Catalog
          </Link>
          <Link href="/discover?category=lehenga" className="text-charcoal hover:text-champagne transition-colors py-2">
            Lehengas
          </Link>
          <Link href="/discover?category=saree" className="text-charcoal hover:text-champagne transition-colors py-2">
            Sarees
          </Link>
          <Link href="/discover?category=sherwani" className="text-charcoal hover:text-champagne transition-colors py-2">
            Sherwanis
          </Link>
        </nav>

        {/* Operations / Actions */}
        <div className="flex items-center gap-4">
          
          {/* AI Stylist trigger */}
          <button
            onClick={() => setAIStylistOpen(true)}
            className="flex items-center gap-2 h-10 px-4 rounded bg-gradient-to-r from-champagne/10 to-rose-gold/10 hover:from-champagne/20 hover:to-rose-gold/20 text-champagne border border-champagne/20 transition-all text-[11px] font-mono uppercase tracking-widest font-bold cursor-pointer"
            title="Open AI Stylist"
          >
            <Sparkles size={14} className="text-champagne animate-pulse" />
            <span className="hidden sm:inline">AI Stylist</span>
          </button>

          {/* Cart Icon */}
          <button
            onClick={() => setCartOpen(true)}
            className="w-10 h-10 border border-border hover:bg-ivory-dark flex items-center justify-center relative cursor-pointer transition-colors rounded text-charcoal"
            aria-label="Shopping Cart"
          >
            <ShoppingBag size={16} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-gold text-white text-[8px] font-mono font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-warm-white">
                {cartCount}
              </span>
            )}
          </button>

          {/* Authenticated routes / Auth state switcher */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              
              <Link
                href="/dashboard"
                className="w-10 h-10 border border-border hover:bg-ivory-dark flex items-center justify-center cursor-pointer transition-colors rounded text-charcoal"
                title="Renter Dashboard"
              >
                <User size={16} />
              </Link>

              {user?.role === 'seller' && (
                <Link
                  href="/seller"
                  className="w-10 h-10 border border-border hover:bg-ivory-dark flex items-center justify-center cursor-pointer transition-colors rounded text-charcoal"
                  title="Seller Studio"
                >
                  <LayoutDashboard size={16} />
                </Link>
              )}

              {user?.role === 'admin' && (
                <Link
                  href="/admin"
                  className="w-10 h-10 border border-border hover:bg-ivory-dark flex items-center justify-center cursor-pointer transition-colors rounded text-charcoal"
                  title="Admin Dashboard"
                >
                  <LayoutDashboard size={16} />
                </Link>
              )}

              <button
                onClick={logout}
                className="w-10 h-10 border border-border hover:bg-error/10 hover:border-error/30 flex items-center justify-center cursor-pointer transition-colors rounded text-charcoal-light hover:text-error"
                title="Logout"
              >
                <LogOut size={16} />
              </button>

            </div>
          ) : (
            <Link
              href="/auth/login"
              className="btn btn-primary !h-10 !px-5 text-[10px] font-mono tracking-widest uppercase font-bold"
            >
              Sign In
            </Link>
          )}

        </div>

      </div>
    </header>
  );
}
