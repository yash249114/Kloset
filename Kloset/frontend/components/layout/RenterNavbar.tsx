'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Sparkles, User, LogOut, LayoutDashboard, Heart, Package, Headphones } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';

const springTransition = { type: 'spring' as const, stiffness: 300, damping: 30 };

export default function RenterNavbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const cartItems = useCartStore((s) => s.cartItems);
  const setCartOpen = useUIStore((s) => s.setCartOpen);
  const setAIStylistOpen = useUIStore((s) => s.setAIStylistOpen);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="fixed top-0 left-0 right-0 h-[72px] bg-warm-white/80 backdrop-blur-md border-b border-border z-[100] select-none">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        
        {/* Editorial Logo */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={springTransition}>
          <Link href="/" className="flex items-center gap-1 group">
            <span className="font-display text-2xl font-bold tracking-widest text-charcoal group-hover:text-champagne transition-colors">
              KLOSET
            </span>
            <span className="text-[9px] font-mono tracking-widest text-champagne-light uppercase font-extrabold mt-2.5">
              Luxe
            </span>
          </Link>
        </motion.div>

        {/* Navigation items */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-widest font-bold">
          {[
            { label: 'Browse/Shop', href: '/discover' },
            { label: 'Lehengas', href: '/discover?category=lehenga' },
            { label: 'Sarees', href: '/discover?category=saree' },
            { label: 'Sherwanis', href: '/discover?category=sherwani' },
          ].map((navLink) => (
            <motion.div
              key={navLink.label}
              whileHover={{ scale: 1.05, y: -1 }}
              transition={springTransition}
            >
              <Link href={navLink.href} className="text-charcoal hover:text-champagne transition-colors py-2 block">
                {navLink.label}
              </Link>
            </motion.div>
          ))}

          {isAuthenticated && [
            { label: 'Wishlist', href: '/wishlist', icon: Heart },
            { label: 'Orders', href: '/orders', icon: Package },
            { label: 'Support', href: '/support', icon: Headphones },
          ].map((navLink) => (
            <motion.div
              key={navLink.label}
              whileHover={{ scale: 1.05, y: -1 }}
              transition={springTransition}
            >
              <Link href={navLink.href} className="text-charcoal hover:text-champagne transition-colors py-2 flex items-center gap-1.5">
                <navLink.icon size={13} />
                {navLink.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Operations / Actions */}
        <div className="flex items-center gap-4">
          
          {/* AI Stylist trigger */}
          <motion.button
            onClick={() => setAIStylistOpen(true)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={springTransition}
            className="flex items-center gap-2 h-[52px] px-4 rounded bg-gradient-to-r from-champagne/10 to-rose-gold/10 hover:from-champagne/20 hover:to-rose-gold/20 text-champagne border border-champagne/20 text-[11px] font-mono uppercase tracking-widest font-bold cursor-pointer"
            title="Open AI Stylist"
          >
            <Sparkles size={14} className="text-champagne animate-pulse" />
            <span className="hidden sm:inline">AI Stylist</span>
          </motion.button>

          {/* Cart Icon */}
          <motion.button
            onClick={() => setCartOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={springTransition}
            className="w-[52px] h-[52px] border border-border hover:bg-ivory-dark flex items-center justify-center relative cursor-pointer rounded text-charcoal"
            aria-label="Shopping Cart"
          >
            <ShoppingBag size={16} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-gold text-white text-[8px] font-mono font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-warm-white">
                {cartCount}
              </span>
            )}
          </motion.button>

          {/* Authenticated routes / Auth state switcher */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={springTransition}>
                <Link
                  href="/profile"
                  className="w-[52px] h-[52px] border border-border hover:bg-ivory-dark flex items-center justify-center cursor-pointer transition-colors rounded text-charcoal"
                  title="Renter Dashboard"
                >
                  <User size={16} />
                </Link>
              </motion.div>

              {user?.role === 'seller' && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={springTransition}>
                  <Link
                    href="/seller"
                    className="w-[52px] h-[52px] border border-border hover:bg-ivory-dark flex items-center justify-center cursor-pointer transition-colors rounded text-charcoal"
                    title="Seller Studio"
                  >
                    <LayoutDashboard size={16} />
                  </Link>
                </motion.div>
              )}

              {user?.role === 'admin' && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={springTransition}>
                  <Link
                    href="/admin"
                    className="w-[52px] h-[52px] border border-border hover:bg-ivory-dark flex items-center justify-center cursor-pointer transition-colors rounded text-charcoal"
                    title="Admin Dashboard"
                  >
                    <LayoutDashboard size={16} />
                  </Link>
                </motion.div>
              )}

              <motion.button
                onClick={logout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={springTransition}
                className="w-[52px] h-[52px] border border-border hover:bg-error/10 hover:border-error/30 flex items-center justify-center cursor-pointer transition-colors rounded text-charcoal-light hover:text-error"
                title="Logout"
              >
                <LogOut size={16} />
              </motion.button>

            </div>
          ) : (
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={springTransition}>
              <Link
                href="/auth/login"
                className="btn btn-primary !h-[52px] !px-5 text-[10px] font-mono tracking-widest uppercase font-bold"
              >
                Sign In
              </Link>
            </motion.div>
          )}

        </div>

      </div>
    </header>
  );
}
