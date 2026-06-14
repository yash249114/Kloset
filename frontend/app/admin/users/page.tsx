'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ShieldAlert, Star, CheckCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

const MOCK_RENTERS = [
  { id: 'u1', name: 'Alok Mishra', email: 'alok@gmail.com', phone: '+91 9821034421', status: 'active', trust: 95, kyc: 'verified', joined: '2024-08-12' },
  { id: 'u2', name: 'Divya Sen', email: 'divya@yahoo.com', phone: '+91 8876412034', status: 'active', trust: 99, kyc: 'verified', joined: '2025-01-04' },
  { id: 'u3', name: 'Rohit Khanna', email: 'rohit@khanna.in', phone: '+91 9122340982', status: 'flagged', trust: 78, kyc: 'submitted', joined: '2025-05-19' },
];

export default function AdminUsersPage() {
  const [query, setQuery] = useState('');
  const [renters, setRenters] = useState(MOCK_RENTERS);

  const filtered = renters.filter((r) =>
    r.name.toLowerCase().includes(query.toLowerCase()) ||
    r.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-8 text-left select-none bg-admin-bg min-h-screen text-[#E8E8E8] font-sans">
      
      {/* Header */}
      <div>
        <span className="text-[10px] font-mono tracking-[0.25em] text-[#C9A96E] uppercase font-bold block">
          Operational Hub
        </span>
        <h1 className="text-3xl md:text-4xl font-display font-medium text-[#E8E8E8] mt-1">
          Renter Registry
        </h1>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C8C8C]" size={16} />
          <input
            type="text"
            placeholder="Search renters by name/email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-[52px] pl-12 pr-4 text-sm font-sans bg-[#1A1A1A] border border-[#2A2A2A] rounded outline-none focus:border-[#C9A96E] text-white"
          />
        </div>
      </div>

      {/* Users Card */}
      <Card hoverEffect={false} padding="md" theme="admin">
        <h3 className="font-display text-base font-semibold mb-6">Registered Renter Profiles</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#2A2A2A] text-[9px] font-mono uppercase text-[#8C8C8C] tracking-wider">
                <th className="pb-3 font-semibold">User details</th>
                <th className="pb-3 font-semibold">Phone number</th>
                <th className="pb-3 font-semibold">Trust Rating</th>
                <th className="pb-3 font-semibold">Joined timeline</th>
                <th className="pb-3 font-semibold">KYC</th>
                <th className="pb-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]/40">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-[#1C1C1C] transition-colors">
                  <td className="py-4">
                    <div>
                      <p className="font-bold text-[#E8E8E8]">{u.name}</p>
                      <span className="text-[#8C8C8C] text-[10px]">{u.email}</span>
                    </div>
                  </td>
                  <td className="py-4 text-[#8C8C8C] font-mono">{u.phone}</td>
                  <td className="py-4">
                    <span className="flex items-center gap-1 font-mono font-bold text-[#C9A96E]">
                      <Star size={11} className="fill-current text-[#C9A96E]" /> {u.trust}%
                    </span>
                  </td>
                  <td className="py-4 text-[#8C8C8C]">{new Date(u.joined).toLocaleDateString()}</td>
                  <td className="py-4">
                    <Badge variant={u.kyc === 'verified' ? 'success' : 'gold'}>
                      {u.kyc}
                    </Badge>
                  </td>
                  <td className="py-4 text-right">
                    <Badge variant={u.status === 'active' ? 'sage' : 'error'}>
                      {u.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
}
