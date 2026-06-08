'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSupportStore, SupportTicket } from '@/stores/support.store';
import FloatIn from '@/components/motion/FloatIn';
import PetalBackground from '@/components/floral/PetalBackground';
import { toast } from 'sonner';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import {
  ShieldAlert,
  Users,
  Check,
  X,
  Lock,
  QrCode,
  DollarSign,
  TrendingUp,
  Activity,
  Layers,
  UserCheck,
  MessageSquare,
  RefreshCw,
  Send,
  AlertOctagon,
  FileText,
  FileSpreadsheet,
} from 'lucide-react';
import { adminAPI, AdminStats, AdminKYCUser, AdminPendingOutfit, AdminDispute } from '@/lib/api/admin';

interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  ipAddress: string;
}

const initialAuditLogs: AuditLog[] = [
  { id: 'LOG-001', timestamp: '2026-05-30 14:20:05', actor: 'SYSTEM', action: 'KYC check triggered for Kiara Luxury', ipAddress: '127.0.0.1' },
  { id: 'LOG-002', timestamp: '2026-05-30 15:45:12', actor: 'admin@test', action: 'Approved listing: Golden Silk Zardozi Saree', ipAddress: '192.168.1.5' },
  { id: 'LOG-003', timestamp: '2026-05-30 16:10:44', actor: 'SYSTEM', action: 'Support Ticket TKT-1001 escalated to critical priority', ipAddress: '127.0.0.1' },
];

const platformRevenueData = [
  { month: 'Jan', commission: 2500, gross: 50000 },
  { month: 'Feb', commission: 3800, gross: 76000 },
  { month: 'Mar', commission: 4200, gross: 84000 },
  { month: 'Apr', commission: 6800, gross: 136000 },
  { month: 'May', commission: 9800, gross: 196000 },
];

export default function AdminStudioPage() {
  const { tickets, fetchTickets, updateTicketStatus, addAgentReply } = useSupportStore();

  // Auth States
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isCredentialPassed, setIsCredentialPassed] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Active Admin Tabs
  const [adminTab, setAdminTab] = useState<'metrics' | 'aiops' | 'kyc' | 'approvals' | 'tickets' | 'refunds' | 'logs'>('metrics');

  // Active Live API data states
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [aiopsData, setAIOpsData] = useState<any>(null);
  const [kycQueue, setKycQueue] = useState<AdminKYCUser[]>([]);
  const [approvalsQueue, setApprovalsQueue] = useState<AdminPendingOutfit[]>([]);
  const [disputesQueue, setDisputesQueue] = useState<AdminDispute[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Chat Ticket Selection State
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [agentResponse, setAgentResponse] = useState('');

  const [mounted, setMounted] = useState(false);

  const loadAllData = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const [sData, aData, kData, oData, dData, lData] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getAIOps(),
        adminAPI.getKYCQueue(),
        adminAPI.getPendingOutfits(),
        adminAPI.getDisputes(),
        adminAPI.getLogs(),
      ]);
      setStats(sData);
      setAIOpsData(aData);
      setKycQueue(kData);
      setApprovalsQueue(oData);
      setDisputesQueue(dData);
      setAuditLogs(lData);
      await fetchTickets(true);
    } catch (err: any) {
      console.error(err);
      if (!silent) {
        toast.error('Failed to load admin workspace data. Please make sure you are logged in as an administrator.');
      }
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isAdminAuthenticated) {
      loadAllData();
      const interval = setInterval(() => {
        loadAllData(true);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [isAdminAuthenticated]);

  if (!mounted) return null;

  // Credential Verification Gate
  const handleCredentialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (emailInput === 'admin@test' && passwordInput === 'admin@test') {
      setIsCredentialPassed(true);
    } else {
      setLoginError('Invalid Administrator credentials.');
    }
  };

  // Google Authenticator TOTP Setup Mock Gate
  const handleMFASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mfaCode.length === 6) {
      setIsAdminAuthenticated(true);
      toast.success('MFA verification successful! Welcome back admin.');
      
      // Log login audit
      const logObj: AuditLog = {
        id: `LOG-${Date.now().toString().slice(-3)}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor: 'admin@test',
        action: 'Administrator Session authenticated via TOTP MFA',
        ipAddress: '192.168.1.10',
      };
      setAuditLogs((prev) => [logObj, ...prev]);
    } else {
      toast.error('Invalid 6-digit TOTP token.');
    }
  };

  const handleKYCAction = async (id: string, action: 'approved' | 'rejected', reason?: string) => {
    try {
      if (action === 'approved') {
        await adminAPI.approveKYC(id);
        toast.success(`Seller application verified and merchant activated.`);
      } else {
        await adminAPI.rejectKYC(id, reason || 'KYC document was not clear or invalid');
        toast.success(`Seller application rejected.`);
      }
      
      // Log action
      const userObj = kycQueue.find(k => k.id === id);
      const logObj: AuditLog = {
        id: `LOG-${Date.now().toString().slice(-3)}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor: 'admin@test',
        action: `KYC ${action} for Seller: "${userObj?.name || id}"`,
        ipAddress: '192.168.1.10',
      };
      setAuditLogs((prev) => [logObj, ...prev]);
      loadAllData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || `Failed to KYC ${action}.`);
    }
  };

  const handleListingAction = async (id: string, action: 'approved' | 'rejected', reason?: string) => {
    try {
      if (action === 'approved') {
        await adminAPI.approveOutfit(id);
        toast.success(`Couture Listing approved.`);
      } else {
        await adminAPI.rejectOutfit(id, reason || 'Outfit images are of low quality');
        toast.success(`Couture Listing rejected.`);
      }

      // Log action
      const itemObj = approvalsQueue.find(a => a.id === id);
      const logObj: AuditLog = {
        id: `LOG-${Date.now().toString().slice(-3)}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor: 'admin@test',
        action: `Listing listing ${action}: "${itemObj?.title || id}"`,
        ipAddress: '192.168.1.10',
      };
      setAuditLogs((prev) => [logObj, ...prev]);
      loadAllData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || `Failed to ${action} listing.`);
    }
  };

  const handleRefundAction = async (id: string, action: 'approved' | 'rejected') => {
    try {
      const dispute = disputesQueue.find(d => d.id === id);
      if (!dispute) return;

      if (action === 'approved') {
        await adminAPI.resolveDispute(id, {
          resolution: 'full_refund_renter',
          note: 'Refund release approved by administrator.',
          refund_amount: dispute.deposit_amount,
        });
        toast.success(`Refund of ₹${dispute.deposit_amount} processed and dispute resolved.`);
      } else {
        await adminAPI.resolveDispute(id, {
          resolution: 'dismissed',
          note: 'Refund request denied. Security deposit released.',
          refund_amount: 0,
        });
        toast.success(`Refund request dismissed.`);
      }

      // Log action
      const logObj: AuditLog = {
        id: `LOG-${Date.now().toString().slice(-3)}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor: 'admin@test',
        action: `Dispute request ${id} resolved as ${action === 'approved' ? 'refunded' : 'dismissed'}`,
        ipAddress: '192.168.1.10',
      };
      setAuditLogs((prev) => [logObj, ...prev]);
      loadAllData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || `Failed to resolve dispute.`);
    }
  };

  const handleSendAgentReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicketId || !agentResponse.trim()) return;

    addAgentReply(selectedTicketId, agentResponse);
    setAgentResponse('');
    toast.success('Response dispatched to customer.');
  };

  // Calculations for platform
  const activeTickets = tickets.filter(t => t.status !== 'resolved' && t.status !== 'closed');
  const selectedTicket = tickets.find(t => t.id === selectedTicketId);

  // LOGIN GATE UI
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen relative flex items-center justify-center py-12 px-6" style={{ background: 'var(--ivory)' }}>
        <PetalBackground />
        
        <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-[28px] shadow-2xl relative z-10 border border-[var(--petal)] space-y-6">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[var(--rose)] via-[var(--bloom)] to-[var(--gold)]" />
          
          <div className="text-center">
            <div className="w-12 h-12 bg-[var(--bloom)]/30 rounded-full flex items-center justify-center mx-auto text-[var(--rose)] mb-3">
              <Lock size={22} />
            </div>
            <h2 className="text-2xl font-display font-bold text-[var(--ink)]">Admin Studio Access</h2>
            <p className="text-[10px] font-mono tracking-widest uppercase text-[var(--ink-light)] mt-1">
              Platform Headquarters
            </p>
          </div>

          {!isCredentialPassed ? (
            /* Phase 1 Credentials */
            <form onSubmit={handleCredentialSubmit} className="space-y-4">
              {loginError && (
                <div className="text-[11px] text-[var(--rose-dark)] flex items-center gap-1 font-mono">
                  <ShieldAlert size={14} />
                  {loginError}
                </div>
              )}
              
              <div>
                <label className="text-[9px] uppercase font-mono tracking-wider text-[var(--ink-light)] block mb-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="input-kloset text-sm"
                  placeholder="admin@test"
                />
              </div>

              <div>
                <label className="text-[9px] uppercase font-mono tracking-wider text-[var(--ink-light)] block mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="input-kloset text-sm"
                  placeholder="admin@test"
                />
              </div>

              <button
                type="submit"
                className="btn-rose w-full tracking-widest uppercase font-mono text-xs !h-[48px]"
              >
                Submit Credentials
              </button>
            </form>
          ) : (
            /* Phase 2 MFA Simulator Setup */
            <form onSubmit={handleMFASubmit} className="space-y-4 text-center">
              <div className="p-4 bg-[var(--ivory-warm)]/50 rounded-2xl border border-[var(--petal)]/40 flex flex-col items-center space-y-3">
                <QrCode size={120} className="text-[var(--ink-light)]" />
                <div>
                  <h4 className="font-semibold text-xs text-[var(--ink)]">MFA Authenticator QR Setup</h4>
                  <p className="text-[9px] leading-relaxed text-[var(--ink-light)] max-w-[250px] mx-auto mt-1">
                    Scan using Google Authenticator / Microsoft Authenticator app on your device.
                  </p>
                </div>
              </div>

              <div className="text-left">
                <label className="text-[9px] uppercase font-mono tracking-wider text-[var(--ink-light)] block mb-1 text-center">
                  Enter 6-Digit TOTP Token
                </label>
                <input
                  type="text"
                  required
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').substring(0, 6))}
                  className="input-kloset font-mono text-center tracking-[0.4em] text-lg"
                  placeholder="000000"
                />
                <p className="text-[8px] text-[var(--rose)] leading-relaxed italic text-center mt-2">
                  * Note: TOTP validation is simulated in dev. Enter any 6-digit code to log in.
                </p>
              </div>

              <button
                type="submit"
                className="btn-gold w-full tracking-widest uppercase font-mono text-xs !h-[48px] cursor-pointer"
              >
                Authenticate Studio
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // MAIN ADMIN WORKSPACE
  return (
    <div className="min-h-screen relative pb-20" style={{ background: 'var(--ivory)' }}>
      <PetalBackground />

      {/* Header Profile */}
      <section className="relative pt-12 pb-6 z-10">
        <div className="container mx-auto px-6">
          <FloatIn>
            <div className="rounded-[28px] p-6 bg-white border border-[var(--petal)] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[var(--gold)] via-[var(--bloom)] to-[var(--rose)]" />
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-display font-bold text-[var(--ink)]">Kloset Admin Studio</h1>
                    <span className="badge badge-rose text-[9px] font-bold font-mono">Dev Sandbox</span>
                  </div>
                  <p className="text-xs text-[var(--ink-light)] mt-1">
                    System Administration Console. Oversee commissions, KYC queues, listings approvals, and escalations.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => loadAllData()}
                    disabled={isLoading}
                    className="btn-gold !h-[42px] !px-4 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
                    Refresh
                  </button>
                  <button
                    onClick={() => {
                      setIsAdminAuthenticated(false);
                      setIsCredentialPassed(false);
                      setMfaCode('');
                    }}
                    className="btn-outline !h-[42px] !px-4 text-xs font-mono uppercase tracking-wider"
                  >
                    Lock Studio
                  </button>
                </div>
              </div>
            </div>
          </FloatIn>
        </div>
      </section>

      {/* Quick Statistics Banner */}
      <section className="py-2 z-10 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { 
                label: 'Platform Commissions (5%)', 
                value: stats?.total_revenue ? `₹${Math.round(stats.total_revenue * 0.05).toLocaleString()}` : '₹0', 
                icon: DollarSign 
              },
              { 
                label: 'Pending KYC Checks', 
                value: kycQueue.length.toString(), 
                icon: UserCheck 
              },
              { 
                label: 'Listing Approvals', 
                value: approvalsQueue.length.toString(), 
                icon: Layers 
              },
              { 
                label: 'Active Support Tickets', 
                value: activeTickets.length.toString(), 
                icon: MessageSquare 
              },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-4 border border-[var(--petal)] shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase font-mono tracking-wider text-[var(--ink-lighter)] block">
                    {stat.label}
                  </span>
                  <span className="text-xl font-bold font-display text-[var(--ink)] mt-1 block">
                    {stat.value}
                  </span>
                </div>
                <stat.icon size={18} className="text-[var(--gold)]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Console Workspace */}
      <section className="py-6 z-10 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Sidebar Controls */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-[var(--petal)] p-4 shadow-sm space-y-1">
                <h3 className="text-[10px] font-mono uppercase tracking-widest text-[var(--ink-lighter)] mb-3 pl-2">
                  Queues & Monitoring
                </h3>
                {[
                  { id: 'metrics' as const, label: 'Platform Metrics', count: '' },
                  { id: 'aiops' as const, label: 'AIOps Intelligence', count: '' },
                  { id: 'kyc' as const, label: 'KYC Seller Queue', count: kycQueue.length.toString() },
                  { id: 'approvals' as const, label: 'Listing Approvals', count: approvalsQueue.length.toString() },
                  { id: 'tickets' as const, label: 'Support Tickets', count: activeTickets.length.toString() },
                  { id: 'refunds' as const, label: 'Disputes & Refunds', count: disputesQueue.filter(d => d.status === 'open').length.toString() },
                  { id: 'logs' as const, label: 'Audit Security Logs', count: '' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setAdminTab(tab.id);
                      setSelectedTicketId(null);
                    }}
                    className={`w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-xs font-mono uppercase tracking-wider transition-all text-left cursor-pointer ${
                      adminTab === tab.id
                        ? 'bg-[var(--rose)] text-white font-bold shadow-md'
                        : 'text-[var(--ink-light)] hover:bg-[var(--bloom)]/20'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.count && tab.count !== '0' && (
                      <span className={`text-[9px] font-bold rounded-full w-5 h-5 flex items-center justify-center font-mono ${adminTab === tab.id ? 'bg-white text-[var(--rose)]' : 'bg-[var(--bloom)] text-[var(--rose)]'}`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Pane Console */}
            <div className="lg:col-span-9">
              <AnimatePresence mode="wait">
                
                {/* TAB 1: Platform Metrics */}
                {adminTab === 'metrics' && (
                  <motion.div
                    key="metrics-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="space-y-6"
                  >
                    <div className="bg-white rounded-3xl p-6 border border-[var(--petal)] shadow-sm">
                      <h3 className="font-display text-lg font-semibold text-[var(--ink)] mb-4">
                        Gross Transaction Volumes & Commission Earnings
                      </h3>
                      <div className="h-64 w-full">
                        {mounted && (
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={platformRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                              <XAxis dataKey="month" stroke="var(--ink-lighter)" fontSize={10} fontFamily="var(--font-mono)" tickLine={false} />
                              <YAxis stroke="var(--ink-lighter)" fontSize={10} fontFamily="var(--font-mono)" tickLine={false} />
                              <Tooltip />
                              <Area type="monotone" dataKey="gross" name="Gross Transactions (₹)" stroke="var(--gold)" strokeWidth={2} fill="rgba(201, 169, 110, 0.1)" />
                              <Area type="monotone" dataKey="commission" name="Kloset Commission (5%)" stroke="var(--rose)" strokeWidth={2} fill="rgba(193, 123, 123, 0.15)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>

                    {/* Fraud Monitoring Alerts */}
                    <div className="bg-white rounded-3xl p-5 border border-[var(--petal)] shadow-sm space-y-4">
                      <div className="flex items-center gap-2 text-[var(--rose-dark)]">
                        <AlertOctagon size={18} />
                        <h4 className="font-semibold text-sm uppercase tracking-wider font-mono">Platform Fraud Alert Logs</h4>
                      </div>
                      <div className="p-3 bg-[var(--bloom)]/30 rounded-xl border border-[var(--petal)] text-xs text-[var(--ink-light)] font-mono flex items-center justify-between">
                        <span>⚠️ 1 Multiple IP address logins detected on seller credentials Manish Malhotra</span>
                        <span className="text-[10px] text-[var(--ink-lighter)]">2 mins ago</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB AIOps: AIOps Intelligence */}
                {adminTab === 'aiops' && (
                  <motion.div
                    key="aiops-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="space-y-6"
                  >
                    <div className="bg-white rounded-3xl p-6 border border-[var(--petal)] shadow-sm space-y-6">
                      <div className="flex justify-between items-center pb-3 border-b">
                        <div>
                          <h3 className="font-display text-lg font-semibold text-[var(--ink)]">
                            AIOps Platform Intelligence
                          </h3>
                          <p className="text-[11px] text-[var(--ink-light)] mt-0.5">
                            Real-time platform system health, predictive trends, and automated revenue insights.
                          </p>
                        </div>
                        <button
                          onClick={() => loadAllData()}
                          disabled={isLoading}
                          className="btn-outline !h-8 !px-3 text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                        >
                          <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
                          Refresh AI Insights
                        </button>
                      </div>

                      {/* Main Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Box 1: Platform Health */}
                        <div className="p-5 rounded-2xl bg-[var(--ivory-warm)]/20 border border-[var(--petal)]/40 space-y-4">
                          <div className="flex items-center gap-2 text-[var(--rose-dark)]">
                            <Activity size={18} />
                            <h4 className="font-semibold text-xs uppercase tracking-wider font-mono">Platform Health Monitor</h4>
                          </div>
                          {aiopsData?.platform_health ? (
                            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                              <div className="p-3 bg-white rounded-xl border border-[var(--petal)]/30">
                                <span className="text-[9px] uppercase tracking-wider text-[var(--ink-lighter)] block">CPU Load</span>
                                <span className="font-bold text-sm text-[var(--ink)] mt-1 block">{aiopsData.platform_health.cpu_usage_percent}%</span>
                              </div>
                              <div className="p-3 bg-white rounded-xl border border-[var(--petal)]/30">
                                <span className="text-[9px] uppercase tracking-wider text-[var(--ink-lighter)] block">Memory Used</span>
                                <span className="font-bold text-sm text-[var(--ink)] mt-1 block">{aiopsData.platform_health.memory_usage_mb} MB</span>
                              </div>
                              <div className="p-3 bg-white rounded-xl border border-[var(--petal)]/30">
                                <span className="text-[9px] uppercase tracking-wider text-[var(--ink-lighter)] block">DB Connections</span>
                                <span className="font-bold text-sm text-[var(--ink)] mt-1 block">{aiopsData.platform_health.active_db_pools} pools</span>
                              </div>
                              <div className="p-3 bg-white rounded-xl border border-[var(--petal)]/30">
                                <span className="text-[9px] uppercase tracking-wider text-[var(--ink-lighter)] block">Redis Cache</span>
                                <span className="font-bold text-sm mt-1 block uppercase text-emerald-600">{aiopsData.platform_health.redis_status}</span>
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-[var(--ink-lighter)] italic">AIOps health metrics offline</p>
                          )}
                        </div>

                        {/* Box 2: Revenue Intelligence */}
                        <div className="p-5 rounded-2xl bg-[var(--ivory-warm)]/20 border border-[var(--petal)]/40 space-y-4">
                          <div className="flex items-center gap-2 text-[var(--rose-dark)]">
                            <DollarSign size={18} />
                            <h4 className="font-semibold text-xs uppercase tracking-wider font-mono">Revenue Intelligence</h4>
                          </div>
                          {aiopsData?.revenue_intelligence ? (
                            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                              <div className="p-3 bg-white rounded-xl border border-[var(--petal)]/30">
                                <span className="text-[9px] uppercase tracking-wider text-[var(--ink-lighter)] block">Gross Booking Volume</span>
                                <span className="font-bold text-sm text-[var(--ink)] mt-1 block">₹{aiopsData.revenue_intelligence.gross_booking_volume.toLocaleString()}</span>
                              </div>
                              <div className="p-3 bg-white rounded-xl border border-[var(--petal)]/30">
                                <span className="text-[9px] uppercase tracking-wider text-[var(--ink-lighter)] block">Commissions Earned</span>
                                <span className="font-bold text-sm text-[var(--rose)] mt-1 block">₹{aiopsData.revenue_intelligence.commission_earned.toLocaleString()}</span>
                              </div>
                              <div className="p-3 bg-white rounded-xl border border-[var(--petal)]/30">
                                <span className="text-[9px] uppercase tracking-wider text-[var(--ink-lighter)] block">Seller Payouts</span>
                                <span className="font-bold text-sm text-[var(--ink)] mt-1 block">₹{aiopsData.revenue_intelligence.payouts_completed.toLocaleString()}</span>
                              </div>
                              <div className="p-3 bg-white rounded-xl border border-[var(--petal)]/30">
                                <span className="text-[9px] uppercase tracking-wider text-[var(--ink-lighter)] block">MRR Growth</span>
                                <span className="font-bold text-sm text-[var(--gold)] mt-1 block">+{aiopsData.revenue_intelligence.mrr_growth_percent}%</span>
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-[var(--ink-lighter)] italic">Revenue data unavailable</p>
                          )}
                        </div>

                        {/* Box 3: Booking & Seller Intelligence */}
                        <div className="p-5 rounded-2xl bg-[var(--ivory-warm)]/20 border border-[var(--petal)]/40 space-y-4">
                          <div className="flex items-center gap-2 text-[var(--rose-dark)]">
                            <Layers size={18} />
                            <h4 className="font-semibold text-xs uppercase tracking-wider font-mono">Marketplace Liquidity</h4>
                          </div>
                          {aiopsData?.booking_intelligence && aiopsData?.seller_intelligence ? (
                            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                              <div className="p-3 bg-white rounded-xl border border-[var(--petal)]/30">
                                <span className="text-[9px] uppercase tracking-wider text-[var(--ink-lighter)] block">Avg Rental Duration</span>
                                <span className="font-bold text-sm text-[var(--ink)] mt-1 block">{aiopsData.booking_intelligence.average_rental_duration_days} days</span>
                              </div>
                              <div className="p-3 bg-white rounded-xl border border-[var(--petal)]/30">
                                <span className="text-[9px] uppercase tracking-wider text-[var(--ink-lighter)] block">Dispute Rate</span>
                                <span className="font-bold text-sm text-[var(--rose-dark)] mt-1 block">{aiopsData.booking_intelligence.dispute_rate_percent}%</span>
                              </div>
                              <div className="p-3 bg-white rounded-xl border border-[var(--petal)]/30">
                                <span className="text-[9px] uppercase tracking-wider text-[var(--ink-lighter)] block">Fulfillment Rate</span>
                                <span className="font-bold text-sm text-[var(--ink)] mt-1 block">{aiopsData.booking_intelligence.fulfillment_rate_percent}%</span>
                              </div>
                              <div className="p-3 bg-white rounded-xl border border-[var(--petal)]/30">
                                <span className="text-[9px] uppercase tracking-wider text-[var(--ink-lighter)] block">Merchant Trust Rating</span>
                                <span className="font-bold text-sm text-[var(--gold)] mt-1 block">{aiopsData.seller_intelligence.average_trust_score}/100</span>
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-[var(--ink-lighter)] italic">Liquidity metrics offline</p>
                          )}
                        </div>

                        {/* Box 4: Trend Detection */}
                        <div className="p-5 rounded-2xl bg-[var(--ivory-warm)]/20 border border-[var(--petal)]/40 space-y-4">
                          <div className="flex items-center gap-2 text-[var(--rose-dark)]">
                            <TrendingUp size={18} />
                            <h4 className="font-semibold text-xs uppercase tracking-wider font-mono">Predictive Fashion Trends</h4>
                          </div>
                          {aiopsData?.trend_detection ? (
                            <div className="space-y-3 text-xs">
                              <div>
                                <span className="text-[9px] uppercase tracking-wider font-mono text-[var(--ink-lighter)]">Demand Velocity</span>
                                <span className="badge badge-gold font-bold ml-2 font-mono uppercase text-[9px]">{aiopsData.trend_detection.demand_velocity} velocity</span>
                              </div>
                              <div>
                                <span className="text-[9px] uppercase tracking-wider font-mono text-[var(--ink-lighter)] block mb-1">Trending Categories</span>
                                <div className="space-y-1">
                                  {aiopsData.trend_detection.categories && aiopsData.trend_detection.categories.length > 0 ? (
                                    aiopsData.trend_detection.categories.map((tc: any, i: number) => (
                                      <div key={i} className="flex justify-between items-center bg-white p-2 rounded-lg border border-[var(--petal)]/20 font-mono text-[10px]">
                                        <span className="capitalize">{tc.category.replace('_', ' ')}</span>
                                        <span className="font-bold text-[var(--rose)]">{tc.count} leases</span>
                                      </div>
                                    ))
                                  ) : (
                                    <span className="text-[10px] text-[var(--ink-light)] italic font-sans">No bookings lease data yet to calculate category trends.</span>
                                  )}
                                </div>
                              </div>
                              <div className="pt-1">
                                <span className="text-[9px] uppercase tracking-wider font-mono text-[var(--ink-lighter)] block mb-1">Trending Colors</span>
                                <div className="flex gap-2">
                                  {aiopsData.trend_detection.hot_colors.map((c: string) => (
                                    <span key={c} className="badge badge-rose text-[9px] font-mono tracking-wider">{c}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-[var(--ink-lighter)] italic">Fashion trends data offline</p>
                          )}
                        </div>

                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB 2: KYC Seller Queue */}
                {adminTab === 'kyc' && (
                  <motion.div
                    key="kyc-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="bg-white rounded-3xl p-6 border border-[var(--petal)] shadow-sm space-y-6"
                  >
                    <h3 className="font-display text-lg font-semibold text-[var(--ink)] pb-3 border-b">
                      KYC Verification Requests
                    </h3>

                    {kycQueue.length === 0 ? (
                      <p className="text-xs text-[var(--ink-lighter)]">All seller verification requests have been resolved.</p>
                    ) : (
                      <div className="space-y-4">
                        {kycQueue.map((req) => (
                          <div key={req.id} className="p-4 rounded-xl border bg-[var(--ivory-warm)]/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-[var(--ink)]">{req.name} Couture</span>
                                <span className="font-mono text-[9px] text-[var(--ink-lighter)]">({req.id})</span>
                              </div>
                              <p>Owner: <span className="font-semibold">{req.name}</span> ({req.email})</p>
                              <p className="font-mono text-[10px] text-[var(--ink-light)]">Doc: Aadhaar & PAN hashes - <span className="font-semibold">Verified by Hash</span></p>
                            </div>
                            
                            <div className="flex-shrink-0 flex items-center gap-2">
                              {req.kyc_status === 'submitted' ? (
                                <>
                                  <button
                                    onClick={() => handleKYCAction(req.id, 'rejected')}
                                    className="btn-outline !h-8 !px-3 text-[10px] uppercase font-mono"
                                  >
                                    Decline
                                  </button>
                                  <button
                                    onClick={() => handleKYCAction(req.id, 'approved')}
                                    className="btn-gold !h-8 !px-3 text-[10px] uppercase font-mono cursor-pointer"
                                  >
                                    Approve Seller
                                  </button>
                                </>
                              ) : (
                                <span className={`badge uppercase text-[9px] font-bold ${req.kyc_status === 'verified' ? 'badge-sage' : 'badge-rose'}`}>
                                  {req.kyc_status}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* TAB 3: Listing Approvals */}
                {adminTab === 'approvals' && (
                  <motion.div
                    key="approvals-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="bg-white rounded-3xl p-6 border border-[var(--petal)] shadow-sm space-y-6"
                  >
                    <h3 className="font-display text-lg font-semibold text-[var(--ink)] pb-3 border-b">
                      Seller Outfit Listing Verification
                    </h3>

                    {approvalsQueue.length === 0 ? (
                      <p className="text-xs text-[var(--ink-lighter)]">All submitted listings are verified.</p>
                    ) : (
                      <div className="space-y-4">
                        {approvalsQueue.map((item) => {
                          const imageUrl = (item.images && item.images.length > 0) 
                            ? item.images[0].url 
                            : 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=300&h=400&fit=crop';
                          return (
                            <div key={item.id} className="p-4 rounded-xl border bg-[var(--ivory-warm)]/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                              <div className="flex gap-3 items-center">
                                <div className="w-12 h-16 relative rounded-lg overflow-hidden border flex-shrink-0">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={imageUrl} alt={item.title} className="object-cover w-full h-full" />
                                </div>
                                <div className="space-y-1">
                                  <span className="font-bold text-sm text-[var(--ink)] font-display block">{item.title}</span>
                                  <span className="text-[10px] text-[var(--ink-light)] font-mono uppercase tracking-wider block">
                                    Seller: {item.seller_name} · Category: {item.category}
                                  </span>
                                  <p className="font-mono text-[10px] text-[var(--ink-light)]">
                                    Rate: ₹{item.price_3day}/3-days · Deposit: ₹{item.security_deposit}
                                  </p>
                                </div>
                              </div>

                              <div className="flex-shrink-0 flex items-center gap-2">
                                {item.status === 'pending_approval' ? (
                                  <>
                                    <button
                                      onClick={() => handleListingAction(item.id, 'rejected')}
                                      className="btn-outline !h-8 !px-3 text-[10px] uppercase font-mono"
                                    >
                                      Decline
                                    </button>
                                    <button
                                      onClick={() => handleListingAction(item.id, 'approved')}
                                      className="btn-gold !h-8 !px-3 text-[10px] uppercase font-mono cursor-pointer"
                                    >
                                      Approve Listing
                                    </button>
                                  </>
                                ) : (
                                  <span className={`badge uppercase text-[9px] font-bold ${item.status === 'active' ? 'badge-sage' : 'badge-rose'}`}>
                                    {item.status}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* TAB 4: Support Tickets (Wired to Zustand store) */}
                {adminTab === 'tickets' && (
                  <motion.div
                    key="tickets-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-6"
                  >
                    {/* Ticket List */}
                    <div className="md:col-span-5 bg-white rounded-3xl p-5 border border-[var(--petal)] shadow-sm space-y-4">
                      <h3 className="font-display text-base font-semibold pb-2 border-b text-[var(--ink)]">
                        Support Requests ({tickets.length})
                      </h3>
                      <div className="space-y-2.5 max-h-[350px] overflow-y-auto silk-scroll pr-1">
                        {tickets.map((tkt) => (
                          <div
                            key={tkt.id}
                            onClick={() => setSelectedTicketId(tkt.id)}
                            className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                              selectedTicketId === tkt.id
                                ? 'bg-[var(--bloom)]/20 border-[var(--rose)] shadow-sm'
                                : 'bg-white border-zinc-150 hover:border-[var(--rose)]'
                            }`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-mono text-[9px] uppercase tracking-wider font-bold text-[var(--ink-light)]">{tkt.id}</span>
                              <span className={`badge text-[8px] uppercase px-1.5 py-0.2 ${
                                tkt.priority === 'critical' ? 'badge-rose' : tkt.priority === 'high' ? 'badge-gold' : 'badge-sage'
                              }`}>
                                {tkt.priority}
                              </span>
                            </div>
                            <h4 className="font-semibold truncate text-[var(--ink)]">{tkt.subject}</h4>
                            <p className="text-[10px] text-[var(--ink-lighter)] truncate mt-1">Status: {tkt.status}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Chat Thread / Actions */}
                    <div className="md:col-span-7 bg-white rounded-3xl p-5 border border-[var(--petal)] shadow-sm flex flex-col justify-between min-h-[400px]">
                      {selectedTicket ? (
                        <>
                          {/* Thread Header */}
                          <div className="pb-3 border-b border-[var(--bloom)] flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-sm text-[var(--ink)] font-display text-base">
                                {selectedTicket.subject}
                              </h4>
                              <p className="text-[10px] text-[var(--ink-light)] mt-0.5">
                                Customer: {selectedTicket.renterName} ({selectedTicket.renterEmail})
                              </p>
                            </div>
                            
                            {/* Ticket Status Select Dropdown */}
                            <select
                              value={selectedTicket.status}
                              onChange={(e) => updateTicketStatus(selectedTicket.id, e.target.value as any)}
                              className="bg-[var(--ivory)] border border-[var(--petal)] text-[10px] rounded-lg px-2 py-1 font-mono text-[var(--ink)] focus:outline-none"
                            >
                              <option value="open">Open</option>
                              <option value="in-progress">In Progress</option>
                              <option value="waiting">Waiting</option>
                              <option value="resolved">Resolved</option>
                              <option value="closed">Closed</option>
                            </select>
                          </div>

                          {/* Chat history logs */}
                          <div className="flex-1 overflow-y-auto py-4 space-y-3 max-h-[220px] silk-scroll text-xs">
                            <div className="p-3 bg-zinc-50 rounded-xl border border-dashed border-zinc-200 leading-relaxed text-[var(--ink-light)]">
                              <span className="font-semibold text-[var(--ink)] block">Original Description:</span>
                              {selectedTicket.description}
                            </div>

                            {selectedTicket.chatHistory.map((chat, idx) => (
                              <div key={idx} className={`flex ${chat.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                                <div className={`p-2.5 rounded-xl max-w-[85%] ${chat.sender === 'user' ? 'bg-[var(--bloom)]/30 text-[var(--ink)]' : 'bg-[var(--rose)] text-white'}`}>
                                  <span className="text-[8px] opacity-60 uppercase font-mono tracking-wider block mb-0.5">
                                    {chat.sender === 'user' ? 'Renter' : 'Agent Response'}
                                  </span>
                                  <p className="leading-relaxed">{chat.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Agent Reply Box */}
                          <form onSubmit={handleSendAgentReply} className="pt-3 border-t border-[var(--bloom)] flex gap-2">
                            <input
                              type="text"
                              required
                              value={agentResponse}
                              onChange={(e) => setAgentResponse(e.target.value)}
                              placeholder="Write reply to customer..."
                              className="flex-1 bg-[var(--ivory)] border border-[var(--petal)]/60 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[var(--rose)]"
                            />
                            <button
                              type="submit"
                              className="btn-rose !h-[36px] !px-4 text-xs !rounded-xl cursor-pointer"
                            >
                              <Send size={12} />
                            </button>
                          </form>
                        </>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-xs text-[var(--ink-lighter)]">
                          <MessageSquare size={32} className="opacity-40 mb-2" />
                          <span>Select a ticket from the queue list to view details & reply.</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* TAB 5: Refund Requests Queue (Disputes) */}
                {adminTab === 'refunds' && (
                  <motion.div
                    key="refunds-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="bg-white rounded-3xl p-6 border border-[var(--petal)] shadow-sm space-y-6"
                  >
                    <h3 className="font-display text-lg font-semibold text-[var(--ink)] pb-3 border-b">
                      Disputes & Security Deposit Clearances
                    </h3>

                    {disputesQueue.length === 0 ? (
                      <p className="text-xs text-[var(--ink-lighter)]">All pending disputes and refunds are resolved.</p>
                    ) : (
                      <div className="space-y-4">
                        {disputesQueue.map((req) => (
                          <div key={req.id} className="p-4 rounded-xl border bg-[var(--ivory-warm)]/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-[var(--ink)]">{req.renter_name}</span>
                                <span className="font-mono text-[9px] text-[var(--ink-lighter)]">({req.id})</span>
                              </div>
                              <p>Item: <span className="font-semibold">{req.outfit_title}</span></p>
                              <p>Security Deposit: <span className="font-semibold text-[var(--rose)]">₹{req.deposit_amount}</span></p>
                              <p className="italic text-[10px] text-[var(--ink-light)] mt-1">Reason: {req.reason} - {req.description}</p>
                            </div>

                            <div className="flex-shrink-0 flex items-center gap-2">
                              {req.status === 'open' ? (
                                <>
                                  <button
                                    onClick={() => handleRefundAction(req.id, 'rejected')}
                                    className="btn-outline !h-8 !px-3 text-[10px] uppercase font-mono"
                                  >
                                    Dismiss Dispute
                                  </button>
                                  <button
                                    onClick={() => handleRefundAction(req.id, 'approved')}
                                    className="btn-gold !h-8 !px-3 text-[10px] uppercase font-mono cursor-pointer"
                                  >
                                    Refund Deposit
                                  </button>
                                </>
                              ) : (
                                <span className={`badge uppercase text-[9px] font-bold ${req.status === 'resolved' ? 'badge-sage' : 'badge-rose'}`}>
                                  {req.status}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* TAB 6: Audit Logs */}
                {adminTab === 'logs' && (
                  <motion.div
                    key="logs-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="bg-white rounded-3xl p-6 border border-[var(--petal)] shadow-sm space-y-6"
                  >
                    <div className="flex justify-between items-center pb-3 border-b">
                      <h3 className="font-display text-lg font-semibold text-[var(--ink)]">
                        Platform Security Audit Trails
                      </h3>
                      <button className="btn-ghost text-[10px] font-mono flex items-center gap-1.5 cursor-pointer">
                        <FileSpreadsheet size={13} />
                        Export Audit CSV
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs font-mono">
                        <thead>
                          <tr className="border-b border-[var(--petal)] text-[9px] uppercase tracking-wider text-[var(--ink-lighter)] pb-3">
                            <th className="pb-3 pl-2">Log ID</th>
                            <th className="pb-3">Timestamp</th>
                            <th className="pb-3">Actor</th>
                            <th className="pb-3">Operation Details</th>
                            <th className="pb-3 text-right pr-2">IP Address</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50 text-[var(--ink-light)]">
                          {auditLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-zinc-50/50">
                              <td className="py-2.5 pl-2 text-[var(--rose-dark)]">{String(log.id).substring(0, 8)}</td>
                              <td className="py-2.5">{isNaN(Date.parse(log.timestamp)) ? log.timestamp : new Date(log.timestamp).toLocaleString()}</td>
                              <td className="py-2.5 font-bold">{log.actor}</td>
                              <td className="py-2.5 font-sans">{log.action}</td>
                              <td className="py-2.5 text-right pr-2">{log.ipAddress}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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
