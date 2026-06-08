'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/stores/auth.store';
import { useSupportStore } from '@/stores/support.store';
import { bookingsAPI } from '@/lib/api/bookings';
import FloatIn from '@/components/motion/FloatIn';
import PetalBackground from '@/components/floral/PetalBackground';
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  AlertTriangle,
  Clock,
  Sparkles,
  ShieldCheck,
  SendHorizontal,
  ChevronDown,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const { user, isAuthenticated } = useAuthStore();
  const { tickets, addTicket } = useSupportStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('low');
  
  const [submitted, setSubmitted] = useState(false);
  const [loadingDisputes, setLoadingDisputes] = useState(false);
  const [disputedBookings, setDisputedBookings] = useState<any[]>([]);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  // Load disputes/refund requests
  useEffect(() => {
    const loadDisputes = async () => {
      if (!isAuthenticated) return;
      try {
        setLoadingDisputes(true);
        const res = await bookingsAPI.listMyBookings();
        // filter for bookings that are cancelled or disputed
        const filtered = res.bookings.filter(
          (b: any) => b.status === 'disputed' || b.status === 'cancelled' || b.status === 'returned'
        );
        setDisputedBookings(filtered);
      } catch (err) {
        console.warn('Failed to load disputes:', err);
      } finally {
        setLoadingDisputes(false);
      }
    };
    loadDisputes();
  }, [isAuthenticated]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !description) return;

    addTicket({
      renterName: name,
      renterEmail: email,
      subject,
      description,
      priority,
      chatHistory: [
        {
          sender: 'user',
          text: description,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    });

    setSubmitted(true);
    setSubject('');
    setDescription('');
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  // Filter tickets for current user if logged in, otherwise show none or matching email
  const userTickets = isAuthenticated && user
    ? tickets.filter((t) => t.renterEmail === user.email)
    : [];

  return (
    <div className="min-h-screen relative pb-24" style={{ background: 'var(--ivory)' }}>
      <PetalBackground />

      {/* Hero Section */}
      <section className="relative pt-16 pb-10 text-center">
        <div className="container mx-auto px-6 relative z-10 space-y-4">
          <FloatIn>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[var(--kloset-gold)] font-bold">
              Kloset Concierge
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mt-2" style={{ color: 'var(--ink)' }}>
              Contact Our Support Hub
            </h1>
            <p className="text-sm text-[var(--ink-light)] max-w-lg mx-auto mt-2">
              Whether you want to manage an active rental, list an outfit, check your refund status, or ask about size alterations, we are here 24/7.
            </p>
          </FloatIn>
        </div>
      </section>

      {/* Contact Channels Grid */}
      <section className="py-6">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: Mail,
                title: 'Email Correspondence',
                val: 'support@kloset.in',
                desc: 'Care assistance & logistics inquiries. Expected reply time: under 2 hours.',
                link: 'mailto:support@kloset.in',
              },
              {
                icon: Phone,
                title: 'Boutique Care Hotline',
                val: '+91 22 8876 5432',
                desc: 'Alteration assistance & delivery coordination. 9:00 AM – 9:00 PM.',
                link: 'tel:+912288765432',
              },
              {
                icon: MapPin,
                title: 'Mumbai Atelier & Partner Hub',
                val: 'Colaba Causeway, Mumbai',
                desc: 'Drop in for alterations, size measurements, or listing handovers.',
                link: '#',
              },
            ].map((chan, idx) => (
              <FloatIn key={idx} delay={idx * 0.1}>
                <a
                  href={chan.link}
                  className="block rounded-2xl p-6 bg-white border border-[var(--petal)] shadow-sm hover:shadow-md transition-all h-full"
                >
                  <div className="w-10 h-10 rounded-xl bg-[var(--kloset-gold-light)] text-[var(--kloset-gold)] flex items-center justify-center mb-4">
                    <chan.icon size={18} />
                  </div>
                  <h3 className="font-display text-base font-bold text-gray-900 mb-1">{chan.title}</h3>
                  <p className="font-mono text-xs text-[var(--kloset-gold)] font-bold mb-2">{chan.val}</p>
                  <p className="text-xs text-gray-400 leading-normal">{chan.desc}</p>
                </a>
              </FloatIn>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Create Support Ticket */}
            <div className="lg:col-span-7 space-y-6">
              <FloatIn delay={0.3}>
                <div className="bg-white rounded-[24px] border border-[var(--petal)] p-6 md:p-8 shadow-sm">
                  <h2 className="font-display text-xl font-bold mb-2">Raise a Support Ticket</h2>
                  <p className="text-xs text-[var(--ink-light)] mb-6">
                    Fill out the form below. Once created, your ticket will appear in our active support queue.
                  </p>

                  <AnimatePresence>
                    {submitted && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs mb-6 flex items-start gap-2.5"
                      >
                        <CheckCircle size={16} className="flex-shrink-0 mt-0.5 text-emerald-600" />
                        <div>
                          <p className="font-bold">Ticket Submitted Successfully!</p>
                          <p className="mt-1">We have routed this to our Mughal Garden Support Desk. An agent will respond shortly.</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 text-gray-500">Your Name</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="input-kloset text-xs"
                          placeholder="E.g., Aishwarya Rai"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 text-gray-500">Your Email</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="input-kloset text-xs"
                          placeholder="E.g., aishwarya@gmail.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 text-gray-500">Subject</label>
                      <input
                        type="text"
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="input-kloset text-xs"
                        placeholder="E.g., Rental fitting issue / Refund delay"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 text-gray-500">Priority Level</label>
                      <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
                        {['low', 'medium', 'high', 'critical'].map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setPriority(p as any)}
                            className={`py-2 rounded-lg border uppercase transition-all cursor-pointer ${
                              priority === p
                                ? 'bg-[var(--kloset-dark)] border-[var(--kloset-dark)] text-white font-bold'
                                : 'bg-white border-[var(--petal)] text-[var(--ink-light)] hover:border-gray-400'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-wider block mb-1 text-gray-500">Description</label>
                      <textarea
                        required
                        rows={5}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Please describe your issue in detail. If this is about an order, include the Booking Reference ID..."
                        className="input-kloset text-xs min-h-[100px] py-3"
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn-gold w-full text-xs font-mono uppercase tracking-wider py-4 flex items-center justify-center gap-2"
                    >
                      <span>Submit Ticket</span>
                      <SendHorizontal size={14} />
                    </button>
                  </form>
                </div>
              </FloatIn>
            </div>

            {/* Right Column: User Tickets & Active Disputes */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Active Support Tickets */}
              <FloatIn delay={0.4}>
                <div className="bg-white rounded-[24px] border border-[var(--petal)] p-6 shadow-sm">
                  <h2 className="font-display text-lg font-bold mb-1">Your Support Tickets</h2>
                  <p className="text-[11px] text-[var(--ink-light)] mb-4">
                    Active requests filed under your current email address.
                  </p>

                  {!isAuthenticated ? (
                    <div className="text-center py-6 border border-dashed border-[var(--petal)] rounded-xl bg-gray-50">
                      <p className="text-xs text-[var(--ink-light)]">Sign in to view your tickets</p>
                      <Link href="/login" className="text-xs text-[var(--kloset-gold)] font-bold font-mono uppercase tracking-wider hover:underline mt-2 inline-block">
                        Sign In Now
                      </Link>
                    </div>
                  ) : userTickets.length === 0 ? (
                    <div className="text-center py-6 border border-dashed border-[var(--petal)] rounded-xl bg-gray-50">
                      <p className="text-xs text-[var(--ink-light)]">No tickets raised yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                      {userTickets.map((ticket) => (
                        <div
                          key={ticket.id}
                          className="p-4 border border-[var(--petal)] rounded-xl space-y-2 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-[var(--kloset-gold)] font-bold">{ticket.id}</span>
                            <span
                              className={`text-[9px] uppercase tracking-wider font-mono font-bold px-2 py-0.5 rounded-full ${
                                ticket.status === 'open'
                                  ? 'bg-blue-100 text-blue-800'
                                  : ticket.status === 'resolved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {ticket.status}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{ticket.subject}</h4>
                          <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">{ticket.description}</p>
                          <span className="text-[9px] text-gray-400 font-mono block pt-1 border-t border-gray-100">
                            Created: {ticket.createdAt}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </FloatIn>

              {/* Active Refund/Cancellation/Disputes */}
              <FloatIn delay={0.5}>
                <div className="bg-white rounded-[24px] border border-[var(--petal)] p-6 shadow-sm">
                  <h2 className="font-display text-lg font-bold mb-1">Refunds & Disputes Status</h2>
                  <p className="text-[11px] text-[var(--ink-light)] mb-4">
                    Monitor deposits, cancellations, and active return disputes.
                  </p>

                  {!isAuthenticated ? (
                    <div className="text-center py-6 border border-dashed border-[var(--petal)] rounded-xl bg-gray-50">
                      <p className="text-xs text-[var(--ink-light)]">Sign in to view refund status</p>
                      <Link href="/login" className="text-xs text-[var(--kloset-gold)] font-bold font-mono uppercase tracking-wider hover:underline mt-2 inline-block">
                        Sign In Now
                      </Link>
                    </div>
                  ) : loadingDisputes ? (
                    <div className="py-6 space-y-2">
                      <div className="shimmer h-8 w-full rounded-lg" />
                      <div className="shimmer h-8 w-full rounded-lg" />
                    </div>
                  ) : disputedBookings.length === 0 ? (
                    <div className="text-center py-6 border border-dashed border-[var(--petal)] rounded-xl bg-gray-50">
                      <p className="text-xs text-[var(--ink-light)]">No active disputes or refund claims found.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {disputedBookings.map((b) => (
                        <div
                          key={b.id}
                          className="p-3.5 border border-[var(--petal)] rounded-xl flex items-center justify-between gap-4 bg-gray-50"
                        >
                          <div>
                            <span className="text-[9px] font-mono text-gray-400">Ref: {b.booking_ref}</span>
                            <h4 className="text-xs font-bold text-gray-900 mt-0.5 line-clamp-1">{b.outfit?.title}</h4>
                            <span className="text-[10px] font-mono text-[var(--kloset-gold)] block mt-0.5">
                              Deposit: ₹{b.outfit?.price_1day ? (b.outfit.price_1day * 2).toLocaleString() : '5,000'}
                            </span>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span
                              className={`text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded-sm block text-center ${
                                b.status === 'disputed'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : b.status === 'cancelled'
                                  ? 'bg-gray-100 text-gray-700'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {b.status}
                            </span>
                            <span className="text-[8px] text-gray-400 block mt-1 font-mono">
                              {b.status === 'disputed' ? 'Under Review' : b.status === 'cancelled' ? 'Deposit Refunded' : 'Quality Checked'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </FloatIn>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
