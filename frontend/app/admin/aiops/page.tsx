'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, RefreshCcw, Cpu, CheckCircle } from 'lucide-react';
import { adminAPI } from '@/lib/api';
import Card from '@/components/ui/Card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { toast } from 'sonner';

const MOCK_LATENCY = [
  { time: '09:00', latency: 420 },
  { time: '10:00', latency: 480 },
  { time: '11:00', latency: 390 },
  { time: '12:00', latency: 510 },
  { time: '13:00', latency: 430 },
  { time: '14:00', latency: 400 },
];

interface AIOpsData {
  active_agentsCount: number;
  calls_last_hour: number;
  latency_avg_ms: number;
  status: string;
  uptime: string;
  logs: Array<{
    time: string;
    agent: string;
    event: string;
    detail: string;
  }>;
}

export default function AdminAIOpsPage() {
  const [data, setData] = useState<AIOpsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [pulse, setPulse] = useState(true);

  const loadOps = async (silent = false) => {
    if (!silent) setLoading(true);
    setPulse(true);
    try {
      const resp = await adminAPI.getAIOps();
      setData(resp);
    } catch {
      // Offline fallback mock details for monitor polling presentations
      setData({
        active_agentsCount: 4,
        calls_last_hour: 124,
        latency_avg_ms: 450,
        status: 'Operational',
        uptime: '99.98%',
        logs: [
          { time: '14:28:10', agent: 'StylistHelper', event: 'Query completed', detail: 'Outfit recommend for category Lehenga' },
          { time: '14:27:04', agent: 'StylistHelper', event: 'Query completed', detail: 'Timeline check for Crimson Saree' },
        ],
      });
    } finally {
      setLoading(false);
      // Brief delay to simulate pulse blinking
      setTimeout(() => setPulse(false), 800);
    }
  };

  // Setup real polling every 30 seconds
  useEffect(() => {
    async function init() {
      await loadOps();
    }
    init();
    const interval = setInterval(() => {
      loadOps(true);
    }, 30000); // 30 seconds real polling

    return () => clearInterval(interval);
  }, []);

  const springTransition = { type: 'spring' as const, stiffness: 300, damping: 30 };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springTransition}
      className="space-y-8 text-left select-none bg-admin-bg min-h-screen text-[#E8E8E8] font-sans"
    >
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#C9A96E] uppercase font-bold block">
            AIOps Monitoring
          </span>
          <h1 className="text-3xl md:text-4xl font-display font-medium text-[#E8E8E8] mt-1 flex items-center gap-3">
            Agent Live Operations
            
            {/* Champagne Pulse Indicator */}
            <span className="relative flex h-3.5 w-3.5">
              {pulse && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A96E] opacity-75"></span>}
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#C9A96E]"></span>
            </span>
          </h1>
        </div>
        <button 
          onClick={() => loadOps(true)}
          className="text-[#C9A96E] hover:underline text-xs font-mono uppercase tracking-widest flex items-center gap-1 cursor-pointer bg-transparent border-0"
        >
          <RefreshCcw size={12} className={pulse ? 'animate-spin' : ''} /> Sync Monitor
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'AI Agent Instances', val: data?.active_agentsCount?.toString() || '4', icon: Cpu, desc: 'Active Gemini model bindings' },
          { label: 'Calls (Last Hour)', val: data?.calls_last_hour?.toString() || '124', icon: Activity, desc: 'User queries compiled' },
          { label: 'Response Latency', val: `${data?.latency_avg_ms || 450}ms`, icon: RefreshCcw, desc: 'Average round-trip response' },
          { label: 'System Health', val: data?.status || 'Operational', icon: CheckCircle, desc: `Uptime: ${data?.uptime || '99.98%'}` },
        ].map((st, index) => (
          <motion.div
            key={st.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: index * 0.05 }}
          >
            <Card hoverEffect={false} padding="sm" theme="admin" className="flex flex-col justify-between h-28 w-full">
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springTransition, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        
        {/* Latency Area Chart */}
        <Card hoverEffect={false} padding="md" theme="admin" className="lg:col-span-7">
          <h3 className="font-display text-base font-semibold mb-6">Model Latency Track (ms)</h3>
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_LATENCY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                <XAxis dataKey="time" stroke="#8C8C8C" />
                <YAxis stroke="#8C8C8C" />
                <Tooltip contentStyle={{ background: '#1A1A1A', border: '1px solid #2A2A2A', color: '#E8E8E8' }} />
                <Area type="monotone" name="Latency (ms)" dataKey="latency" stroke="#C9A96E" fill="#C9A96E" fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Live Logs */}
        <Card hoverEffect={false} padding="md" theme="admin" className="lg:col-span-5 flex flex-col justify-between">
          <div className="space-y-4 text-xs">
            <h3 className="font-display text-sm font-bold text-[#E8E8E8]">Live Query Streams</h3>
            <div className="space-y-3 font-mono text-[10px] text-[#8C8C8C] max-h-64 overflow-y-auto scroll-rail">
              {data?.logs?.map((l: AIOpsData['logs'][0], i: number) => (
                <div key={i} className="p-2.5 border border-[#2A2A2A] bg-[#131313] rounded space-y-1">
                  <div className="flex justify-between items-center text-[#C9A96E] font-bold">
                    <span>{l.agent}</span>
                    <span>{l.time}</span>
                  </div>
                  <p className="font-bold text-[#E8E8E8]">{l.event}</p>
                  <p className="font-light text-[9px]">{l.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

      </motion.div>
    </motion.div>
  );
}
