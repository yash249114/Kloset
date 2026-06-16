'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  Truck,
  Package,
  Sparkles,
  CheckCircle2,
  Clock,
  Inbox,
  IndianRupee,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { bookingsAPI } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import type { Booking, BookingStatus } from '@/types';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

const RETURN_STATUSES: BookingStatus[] = ['return_initiated', 'returned', 'cleaning'];

const getStatusBadge = (status: BookingStatus) => {
  switch (status) {
    case 'return_initiated':
      return <Badge variant="rose">Return In Transit</Badge>;
    case 'returned':
      return <Badge variant="sage">Garment Received</Badge>;
    case 'cleaning':
      return <Badge variant="outline">Atelier Cleaning</Badge>;
    case 'completed':
      return <Badge variant="success">Refund Complete</Badge>;
    default:
      return <Badge variant="charcoal">{status}</Badge>;
  }
};

const getRefundStatus = (status: BookingStatus) => {
  switch (status) {
    case 'return_initiated':
      return { label: 'Pending', step: 1, color: 'text-amber-600', bg: 'bg-amber-100' };
    case 'returned':
      return { label: 'Processing', step: 2, color: 'text-blue-600', bg: 'bg-blue-100' };
    case 'cleaning':
      return { label: 'Processing', step: 2, color: 'text-blue-600', bg: 'bg-blue-100' };
    case 'completed':
      return { label: 'Completed', step: 3, color: 'text-emerald-600', bg: 'bg-emerald-100' };
    default:
      return { label: 'Pending', step: 1, color: 'text-amber-600', bg: 'bg-amber-100' };
  }
};

const getEstimatedDate = (booking: Booking): string => {
  const base = new Date(booking.updated_at || booking.created_at);
  const days = booking.status === 'return_initiated' ? 7 : booking.status === 'returned' ? 5 : 3;
  base.setDate(base.getDate() + days);
  return base.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const springTransition = { type: 'spring' as const, stiffness: 300, damping: 30 };

export default function RenterReturnsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'in_transit' | 'processing' | 'completed'>('all');

  const loadReturns = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const allBookings: Booking[] = [];
      for (const status of RETURN_STATUSES) {
        const resp = await bookingsAPI.listMyBookings(1, 20, status);
        allBookings.push(...resp.bookings);
      }
      setBookings(allBookings);
    } catch {
      toast.error('Failed to load returns registry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error('Please sign in to view your returns.');
      router.push('/auth/login?redirect=/returns');
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadReturns();
  }, [isAuthenticated, authLoading]);

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === 'in_transit') return booking.status === 'return_initiated';
    if (activeTab === 'processing') return booking.status === 'returned' || booking.status === 'cleaning';
    if (activeTab === 'completed') return booking.status === 'completed';
    return true;
  });

  const totalRefundPending = bookings
    .filter((b) => ['return_initiated', 'returned', 'cleaning'].includes(b.status))
    .reduce((sum, b) => sum + b.security_deposit, 0);

  if (authLoading || loading) {
    return (
      <div className="bg-ivory min-h-screen pt-36 text-center select-none font-mono text-xs text-charcoal-light">
        <div className="animate-spin inline-block w-6 h-6 border-2 border-champagne rounded-full border-t-transparent mb-2" />
        <p>Loading Returns & Refund Ledger...</p>
      </div>
    );
  }

  return (
    <div className="bg-ivory min-h-screen pt-28 pb-16 font-sans text-charcoal select-none text-left">
      <div className="max-w-5xl mx-auto px-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-semibold text-charcoal-light mb-6">
          <Link href="/profile" className="hover:text-charcoal transition-colors">Account Studio</Link>
          <ChevronRight size={10} />
          <span className="text-champagne">Returns & Refunds</span>
        </div>

        {/* Title */}
        <div className="mb-10 text-left">
          <span className="text-xs font-mono tracking-[0.2em] text-champagne uppercase font-bold block mb-1">
            Garment Return & Refund Tracker
          </span>
          <h1 className="text-3xl font-display font-medium text-charcoal">
            Returns & Refunds
          </h1>
          <p className="text-xs text-charcoal-light font-mono mt-1">
            Track garment returns, cleaning status, and security deposit refund settlements.
          </p>
        </div>

        {/* Refund Summary Card */}
        {bookings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springTransition}
            className="mb-8"
          >
            <Card hoverEffect={false} padding="md" className="bg-white border-border shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-champagne/10 flex items-center justify-center">
                    <ShieldCheck size={18} className="text-champagne" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-charcoal-light uppercase font-semibold block">
                      Security Deposit Refundable
                    </span>
                    <span className="text-lg font-display font-medium text-charcoal">
                      ₹{totalRefundPending.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-charcoal-light">
                  <Clock size={12} />
                  <span>Refunds settle within 5–7 business days of garment receipt</span>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Tab Filters */}
        <div className="flex border-b border-border/80 mb-8">
          {[
            { id: 'all', label: 'All Returns' },
            { id: 'in_transit', label: 'In Transit' },
            { id: 'processing', label: 'Processing' },
            { id: 'completed', label: 'Refunded' },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={springTransition}
              className={`h-[52px] px-6 text-xs font-mono font-bold uppercase tracking-wider border-b-2 cursor-pointer transition-colors ${
                activeTab === tab.id
                  ? 'border-champagne text-champagne'
                  : 'border-transparent text-charcoal-light hover:text-charcoal'
              }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Returns List */}
        {filteredBookings.length === 0 ? (
          <Card hoverEffect={false} padding="lg" className="bg-white border-border text-center py-16">
            <Inbox size={32} className="mx-auto text-champagne mb-4 animate-pulse" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-charcoal">
              No active returns
            </h3>
            <p className="text-[10px] font-mono text-charcoal-light/70 mt-1 max-w-sm mx-auto font-light">
              You do not have any garments currently in the return or refund process.
            </p>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={springTransition} className="inline-block mt-6">
              <Link href="/orders" className="btn btn-primary h-[52px] px-8 text-xs font-mono uppercase tracking-widest inline-flex items-center justify-center">
                View My Bookings
              </Link>
            </motion.div>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => {
              const startFmt = new Date(booking.pickup_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
              const endFmt = new Date(booking.return_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
              const refundInfo = getRefundStatus(booking.status);
              const estimatedDate = getEstimatedDate(booking);

              return (
                <motion.div
                  key={booking.id}
                  whileHover={{ y: -4, boxShadow: '0 8px 25px rgba(0, 0, 0, 0.02)' }}
                  transition={springTransition}
                >
                  <Card
                    hoverEffect={false}
                    padding="md"
                    className="bg-white border-border shadow-sm flex flex-col md:flex-row gap-6 relative overflow-hidden text-left"
                  >
                    {/* Status bar */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-[#D4AF37]/20" />

                    {/* Garment image */}
                    <div className="w-full md:w-32 aspect-[3/4] rounded-lg border border-border overflow-hidden bg-ivory-dark flex-shrink-0 relative">
                      {booking.outfit?.images?.[0] ? (
                        <Image
                          src={booking.outfit.images[0].url}
                          alt="Garment Thumbnail"
                          width={128}
                          height={170}
                          unoptimized
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-charcoal-light/40">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Summary */}
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <span className="text-[9px] font-mono text-champagne font-bold uppercase tracking-wider block">
                            Registry ID: {booking.booking_ref}
                          </span>
                          <h3 className="text-base font-display font-medium text-charcoal mt-0.5">
                            {booking.outfit?.title || 'Garment Rental'}
                          </h3>
                          <p className="text-[10px] font-mono text-charcoal-light font-light mt-1">
                            Rented {startFmt} — {endFmt}
                          </p>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(booking.status)}
                        </div>
                      </div>

                      {/* Rental details grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 border border-border/60 bg-[#FAF9F6] rounded-lg text-xs">
                        <div>
                          <span className="text-[9px] font-mono text-charcoal-light uppercase block font-semibold">Rental Start</span>
                          <span className="font-semibold text-charcoal mt-0.5 block flex items-center gap-1">
                            <Truck size={12} className="text-champagne" /> {startFmt}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono text-charcoal-light uppercase block font-semibold">Rental End</span>
                          <span className="font-semibold text-charcoal mt-0.5 block">{endFmt}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono text-charcoal-light uppercase block font-semibold">Total Paid</span>
                          <span className="font-mono font-bold text-charcoal mt-0.5 block">
                            ₹{booking.total_amount.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono text-charcoal-light uppercase block font-semibold">Deposit Refund</span>
                          <span className="font-mono font-bold text-emerald-600 mt-0.5 block flex items-center gap-1">
                            <IndianRupee size={10} /> {booking.security_deposit.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Refund tracking section */}
                      <div className="p-4 border border-border/60 bg-[#FAF9F6] rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <ShieldCheck size={14} className="text-champagne" />
                          <span className="text-[9px] font-mono text-charcoal-light uppercase font-semibold">
                            Refund Tracking
                          </span>
                          <span className={`ml-auto text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${refundInfo.bg} ${refundInfo.color}`}>
                            {refundInfo.label}
                          </span>
                        </div>

                        {/* Progress steps */}
                        <div className="flex items-center gap-0 mb-3">
                          {[
                            { step: 1, label: 'Return Initiated', icon: Package },
                            { step: 2, label: 'Garment Received', icon: Sparkles },
                            { step: 3, label: 'Refund Settled', icon: CheckCircle2 },
                          ].map((s, i) => (
                            <React.Fragment key={s.step}>
                              <div className="flex flex-col items-center">
                                <div
                                  className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors ${
                                    refundInfo.step >= s.step
                                      ? 'bg-champagne border-champagne text-white'
                                      : 'bg-white border-border text-charcoal-light/40'
                                  }`}
                                >
                                  <s.icon size={12} />
                                </div>
                                <span
                                  className={`text-[8px] font-mono mt-1 text-center leading-tight ${
                                    refundInfo.step >= s.step ? 'text-charcoal font-semibold' : 'text-charcoal-light/50'
                                  }`}
                                >
                                  {s.label}
                                </span>
                              </div>
                              {i < 2 && (
                                <div
                                  className={`flex-1 h-0.5 mx-1 mt-[-14px] rounded-full ${
                                    refundInfo.step > s.step ? 'bg-champagne' : 'bg-border'
                                  }`}
                                />
                              )}
                            </React.Fragment>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-[10px] font-mono text-charcoal-light">
                          <span>
                            Estimated refund date: <span className="font-semibold text-charcoal">{estimatedDate}</span>
                          </span>
                          <span>
                            Refundable: <span className="font-semibold text-emerald-600">₹{booking.security_deposit.toLocaleString('en-IN')}</span>
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3 pt-2">
                        {booking.status === 'return_initiated' && (
                          <Button
                            variant="outline"
                            onClick={() => toast.info(`Tracking for ${booking.booking_ref} — return shipment in transit.`)}
                            className="h-[52px] text-[10px] px-4 font-mono font-bold uppercase tracking-wider border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400 cursor-pointer"
                          >
                            <Truck size={12} className="mr-1" /> Track Return Shipment
                          </Button>
                        )}

                        {['returned', 'cleaning'].includes(booking.status) && (
                          <Button
                            variant="outline"
                            onClick={() => toast.info(`Refund for ${booking.booking_ref} is being processed by our finance team.`)}
                            className="h-[52px] text-[10px] px-4 font-mono font-bold uppercase tracking-wider border-amber-200 text-amber-600 hover:bg-amber-50 hover:border-amber-400 cursor-pointer"
                          >
                            <Clock size={12} className="mr-1" /> Check Refund Status
                          </Button>
                        )}

                        {booking.status === 'completed' && (
                          <Button
                            variant="outline"
                            onClick={() => toast.success(`Refund of ₹${booking.security_deposit.toLocaleString('en-IN')} for ${booking.booking_ref} has been credited.`)}
                            className="h-[52px] text-[10px] px-4 font-mono font-bold uppercase tracking-wider border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-400 cursor-pointer"
                          >
                            <CheckCircle2 size={12} className="mr-1" /> View Refund Receipt
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          onClick={() => router.push('/orders')}
                          className="h-[52px] text-[10px] px-4 font-mono font-bold uppercase tracking-wider text-charcoal-light hover:text-charcoal cursor-pointer"
                        >
                          <ArrowRight size={12} className="mr-1" /> Back to Bookings
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
