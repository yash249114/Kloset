'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Calendar, Users, Eye, RefreshCcw } from 'lucide-react';
import Card from '@/components/ui/Card';
import { bookingsAPI, outfitsAPI } from '@/lib/api';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { toast } from 'sonner';

const MOCK_MONTHLY_VIEWS = [
  { month: 'Jan', views: 250, rentals: 12 },
  { month: 'Feb', views: 320, rentals: 15 },
  { month: 'Mar', views: 410, rentals: 18 },
  { month: 'Apr', views: 500, rentals: 24 },
  { month: 'May', views: 650, rentals: 32 },
  { month: 'Jun', views: 720, rentals: 38 },
];

const MOCK_CATEGORY_DATA = [
  { category: 'Lehenga', value: 45 },
  { category: 'Saree', value: 30 },
  { category: 'Sherwani', value: 15 },
  { category: 'Other', value: 10 },
];

export default function SellerAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [totalViews, setTotalViews] = useState(1480);
  const [conversionRate, setConversionRate] = useState('5.4%');

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8 text-left font-sans select-none text-charcoal">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-champagne uppercase font-bold block">
            Seller Studio
          </span>
          <h1 className="text-3xl md:text-4xl font-display font-medium text-charcoal mt-1">
            Studio Analytics
          </h1>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Wardrobe Views', val: totalViews.toLocaleString(), icon: Eye, change: '+12% this month' },
          { label: 'Booking Conversion', val: conversionRate, icon: TrendingUp, change: '+0.8% average' },
          { label: 'Average Rental Fee', val: '₹2,450', icon: Calendar, change: 'Across all active categories' },
          { label: 'Repeat Renters', val: '32%', icon: Users, change: 'Loyal customer rate' },
        ].map((st) => (
          <Card key={st.label} hoverEffect={true} padding="sm" className="bg-white border-border flex flex-col justify-between h-28">
            <div className="flex items-center justify-between text-charcoal-light">
              <span className="text-[10px] font-mono tracking-wider uppercase">{st.label}</span>
              <st.icon size={14} className="text-champagne" />
            </div>
            <div>
              <span className="text-xl font-bold text-charcoal">{st.val}</span>
              <span className="text-[8px] text-success block mt-0.5">{st.change}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Visual Charts Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Area Chart */}
        <Card hoverEffect={false} padding="md" className="lg:col-span-8 bg-white border-border">
          <h3 className="font-display text-base font-semibold mb-6">Monthly Impressions & Rentals</h3>
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_MONTHLY_VIEWS}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A96E" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#C9A96E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F2EDE4" />
                <XAxis dataKey="month" stroke="#6B6B6B" />
                <YAxis stroke="#6B6B6B" />
                <Tooltip />
                <Area type="monotone" dataKey="views" stroke="#C9A96E" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Categories Share Chart */}
        <Card hoverEffect={false} padding="md" className="lg:col-span-4 bg-white border-border">
          <h3 className="font-display text-base font-semibold mb-6">Category Popularity (%)</h3>
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_CATEGORY_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F2EDE4" />
                <XAxis dataKey="category" stroke="#6B6B6B" />
                <YAxis stroke="#6B6B6B" />
                <Tooltip />
                <Bar dataKey="value" fill="#B76E79">
                  {MOCK_CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#C9A96E' : '#B76E79'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>

    </div>
  );
}
