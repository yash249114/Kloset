'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Users, Calendar, DollarSign, Activity, RefreshCcw } from 'lucide-react';
import { adminAPI, AdminStats } from '@/lib/api';
import Card from '@/components/ui/Card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { toast } from 'sonner';

const MOCK_REVENUE_CHART = [
  { date: '06-08', gmv: 42000, revenue: 2100 },
  { date: '06-09', gmv: 58000, revenue: 2900 },
  { date: '06-10', gmv: 49000, revenue: 2450 },
  { date: '06-11', gmv: 62000, revenue: 3100 },
  { date: '06-12', gmv: 71000, revenue: 3550 },
  { date: '06-13', gmv: 85000, revenue: 4250 },
];

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const resp = await adminAPI.getStats();
      setStats(resp);
    } catch {
      // Offline fallback mock data for platform presentations
      setStats({
        total_users: 320,
        total_outfits: 148,
        total_bookings: 85,
        active_bookings: 28,
        total_revenue: 245000,
        open_disputes: 3,
        kyc_queue_count: 5,
        pending_approval_count: 8,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function init() {
      await loadStats();
    }
    init();
  }, []);

  const springTransition = { type: 'spring' as const, stiffness: 300, damping: 30 };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springTransition}
      className="space-y-8 text-left select-none bg-admin-bg min-h-screen text-[#E8E8E8] font-sans"
    >
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#C9A96E] uppercase font-bold block">
            Operational Hub
          </span>
          <h1 className="text-3xl md:text-4xl font-display font-medium text-[#E8E8E8] mt-1">
            Dashboard Overview
          </h1>
        </div>
        <button 
          onClick={() => loadStats(true)}
          className="h-[52px] px-4 border border-[#2A2A2A] hover:bg-[#1A1A1A] text-[#C9A96E] rounded flex items-center gap-1.5 transition-colors cursor-pointer text-xs font-mono uppercase font-bold"
        >
          <RefreshCcw size={12} /> Sync Analytics
        </button>
      </div>

      {/* KPI stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'GMV Today', val: `₹${(stats ? Math.round(stats.total_revenue * 0.2) : 42500).toLocaleString('en-IN')}`, desc: 'Escrow volume passing platform', icon: DollarSign },
          { label: 'Active Rentals', val: stats?.active_bookings?.toString() || '28', desc: 'Outfits currently in use', icon: Calendar },
          { label: 'New Users', val: stats?.total_users?.toString() || '320', desc: 'Registered renter/seller profiles', icon: Users },
          { label: 'Open Disputes', val: stats?.open_disputes?.toString() || '3', desc: 'Awaiting mediator response', icon: ShieldAlert },
          { label: 'MTD Revenue', val: `₹${(stats ? stats.total_revenue : 245000).toLocaleString('en-IN')}`, desc: 'Gross commission released', icon: Activity },
        ].map((st, index) => (
          <motion.div
            key={st.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: index * 0.05 }}
          >
            <Card 
              hoverEffect={true} 
              padding="sm" 
              theme="admin"
              className="flex flex-col justify-between h-28 w-full"
            >
              <div className="flex items-center justify-between text-[#8C8C8C]">
                <span className="text-[9px] font-mono tracking-wider uppercase">{st.label}</span>
                <st.icon size={13} className="text-[#C9A96E]" />
              </div>
              <div>
                <span className="text-xl font-bold font-mono text-[#E8E8E8]">{st.val}</span>
                <span className="text-[8px] text-[#8C8C8C] block mt-0.5">{st.desc}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springTransition, delay: 0.25 }}
        className="grid grid-cols-1 gap-6"
      >
        <Card hoverEffect={false} padding="md" theme="admin">
          <h3 className="font-display text-base font-semibold mb-6">Escrow GMV & Platform Commissions (MTD)</h3>
          <div className="h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_REVENUE_CHART}>
                <defs>
                  <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A96E" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#C9A96E" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B76E79" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#B76E79" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                <XAxis dataKey="date" stroke="#8C8C8C" />
                <YAxis stroke="#8C8C8C" />
                <Tooltip contentStyle={{ background: '#1A1A1A', border: '1px solid #2A2A2A', color: '#E8E8E8' }} />
                <Area type="monotone" name="Escrow GMV" dataKey="gmv" stroke="#C9A96E" strokeWidth={2} fillOpacity={1} fill="url(#colorGmv)" />
                <Area type="monotone" name="Platform Revenue (Take rate)" dataKey="revenue" stroke="#B76E79" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
