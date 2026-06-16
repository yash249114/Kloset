'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, DollarSign, Star, Calendar, RefreshCcw, LayoutGrid, TrendingUp, Eye, Package, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { outfitsAPI, bookingsAPI } from '@/lib/api';
import type { Booking } from '@/types';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

const springTransition = { type: 'spring' as const, stiffness: 300, damping: 30 };

function KPICard({ label, val, desc, icon: Icon, trend, index }: { label: string; val: string; desc: string; icon: React.ElementType; trend?: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springTransition, delay: index * 0.05 }}
    >
      <Card hoverEffect={true} padding="sm" className="flex flex-col justify-between h-28 bg-white border-border w-full relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-20 h-20 -mr-6 -mt-6 rounded-full bg-champagne/[0.03] group-hover:bg-champagne/[0.06] transition-colors" />
        <div className="flex items-center justify-between text-charcoal-light relative">
          <span className="text-[10px] font-mono tracking-wider uppercase">{label}</span>
          <Icon size={15} className="text-champagne" />
        </div>
        <div className="relative">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-charcoal">{val}</span>
            {trend && <span className="text-[9px] font-mono text-success">{trend}</span>}
          </div>
          <span className="text-[9px] text-charcoal-light block mt-0.5">{desc}</span>
        </div>
      </Card>
    </motion.div>
  );
}

export default function SellerDashboardPage() {
  const { user } = useAuthStore();
  const [listingsCount, setListingsCount] = useState(0);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const outfitsResp = await outfitsAPI.getSellerOutfits(1);
      setListingsCount(outfitsResp.meta?.total || 0);
      const bookingsResp = await bookingsAPI.listSellerBookings(1, 5);
      setBookings(bookingsResp.bookings || []);
    } catch (err) {
      console.warn('Failed to load seller dashboard details:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalEarnings = bookings
    .filter((b) => b.status === 'completed' || b.status === 'returned')
    .reduce((acc, b) => acc + b.rental_amount, 0);

  const activeRentals = bookings.filter((b) => ['confirmed', 'picked_up', 'in_use'].includes(b.status));

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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Total Listings" val={listingsCount.toString()} desc="Designs in wardrobe" icon={LayoutGrid} trend="active" index={0} />
        <KPICard label="Active Rentals" val={activeRentals.length.toString()} desc="Outfits currently rented" icon={Calendar} trend={`${activeRentals.length} ongoing`} index={1} />
        <KPICard label="Studio Earnings" val={`₹${totalEarnings.toLocaleString('en-IN')}`} desc="Escrow released funds" icon={DollarSign} trend="MTD" index={2} />
        <KPICard label="Trust Score" val={`${user?.trust_score || 98}%`} desc="Based on quality audits" icon={Star} index={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card hoverEffect={false} padding="md" className="lg:col-span-8 bg-white border-border">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
            <h3 className="font-display text-base font-semibold flex items-center gap-2">
              <Calendar size={15} className="text-champagne" /> Recent Rental Activity
            </h3>
            <button
              onClick={() => loadData(true)}
              className="text-xs font-mono uppercase tracking-wider text-champagne hover:text-charcoal transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RefreshCcw size={12} /> Sync
            </button>
          </div>

          {bookings.length === 0 ? (
            <div className="py-12 text-center text-charcoal-light">
              <Package size={28} className="mx-auto text-champagne/50 mb-3" />
              <p className="text-sm font-light">No recent rental transactions registered for your outfits.</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border text-[9px] font-mono uppercase text-charcoal-light tracking-wider">
                    <th className="pb-3 pl-6 font-semibold">Booking Ref</th>
                    <th className="pb-3 font-semibold">Couture Listing</th>
                    <th className="pb-3 font-semibold">Renter</th>
                    <th className="pb-3 font-semibold">Timeline</th>
                    <th className="pb-3 font-semibold">Total Revenue</th>
                    <th className="pb-3 pr-6 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-ivory/20 transition-colors">
                      <td className="py-4 pl-6 font-mono font-bold text-charcoal">{b.booking_ref}</td>
                      <td className="py-4 font-medium text-charcoal max-w-[200px] truncate">
                        {b.outfit?.title || 'Heritage Design'}
                      </td>
                      <td className="py-4 text-charcoal-light">{b.renter?.name || 'Customer'}</td>
                      <td className="py-4 text-charcoal-light font-mono text-[10px]">
                        {new Date(b.pickup_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} &mdash;{' '}
                        {new Date(b.return_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="py-4 font-mono text-charcoal font-bold">₹{b.total_amount.toLocaleString('en-IN')}</td>
                      <td className="py-4 pr-6 text-right">
                        <Badge variant={b.status === 'confirmed' || b.status === 'completed' ? 'sage' : b.status === 'pending' ? 'gold' : 'rose'}>
                          {b.status.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card hoverEffect={false} padding="md" className="lg:col-span-4 bg-white border-border">
          <h3 className="font-display text-base font-semibold border-b border-border pb-4 mb-4 flex items-center gap-2">
            <TrendingUp size={15} className="text-champagne" /> Quick Actions
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Manage Listings', href: '/seller/listings', icon: LayoutGrid, desc: `${listingsCount} designs in wardrobe` },
              { label: 'View Orders', href: '/seller/orders', icon: Calendar, desc: `${activeRentals.length} active rentals` },
              { label: 'Analytics', href: '/seller/analytics', icon: TrendingUp, desc: 'Performance insights' },
              { label: 'Earnings', href: '/seller/earnings', icon: DollarSign, desc: `₹${totalEarnings.toLocaleString('en-IN')} earned` },
            ].map((item, i) => (
              <Link key={item.href} href={item.href}
                className="flex items-center justify-between p-3 rounded-lg border border-border/60 hover:border-champagne/40 hover:bg-ivory/30 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-champagne/5 border border-champagne/20 flex items-center justify-center flex-shrink-0">
                    <item.icon size={14} className="text-champagne" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-charcoal block">{item.label}</span>
                    <span className="text-[9px] text-charcoal-light font-mono">{item.desc}</span>
                  </div>
                </div>
                <ArrowRight size={14} className="text-champagne/60 group-hover:text-champagne group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
