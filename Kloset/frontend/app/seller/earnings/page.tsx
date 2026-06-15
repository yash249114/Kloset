'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useAuthStore } from '@/store/useAuthStore';
import { bookingsAPI } from '@/lib/api';
import type { Booking } from '@/types';
import { toast } from 'sonner';

export default function SellerEarningsPage() {
  const { user } = useAuthStore();
  const [earningsList, setEarningsList] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const resp = await bookingsAPI.listSellerBookings(1, 10);
        setEarningsList(resp.bookings.filter((b) => b.status === 'completed' || b.status === 'returned'));
      } catch {
        console.warn('Failed to load completed payout orders.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalBalance = user?.wallet_balance || 0;

  const handleWithdraw = async () => {
    if (totalBalance <= 0) {
      toast.error('Your wallet balance is empty.');
      return;
    }
    setWithdrawing(true);
    // Simulate API withdrawal request delay
    setTimeout(() => {
      setWithdrawing(false);
      toast.success('Payout withdrawal initiated! Transfer will credit in 2-3 business days.');
    }, 1500);
  };

  const springTransition = { type: 'spring' as const, stiffness: 300, damping: 30 };

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
            Earnings & Payouts
          </h1>
        </div>
      </div>

      {/* Wallet overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springTransition}
        className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch"
      >
        
        {/* Wallet Balance Card */}
        <Card hoverEffect={false} padding="lg" className="md:col-span-7 bg-[#FAF9F6] border-border relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 inset-x-0 h-1 bg-champagne" />
          <div className="space-y-4">
            <span className="text-[10px] font-mono tracking-widest text-champagne uppercase font-bold block">
              Studio Balance Wallet
            </span>
            <h2 className="text-4xl font-bold font-mono">
              ₹{totalBalance.toLocaleString('en-IN')}
            </h2>
            <p className="text-xs text-charcoal-light leading-relaxed max-w-sm font-light">
              Released rental revenue is securely credited to your wallet after visual inspection.
            </p>
          </div>
          <div className="pt-6">
            <Button
              variant="gold"
              isLoading={withdrawing}
              onClick={handleWithdraw}
              className="px-10 cursor-pointer"
            >
              Withdraw to Bank Account
            </Button>
          </div>
        </Card>

        {/* Bank Config */}
        <Card hoverEffect={false} padding="md" className="md:col-span-5 bg-white border-border flex flex-col justify-between">
          <div className="space-y-4 text-xs text-charcoal-light">
            <h3 className="font-display text-sm font-bold text-charcoal">Configured Payout Account</h3>
            <div className="p-3 border border-border bg-ivory/30 rounded space-y-2 font-mono text-[11px]">
              <div>
                <span className="text-[9px] uppercase tracking-wider block text-charcoal-light/60">Bank Name</span>
                <span className="font-bold text-charcoal">HDFC Bank Ltd.</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider block text-charcoal-light/60">Account Number</span>
                <span className="font-bold text-charcoal">XXXX-XXXX-9876</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider block text-charcoal-light/60">IFSC Code</span>
                <span className="font-bold text-charcoal">HDFC0000241</span>
              </div>
            </div>
          </div>
          <button className="text-[10px] font-mono uppercase tracking-wider text-champagne hover:text-charcoal hover:underline mt-4 text-left font-bold cursor-pointer font-sans border-0 bg-transparent">
            Edit Bank Details
          </button>
        </Card>

      </motion.div>

      {/* Ledger list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springTransition, delay: 0.1 }}
      >
        <Card hoverEffect={false} padding="md" className="bg-white border-border w-full">
          <h3 className="font-display text-base font-semibold border-b border-border pb-4 mb-4">Earnings History</h3>
          {loading ? (
            <div className="space-y-2 animate-pulse">
              <div className="shimmer h-12 bg-ivory-dark rounded" />
              <div className="shimmer h-12 bg-ivory-dark rounded" />
            </div>
          ) : earningsList.length === 0 ? (
            <p className="text-xs text-charcoal-light py-6 text-center font-light">No completed payouts registered yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border text-[9px] font-mono uppercase text-charcoal-light tracking-wider">
                    <th className="pb-3 font-semibold">Ref</th>
                    <th className="pb-3 font-semibold">Timeline Date</th>
                    <th className="pb-3 font-semibold">Design Listing</th>
                    <th className="pb-3 font-semibold">Gross Earned</th>
                    <th className="pb-3 font-semibold text-right">Escrow release</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {earningsList.map((e) => (
                    <tr key={e.id}>
                      <td className="py-4 font-mono font-bold text-charcoal">{e.booking_ref}</td>
                      <td className="py-4 text-charcoal-light">{new Date(e.created_at).toLocaleDateString()}</td>
                      <td className="py-4 font-medium text-charcoal">{e.outfit?.title || 'Design item'}</td>
                      <td className="py-4 font-mono text-charcoal font-bold">₹{e.rental_amount.toLocaleString()}</td>
                      <td className="py-4 text-right">
                        <Badge variant="success">released</Badge>
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
