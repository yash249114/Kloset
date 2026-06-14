'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, ShieldCheck } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

const MOCK_SELLERS = [
  { id: 's1', name: 'House of Couture', email: 'studio@houseofcouture.in', joined: '2024-06-18', trust: 98, listings: 12, status: 'active', verified: true },
  { id: 's2', name: 'Aura Bridal Studio', email: 'aura.bridal@gmail.com', joined: '2024-11-20', trust: 95, listings: 8, status: 'active', verified: true },
  { id: 's3', name: 'Traditional Threads', email: 'threads@tradition.in', joined: '2025-03-02', trust: 91, listings: 5, status: 'active', verified: false },
];

export default function AdminSellersPage() {
  const [query, setQuery] = useState('');
  const [sellers] = useState(MOCK_SELLERS);

  const filtered = sellers.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.email.toLowerCase().includes(query.toLowerCase())
  );

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
          Seller Registry
        </h1>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C8C8C]" size={16} />
          <input
            type="text"
            placeholder="Search sellers by boutique name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-[52px] pl-12 pr-4 text-sm font-sans bg-[#1A1A1A] border border-[#2A2A2A] rounded outline-none focus:border-[#C9A96E] text-white"
          />
        </div>
      </div>

      {/* Table */}
      <Card hoverEffect={false} padding="md" theme="admin">
        <h3 className="font-display text-base font-semibold mb-6">Registered Seller Boutiques</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#2A2A2A] text-[9px] font-mono uppercase text-[#8C8C8C] tracking-wider">
                <th className="pb-3 font-semibold">Boutique Store</th>
                <th className="pb-3 font-semibold">Joined Timeline</th>
                <th className="pb-3 font-semibold">Listed couture</th>
                <th className="pb-3 font-semibold">Audit Rating</th>
                <th className="pb-3 font-semibold">Verification</th>
                <th className="pb-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]/40">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-[#1C1C1C] transition-colors">
                  <td className="py-4">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#E8E8E8]">{s.name}</span>
                        {s.verified && <ShieldCheck size={13} className="text-[#4CAF7D]" />}
                      </div>
                      <span className="text-[#8C8C8C] text-[10px]">{s.email}</span>
                    </div>
                  </td>
                  <td className="py-4 text-[#8C8C8C]">{new Date(s.joined).toLocaleDateString()}</td>
                  <td className="py-4 font-mono font-bold text-[#E8E8E8]">{s.listings} items</td>
                  <td className="py-4">
                    <span className="flex items-center gap-1 font-mono font-bold text-[#C9A96E]">
                      <Star size={11} className="fill-current text-[#C9A96E]" /> {s.trust}%
                    </span>
                  </td>
                  <td className="py-4">
                    <Badge variant={s.verified ? 'success' : 'outline'}>
                      {s.verified ? 'verified' : 'unverified'}
                    </Badge>
                  </td>
                  <td className="py-4 text-right">
                    <Badge variant={s.status === 'active' ? 'sage' : 'error'}>
                      {s.status}
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
