'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, ShoppingBag, DollarSign, Star, Calendar, RefreshCcw, LayoutGrid } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { outfitsAPI, bookingsAPI } from '@/lib/api';
import type { Outfit, Booking } from '@/types';
import { toast } from 'sonner';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';

export default function SellerDashboardPage() {
  const { user } = useAuthStore();
  const [listingsCount, setListingsCount] = useState(0);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      // Load seller outfits
      const outfitsResp = await outfitsAPI.getSellerOutfits(1);
      setListingsCount(outfitsResp.meta?.total || 0);

      // Load seller bookings
      const bookingsResp = await bookingsAPI.listSellerBookings(1, 5);
      setBookings(bookingsResp.bookings || []);
    } catch (err) {
      console.warn('Failed to load seller dashboard details:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    async function init() {
      await loadData();
    }
    init();
  }, []);

  const totalEarnings = bookings
    .filter((b) => b.status === 'completed' || b.status === 'returned')
    .reduce((acc, b) => acc + b.rental_amount, 0);

  const springTransition = { type: 'spring' as const, stiffness: 300, damping: 30 };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse select-none text-left">
        <div className="h-10 bg-ivory-dark w-1/4 rounded mb-8" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white border border-border rounded-xl" />
          ))}
        </div>
        <div className="h-64 bg-white border border-border rounded-xl mt-8" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springTransition}
      className="space-y-8 text-left font-sans select-none text-charcoal"
    >
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-champagne uppercase font-bold block">
            Seller Studio
          </span>
          <h1 className="text-3xl md:text-4xl font-display font-medium text-charcoal mt-1">
            Studio Overview
          </h1>
        </div>
        <Link 
          href="/seller/listings" 
          className="btn btn-gold h-11 px-6 text-xs font-mono uppercase tracking-widest flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus size={14} /> Add New Couture
        </Link>
      </div>

      {/* Stats Cards grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Listings', val: listingsCount.toString(), desc: 'Designs in wardrobe', icon: LayoutGrid },
          { label: 'Active Rentals', val: bookings.filter((b) => ['confirmed', 'picked_up', 'in_use'].includes(b.status)).length.toString(), desc: 'Outfits currently rented', icon: Calendar },
          { label: 'Studio Earnings', val: `₹${totalEarnings.toLocaleString('en-IN')}`, desc: 'Escrow released funds', icon: DollarSign },
          { label: 'Trust Score', val: `${user?.trust_score || 98}%`, desc: 'Based on quality audits', icon: Star },
        ].map((st, index) => (
          <motion.div
            key={st.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: index * 0.05 }}
          >
            <Card hoverEffect={true} padding="sm" className="flex flex-col justify-between h-28 bg-white border-border w-full">
              <div className="flex items-center justify-between text-charcoal-light">
                <span className="text-[10px] font-mono tracking-wider uppercase">{st.label}</span>
                <st.icon size={14} className="text-champagne" />
              </div>
              <div>
                <span className="text-2xl font-bold text-charcoal">{st.val}</span>
                <span className="text-[9px] text-charcoal-light block mt-0.5">{st.desc}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Bookings & activity layout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springTransition, delay: 0.2 }}
        className="grid grid-cols-1 gap-6"
      >
        <Card hoverEffect={false} padding="md" className="bg-white border-border">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
            <h3 className="font-display text-base font-semibold">Recent Rental Activity</h3>
            <button 
              onClick={() => loadData(true)}
              className="text-xs font-mono uppercase tracking-wider text-champagne hover:text-charcoal transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RefreshCcw size={12} /> Sync Lists
            </button>
          </div>

          {bookings.length === 0 ? (
            <div className="py-12 text-center text-charcoal-light">
              <p className="text-sm font-light">No recent rental transactions registered for your outfits.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border text-[9px] font-mono uppercase text-charcoal-light tracking-wider">
                    <th className="pb-3 font-semibold">Booking Ref</th>
                    <th className="pb-3 font-semibold">Couture Listing</th>
                    <th className="pb-3 font-semibold">Renter</th>
                    <th className="pb-3 font-semibold">Timeline</th>
                    <th className="pb-3 font-semibold">Total Revenue</th>
                    <th className="pb-3 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-ivory/10 transition-colors">
                      <td className="py-4 font-mono font-bold text-charcoal">{b.booking_ref}</td>
                      <td className="py-4 font-medium text-charcoal max-w-[200px] truncate">
                        {b.outfit?.title || 'Heritage Design'}
                      </td>
                      <td className="py-4 text-charcoal-light">{b.renter?.name || 'Customer'}</td>
                      <td className="py-4 text-charcoal-light">
                        {new Date(b.pickup_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} to{' '}
                        {new Date(b.return_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="py-4 font-mono text-charcoal font-bold">₹{b.total_amount.toLocaleString('en-IN')}</td>
                      <td className="py-4 text-right">
                        <Badge variant={b.status === 'confirmed' || b.status === 'completed' ? 'sage' : b.status === 'pending' ? 'gold' : 'rose'}>
                          {b.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
}
