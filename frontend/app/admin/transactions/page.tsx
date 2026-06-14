'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { CreditCard, DollarSign } from 'lucide-react';

const MOCK_TRANSACTIONS = [
  { id: 't1', user: 'Alok Mishra', bookingRef: 'KL-2026-891024', type: 'escrow_payment', amount: 12500, gateway: 'razorpay', status: 'successful', date: '2026-06-13T10:45:00Z' },
  { id: 't2', user: 'House of Couture', bookingRef: 'KL-2026-441203', type: 'seller_payout', amount: 4800, gateway: 'bank_transfer', status: 'successful', date: '2026-06-12T15:20:00Z' },
  { id: 't3', user: 'Divya Sen', bookingRef: 'KL-2026-381029', type: 'escrow_payment', amount: 7200, gateway: 'razorpay', status: 'successful', date: '2026-06-12T09:15:00Z' },
  { id: 't4', user: 'Rohit Khanna', bookingRef: 'KL-2026-902410', type: 'deposit_refund', amount: 4000, gateway: 'wallet_release', status: 'pending', date: '2026-06-13T14:30:00Z' },
];

export default function AdminTransactionsPage() {
  const [txs] = useState(MOCK_TRANSACTIONS);

  const springTransition = { type: 'spring' as const, stiffness: 300, damping: 30 };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springTransition}
      className="space-y-8 text-left select-none bg-admin-bg min-h-screen text-[#E8E8E8] font-sans"
    >
      
      {/* Header */}
      <div>
        <span className="text-[10px] font-mono tracking-[0.25em] text-[#C9A96E] uppercase font-bold block">
          Operational Hub
        </span>
        <h1 className="text-3xl md:text-4xl font-display font-medium text-[#E8E8E8] mt-1">
          Escrow Transactions
        </h1>
      </div>

      {/* Ledger Table */}
      <Card hoverEffect={false} padding="md" theme="admin">
        <h3 className="font-display text-base font-semibold mb-6">Escrow Transaction Logs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#2A2A2A] text-[9px] font-mono uppercase text-[#8C8C8C] tracking-wider">
                <th className="pb-3 font-semibold">User Target</th>
                <th className="pb-3 font-semibold">Booking Ref</th>
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Channel</th>
                <th className="pb-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]/40">
              {txs.map((t) => (
                <tr key={t.id} className="hover:bg-[#1C1C1C] transition-colors">
                  <td className="py-4 font-bold text-[#E8E8E8]">{t.user}</td>
                  <td className="py-4 font-mono text-[#8C8C8C]">{t.bookingRef}</td>
                  <td className="py-4 text-[#8C8C8C] font-mono lowercase">
                    {t.type.replace('_', ' ')}
                  </td>
                  <td className="py-4 font-mono font-bold text-[#E8E8E8]">₹{t.amount.toLocaleString()}</td>
                  <td className="py-4 text-[#8C8C8C] font-mono uppercase">{t.gateway}</td>
                  <td className="py-4 text-right">
                    <Badge variant={t.status === 'successful' ? 'success' : 'gold'}>
                      {t.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </motion.div>
  );
}
