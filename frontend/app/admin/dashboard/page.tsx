'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FloatIn from '@/components/motion/FloatIn';
import FloralDivider from '@/components/floral/FloralDivider';
import PetalBackground from '@/components/floral/PetalBackground';
import { toast } from 'sonner';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  ShieldAlert,
  Users,
  DollarSign,
  ShoppingBag,
  Check,
  X,
  Star,
  Layers,
  TrendingUp,
} from 'lucide-react';

// Mock Pending KYC Check Queue
const mockPendingKYC = [
  { id: 'usr-102', name: 'Rohan Malhotra', email: 'rohan@example.com', role: 'seller', city: 'Jaipur' },
  { id: 'usr-205', name: 'Kavita Patel', email: 'kavita@example.com', role: 'seller', city: 'Ahmedabad' },
];

// Mock Outfits Pending Approval
const mockPendingOutfits = [
  { id: 'out-402', title: 'Banarasi Brocade Sherwani', category: 'Sherwani', seller: 'Arjun Menswear', price: 3500 },
];

// Analytics Data
const transactionData = [
  { month: 'Jan', sales: 12000 },
  { month: 'Feb', sales: 19000 },
  { month: 'Mar', sales: 32000 },
  { month: 'Apr', sales: 45000 },
  { month: 'May', sales: 58000 },
];

const categoryDistribution = [
  { name: 'Lehenga', value: 400, color: 'var(--rose)' },
  { name: 'Saree', value: 300, color: 'var(--gold)' },
  { name: 'Sherwani', value: 150, color: 'var(--sage-dark)' },
  { name: 'Gowns/Other', value: 200, color: 'var(--ink-light)' },
];

export default function AdminDashboardPage() {
  const [kycQueue, setKycQueue] = useState(mockPendingKYC);
  const [outfitQueue, setOutfitQueue] = useState(mockPendingOutfits);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleApproveKYC = (id: string) => {
    setKycQueue(kycQueue.filter((user) => user.id !== id));
    toast.success('User KYC verified successfully! Vendor status active. 🛡️');
  };

  const handleRejectKYC = (id: string) => {
    setKycQueue(kycQueue.filter((user) => user.id !== id));
    toast.error('KYC request declined.');
  };

  const handleApproveOutfit = (id: string) => {
    setOutfitQueue(outfitQueue.filter((out) => out.id !== id));
    toast.success('Outfit approved for marketplace display! 👗');
  };

  const handleRejectOutfit = (id: string) => {
    setOutfitQueue(outfitQueue.filter((out) => out.id !== id));
    toast.error('Listing request rejected.');
  };

  return (
    <div className="min-h-screen relative pb-24" style={{ background: 'var(--ivory)' }}>
      <PetalBackground />

      {/* Hero Header */}
      <section className="relative pt-12 pb-8">
        <div className="container mx-auto px-6">
          <FloatIn>
            <div
              className="rounded-[28px] p-8 md:p-10 relative overflow-hidden shadow-sm"
              style={{
                background: 'white',
                border: '1px solid var(--petal)',
              }}
            >
              {/* Decorative top strip */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[var(--gold)] via-[var(--bloom)] to-[var(--rose)]" />
              
              <div>
                <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[var(--rose)] font-bold">Admin Console</span>
                <h1 className="text-4xl md:text-5xl font-display font-bold mt-2" style={{ color: 'var(--ink)' }}>
                  Platform Control
                </h1>
                <p className="text-sm mt-2 max-w-xl" style={{ color: 'var(--ink-light)' }}>
                  Administrative overview of Kloset. Fulfill vendor onboardings, authorize designer listings, and monitor marketplace operations.
                </p>
              </div>
            </div>
          </FloatIn>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="py-4">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Platform Revenue', val: '₹1,48,500', icon: DollarSign, desc: 'Total commissions collected' },
              { label: 'Total Members', val: '1,248', icon: Users, desc: 'Renters & verified sellers' },
              { label: 'Pending Approvals', val: (kycQueue.length + outfitQueue.length).toString(), icon: ShieldAlert, desc: 'Awaiting authorization' },
              { label: 'Active Rentals', val: '45', icon: ShoppingBag, desc: 'Outfits currently on lease' },
            ].map((stat, i) => (
              <FloatIn key={stat.label} delay={i * 0.08}>
                <div
                  className="rounded-2xl p-5 bg-white border border-[var(--petal)] transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono tracking-wider uppercase text-[var(--ink-light)]">{stat.label}</span>
                    <stat.icon size={16} style={{ color: 'var(--rose)' }} />
                  </div>
                  <div className="text-3xl font-display font-bold" style={{ color: 'var(--ink)' }}>{stat.val}</div>
                  <span className="text-[11px] mt-1 block" style={{ color: 'var(--ink-lighter)' }}>{stat.desc}</span>
                </div>
              </FloatIn>
            ))}
          </div>
        </div>
      </section>

      <FloralDivider />

      {/* Analytics Charts */}
      {mounted && (
        <section className="py-4">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Transaction volume chart */}
              <FloatIn>
                <div className="bg-white rounded-3xl p-6 border border-[var(--petal)] shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp size={18} className="text-[var(--rose)]" />
                    <h3 className="font-display text-xl font-bold text-[var(--ink)]">Cumulative Transaction Growth</h3>
                  </div>

                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={transactionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis
                          dataKey="month"
                          stroke="var(--ink-lighter)"
                          fontSize={11}
                          fontFamily="var(--font-mono)"
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="var(--ink-lighter)"
                          fontSize={11}
                          fontFamily="var(--font-mono)"
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `₹${value}`}
                        />
                        <Tooltip
                          contentStyle={{
                            background: 'white',
                            border: '1px solid var(--petal)',
                            borderRadius: '12px',
                            fontFamily: 'var(--font-body)',
                            fontSize: '12px',
                          }}
                          formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Volume']}
                        />
                        <Bar dataKey="sales" fill="var(--rose)" radius={[8, 8, 0, 0]} barSize={32}>
                          {transactionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 4 ? 'var(--gold)' : 'var(--rose)'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </FloatIn>

              {/* Outfit category pie chart */}
              <FloatIn delay={0.1}>
                <div className="bg-white rounded-3xl p-6 border border-[var(--petal)] shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <Layers size={18} className="text-[var(--gold)]" />
                    <h3 className="font-display text-xl font-bold text-[var(--ink)]">Showroom Category Distribution</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center h-60">
                    <div className="h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={75}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {categoryDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="space-y-3 font-mono text-xs">
                      {categoryDistribution.map((cat) => (
                        <div key={cat.name} className="flex items-center justify-between p-2 rounded-xl bg-[var(--bloom)]/40 border border-[var(--petal)]/20">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ background: cat.color }} />
                            <span className="text-[var(--ink)]">{cat.name}</span>
                          </div>
                          <span className="font-bold text-[var(--ink-light)]">{cat.value} units</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </FloatIn>

            </div>
          </div>
        </section>
      )}

      <FloralDivider />

      {/* Task Queues */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* KYC Queue */}
            <div className="space-y-6">
              <div className="border-b border-[var(--bloom)] pb-3">
                <h3 className="font-display text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--ink)' }}>
                  KYC Verification Requests
                </h3>
              </div>

              <AnimatePresence>
                {kycQueue.length > 0 ? (
                  <div className="space-y-4">
                    {kycQueue.map((user) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="rounded-2xl p-5 bg-white border border-[var(--petal)] space-y-4 shadow-sm"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-display text-lg font-bold" style={{ color: 'var(--ink)' }}>{user.name}</h4>
                            <p className="text-xs" style={{ color: 'var(--ink-light)' }}>{user.email}</p>
                            <div className="flex gap-2 mt-2">
                              <span className="badge badge-rose text-[9px] uppercase tracking-wider">{user.role}</span>
                              <span className="text-[10px] font-mono" style={{ color: 'var(--ink-lighter)' }}>Location: {user.city}</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono tracking-wider uppercase style={{ color: 'var(--ink-lighter)' }}">{user.id}</span>
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-[var(--bloom)]">
                          <button
                            onClick={() => handleApproveKYC(user.id)}
                            className="flex-1 btn-gold !py-2.5 !px-4 text-[10px] font-mono tracking-wider flex items-center justify-center gap-1.5 uppercase shadow-sm"
                          >
                            <Check size={12} /> Verify KYC
                          </button>
                          <button
                            onClick={() => handleRejectKYC(user.id)}
                            className="btn-outline !py-2.5 !px-4 text-[10px] font-mono tracking-wider flex items-center justify-center gap-1.5 uppercase shadow-sm"
                          >
                            <X size={12} /> Decline
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-2xl p-8 bg-white/40 border border-dashed border-[var(--petal)] text-center text-xs"
                    style={{ color: 'var(--ink-lighter)' }}
                  >
                    <Star size={24} className="mx-auto mb-2 text-[var(--gold)] opacity-70" />
                    All user KYC checks completed!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Outfit Approval Queue */}
            <div className="space-y-6">
              <div className="border-b border-[var(--bloom)] pb-3">
                <h3 className="font-display text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--ink)' }}>
                  Outfit Approval Requests
                </h3>
              </div>

              <AnimatePresence>
                {outfitQueue.length > 0 ? (
                  <div className="space-y-4">
                    {outfitQueue.map((outfit) => (
                      <motion.div
                        key={outfit.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="rounded-2xl p-5 bg-white border border-[var(--petal)] space-y-4 shadow-sm"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-display text-lg font-bold" style={{ color: 'var(--ink)' }}>{outfit.title}</h4>
                            <p className="text-xs" style={{ color: 'var(--ink-light)' }}>
                              Listed by: <span className="font-semibold">{outfit.seller}</span>
                            </p>
                            <div className="flex gap-2 mt-2">
                              <span className="badge badge-gold text-[9px] uppercase tracking-wider">{outfit.category}</span>
                              <span className="text-[10px] font-mono" style={{ color: 'var(--ink-lighter)' }}>₹{outfit.price.toLocaleString('en-IN')} / day</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono tracking-wider uppercase text-[var(--ink-lighter)]">{outfit.id}</span>
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-[var(--bloom)]">
                          <button
                            onClick={() => handleApproveOutfit(outfit.id)}
                            className="flex-1 btn-gold !py-2.5 !px-4 text-[10px] font-mono tracking-wider flex items-center justify-center gap-1.5 uppercase shadow-sm"
                          >
                            <Check size={12} /> Approve Outfit
                          </button>
                          <button
                            onClick={() => handleRejectOutfit(outfit.id)}
                            className="btn-outline !py-2.5 !px-4 text-[10px] font-mono tracking-wider flex items-center justify-center gap-1.5 uppercase shadow-sm"
                          >
                            <X size={12} /> Reject Listing
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-2xl p-8 bg-white/40 border border-dashed border-[var(--petal)] text-center text-xs"
                    style={{ color: 'var(--ink-lighter)' }}
                  >
                    <Layers size={24} className="mx-auto mb-2 text-[var(--rose)] opacity-70" />
                    All designer listings approved.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
