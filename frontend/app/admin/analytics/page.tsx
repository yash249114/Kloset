'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw, BarChart2, DollarSign, Users, Package, TrendingUp } from 'lucide-react';
import { adminAPI, AdminStats } from '@/lib/api';
import type { RevenueData } from '@/types';
import Card from '@/components/ui/Card';
import { toast } from 'sonner';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';

const MOCK_REVENUE_DATA: RevenueData[] = [
  { date: '06-01', revenue: 2100, bookings: 12 },
  { date: '06-02', revenue: 2900, bookings: 15 },
  { date: '06-03', revenue: 2450, bookings: 14 },
  { date: '06-04', revenue: 3100, bookings: 18 },
  { date: '06-05', revenue: 3550, bookings: 20 },
  { date: '06-06', revenue: 4250, bookings: 22 },
  { date: '06-07', revenue: 3800, bookings: 19 },
];

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>(MOCK_REVENUE_DATA);
  const [loading, setLoading] = useState(true);

  const loadStats = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const resp = await adminAPI.getStats();
      setStats(resp);
    } catch {
      toast.error('Failed to load analytics data.');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    async function init() {
      await loadStats();
    }
    init();
  }, []);

  return (
    <div className="space-y-8 text-left select-none bg-admin-bg min-h-screen text-[#E8E8E8] font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#C9A96E] uppercase font-bold block">
            Operational Hub
          </span>
          <h1 className="text-3xl md:text-4xl font-display font-medium text-[#E8E8E8] mt-1">
            Analytics Overview
          </h1>
        </div>
        <button 
          onClick={() => loadStats(true)}
          className="h-[52px] px-4 border border-[#2A2A2A] hover:bg-[#1A1A1A] text-[#C9A96E] rounded flex items-center gap-1.5 transition-colors cursor-pointer text-xs font-mono uppercase font-bold"
        >
          <RefreshCcw size={12} /> Sync Analytics
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Revenue', val: `₹${(stats?.total_revenue || 245000).toLocaleString('en-IN')}`, desc: 'Gross commission released', icon: DollarSign },
          { label: 'Active Rentals', val: stats?.active_bookings?.toString() || '28', desc: 'Outfits currently in use', icon: Package },
          { label: 'Total Users', val: stats?.total_users?.toString() || '320', desc: 'Registered renter/seller profiles', icon: Users },
          { label: 'Total Bookings', val: stats?.total_bookings?.toString() || '85', desc: 'All-time rental transactions', icon: BarChart2 },
          { label: 'Growth Rate', val: '+12.5%', desc: 'Month-over-month GMV growth', icon: TrendingUp },
        ].map((st) => (
          <Card key={st.label} hoverEffect={true} padding="sm" theme="admin" className="flex flex-col justify-between h-28">
            <div className="flex items-center justify-between text-[#8C8C8C]">
              <span className="text-[9px] font-mono tracking-wider uppercase">{st.label}</span>
              <st.icon size={13} className="text-[#C9A96E]" />
            </div>
            <div>
              <span className="text-xl font-bold font-mono text-[#E8E8E8]">{st.val}</span>
              <span className="text-[8px] text-[#8C8C8C] block mt-0.5">{st.desc}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card hoverEffect={false} padding="md" theme="admin">
          <h3 className="font-display text-base font-semibold mb-6">Escrow GMV & Platform Commissions (MTD)</h3>
          <div className="h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
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
                <Area type="monotone" name="Escrow GMV" dataKey="revenue" stroke="#C9A96E" strokeWidth={2} fillOpacity={1} fill="url(#colorGmv)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card hoverEffect={false} padding="md" theme="admin">
          <h3 className="font-display text-base font-semibold mb-6">Daily Booking Volume</h3>
          <div className="h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                <XAxis dataKey="date" stroke="#8C8C8C" />
                <YAxis stroke="#8C8C8C" />
                <Tooltip contentStyle={{ background: '#1A1A1A', border: '1px solid #2A2A2A', color: '#E8E8E8' }} />
                <Bar dataKey="bookings" fill="#C9A96E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card hoverEffect={false} padding="md" theme="admin">
          <h3 className="font-display text-base font-semibold mb-6">Category Distribution</h3>
          <div className="space-y-4 text-sm">
            {[
              { name: 'Lehenga', value: 35, color: '#C9A96E' },
              { name: 'Saree', value: 25, color: '#B76E79' },
              { name: 'Sherwani', value: 18, color: '#4CAF7D' },
              { name: 'Gown', value: 12, color: '#D4A853' },
              { name: 'Others', value: 10, color: '#6B6B6B' },
            ].map((cat) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#E8E8E8]">{cat.name}</span>
                  <span className="font-mono text-[#C9A96E]">{cat.value}%</span>
                </div>
                <div className="h-2 bg-[#2A2A2A] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full" 
                    style={{ width: `${cat.value}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card hoverEffect={false} padding="md" theme="admin">
          <h3 className="font-display text-base font-semibold mb-6">Top Performing Sellers</h3>
          <div className="space-y-3 text-sm">
            {[
              { name: 'House of Couture', revenue: 45000, bookings: 12 },
              { name: 'Aura Bridal Studio', revenue: 38000, bookings: 10 },
              { name: 'Royal Heritage', revenue: 32000, bookings: 8 },
              { name: 'Elite Ensembles', revenue: 28000, bookings: 7 },
            ].map((seller, i) => (
              <div key={seller.name} className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded">
                <div>
                  <span className="font-mono text-[#C9A96E]">#{i + 1}</span>
                  <span className="ml-2 text-[#E8E8E8]">{seller.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#E8E8E8]">₹{seller.revenue.toLocaleString()}</div>
                  <div className="text-[10px] text-[#8C8C8C]">{seller.bookings} bookings</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card hoverEffect={false} padding="md" theme="admin">
          <h3 className="font-display text-base font-semibold mb-6">Geographic Revenue</h3>
          <div className="space-y-3 text-sm">
            {[
              { city: 'Mumbai', revenue: 85000 },
              { city: 'Delhi NCR', revenue: 72000 },
              { city: 'Bangalore', revenue: 45000 },
              { city: 'Hyderabad', revenue: 28000 },
              { city: 'Chennai', revenue: 15000 },
            ].map((geo) => (
              <div key={geo.city} className="flex justify-between p-3 bg-[#1A1A1A] rounded">
                <span className="text-[#E8E8E8]">{geo.city}</span>
                <span className="font-mono text-[#C9A96E]">₹{geo.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}