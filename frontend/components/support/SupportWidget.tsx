'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, AlertTriangle, ShieldCheck, CornerDownLeft, Sparkles, SendHorizontal } from 'lucide-react';
import { useSupportStore } from '@/stores/support.store';
import { useAuthStore } from '@/stores/auth.store';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export default function SupportWidget() {
  const { addTicket, fetchTickets } = useSupportStore();
  const { isAuthenticated } = useAuthStore();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTickets(false); // Fetch active renter's tickets on mount
    }
  }, [fetchTickets, isAuthenticated]);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Namaste! Welcome to Kloset. I am your Mughal Garden Style & Care AI Assistant. How can I help you today?',
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  
  // Ticket Mode State
  const [isTicketMode, setIsTicketMode] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketPriority, setTicketPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('low');
  const [renterName, setRenterName] = useState('');
  const [renterEmail, setRenterEmail] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTicketMode]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    // Add user message
    const userMsg: Message = {
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // Simulate Bot Response
    setTimeout(() => {
      let replyText = "I'm sorry, I didn't quite catch that. Would you like to raise a support ticket to be reviewed by a human agent?";
      const lower = text.toLowerCase();

      if (lower.includes('cancel') || lower.includes('cancellation')) {
        replyText = '🌸 **Cancellation Policy**: You can cancel free of charge up to 7 days before your rental pick-up date! Within 7 days, a 50% cancellation fee is charged. Direct cancellations can be requested from your renter dashboard.';
      } else if (lower.includes('return') || lower.includes('policy') || lower.includes('pick')) {
        replyText = '📦 **Returns & Shipping**: We handle all return pickups! Please repack the dry-cleaned-safe outfit in the original Kloset zippered cover. Our courier rider will pick it up the morning after your rental ends.';
      } else if (lower.includes('refund') || lower.includes('deposit') || lower.includes('money')) {
        replyText = '💰 **Refund Timeline**: The refundable security deposit is released automatically within 72 hours of the dress returning safely to our quality review hubs. Standard bank transfers usually credit in 2-5 business days.';
      } else if (lower.includes('damage') || lower.includes('stain') || lower.includes('tear')) {
        replyText = '🛡️ **Damage Cover**: Normal wear, minor food stains, and loose stitching are fully covered! In cases of significant damage, burns, or losses, part or all of the security deposit may be withheld.';
      } else if (lower.includes('size') || lower.includes('fit') || lower.includes('tight')) {
        replyText = '👗 **Fittings & Exchange**: If the outfit does not fit, contact us immediately. We can dispatch a replacement size if stock permits, or issue a 100% rental credit. You can also visit our Mughal Garden Hubs for boutique alterations.';
      }

      const botMsg: Message = {
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1000);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketDescription || !renterName || !renterEmail) return;

    addTicket({
      renterName,
      renterEmail,
      subject: ticketSubject,
      description: ticketDescription,
      priority: ticketPriority,
      chatHistory: messages.map((m) => ({
        sender: m.sender === 'user' ? 'user' : 'bot',
        text: m.text,
        timestamp: m.timestamp,
      })),
    });

    setTicketSuccess(true);
    setTimeout(() => {
      // Return to chat with confirmation
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `🎟️ **Support Ticket Created Successfully!**\nYour reference ID has been logged in the admin studio queue. Our support specialists will respond to your registered email (${renterEmail}) shortly.`,
          timestamp: 'Just now',
        },
      ]);
      setIsTicketMode(false);
      setTicketSuccess(false);
      setTicketSubject('');
      setTicketDescription('');
      setRenterName('');
      setRenterEmail('');
    }, 2000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] print:hidden">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20 }}
            className="w-80 sm:w-96 h-[500px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[var(--petal)]"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-[var(--rose)] to-[var(--gold)] text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-sm leading-tight">Style & Care Assistant</h3>
                  <span className="text-[9px] font-mono tracking-wider opacity-85 block">Kloset Concierge</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Pane */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--ivory)]/40 silk-scroll">
              {isTicketMode ? (
                /* Support Ticket Form */
                <form onSubmit={handleTicketSubmit} className="space-y-3.5 text-xs text-[var(--ink)]">
                  <div className="bg-[var(--bloom)]/30 border border-[var(--rose)]/30 p-3 rounded-xl flex gap-2">
                    <AlertTriangle size={16} className="text-[var(--rose)] flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] leading-relaxed text-[var(--ink-light)]">
                      AI assistant unresolved? Submit a direct ticket to our Support Desk.
                    </p>
                  </div>

                  {ticketSuccess ? (
                    <div className="py-8 text-center space-y-2">
                      <div className="w-12 h-12 bg-[var(--sage)]/10 rounded-full flex items-center justify-center mx-auto text-[var(--sage-dark)]">
                        ✓
                      </div>
                      <p className="font-semibold text-sm">Ticket Sent to Support Desk!</p>
                      <p className="text-[10px] text-[var(--ink-light)]">Routing to queues...</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] font-mono uppercase tracking-wider block mb-1">Your Name</label>
                          <input
                            type="text"
                            required
                            value={renterName}
                            onChange={(e) => setRenterName(e.target.value)}
                            className="input-kloset !py-2 !px-2.5 text-xs !rounded-xl"
                            placeholder="Dia Mirza"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-mono uppercase tracking-wider block mb-1">Your Email</label>
                          <input
                            type="email"
                            required
                            value={renterEmail}
                            onChange={(e) => setRenterEmail(e.target.value)}
                            className="input-kloset !py-2 !px-2.5 text-xs !rounded-xl"
                            placeholder="dia@gmail.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[9px] font-mono uppercase tracking-wider block mb-1">Subject</label>
                        <input
                          type="text"
                          required
                          value={ticketSubject}
                          onChange={(e) => setTicketSubject(e.target.value)}
                          className="input-kloset !py-2 !px-2.5 text-xs !rounded-xl"
                          placeholder="Delayed Return pickup / Refund status"
                        />
                      </div>

                      <div>
                        <label className="text-[9px] font-mono uppercase tracking-wider block mb-1">Description</label>
                        <textarea
                          required
                          value={ticketDescription}
                          onChange={(e) => setTicketDescription(e.target.value)}
                          rows={3}
                          className="input-kloset !py-2 !px-2.5 text-xs !rounded-xl resize-none"
                          placeholder="Provide order details or specific issues..."
                        />
                      </div>

                      <div>
                        <label className="text-[9px] font-mono uppercase tracking-wider block mb-1">Priority Level</label>
                        <div className="grid grid-cols-4 gap-1 font-mono text-[9px] text-center">
                          {['low', 'medium', 'high', 'critical'].map((p) => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setTicketPriority(p as any)}
                              className={`py-1.5 rounded-lg border uppercase transition-all ${
                                ticketPriority === p
                                  ? 'bg-[var(--rose)] border-[var(--rose)] text-white font-bold'
                                  : 'bg-white border-[var(--petal)] text-[var(--ink-light)]'
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsTicketMode(false)}
                          className="btn-outline flex-1 !h-10 !px-4 text-xs !rounded-xl"
                        >
                          Back to Chat
                        </button>
                        <button
                          type="submit"
                          className="btn-gold flex-1 !h-10 !px-4 text-xs !rounded-xl uppercase tracking-wider"
                        >
                          Submit Ticket
                        </button>
                      </div>
                    </>
                  )}
                </form>
              ) : (
                /* Chat Messages and Quick Prompts */
                <>
                  <div className="space-y-3.5">
                    {messages.map((m, idx) => (
                      <div
                        key={idx}
                        className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                            m.sender === 'user'
                              ? 'bg-[var(--rose)] text-white rounded-br-none shadow-sm'
                              : 'bg-white text-[var(--ink)] border border-[var(--petal)]/50 rounded-bl-none shadow-sm'
                          }`}
                        >
                          {/* Parse markdown-like bullets */}
                          <p className="whitespace-pre-line">{m.text}</p>
                          <span
                            className={`text-[8px] mt-1 block text-right ${
                              m.sender === 'user' ? 'text-white/60' : 'text-[var(--ink-lighter)]'
                            }`}
                          >
                            {m.timestamp}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Quick Answers Accordion / Prompts */}
                  <div className="pt-4 border-t border-[var(--petal)]/30 space-y-2">
                    <p className="text-[9px] uppercase tracking-wider font-mono text-[var(--ink-lighter)]">
                      Instant Styling & Care Topics
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'Free Cancellation policy?',
                        'Return pickup details?',
                        'When is refund issued?',
                        'Fit mismatch exchange?',
                        'Damage cover?',
                      ].map((topic) => (
                        <button
                          key={topic}
                          onClick={() => handleSendMessage(topic)}
                          className="text-[10px] bg-white border border-[var(--petal)] hover:border-[var(--rose)] hover:text-[var(--rose)] text-[var(--ink-light)] py-1.5 px-3 rounded-full transition-all text-left shadow-sm"
                        >
                          {topic}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setIsTicketMode(true)}
                        className="text-[10px] bg-[var(--bloom)] border border-[var(--rose)]/30 text-[var(--rose)] font-semibold py-1.5 px-3 rounded-full transition-all text-left shadow-sm flex items-center gap-1 cursor-pointer"
                      >
                        ⚠️ Raise Support Ticket
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Input Footer */}
            {!isTicketMode && (
              <div className="p-3 bg-white border-t border-[var(--petal)]/40 flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Type a styling query..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  className="flex-1 bg-[var(--ivory)] border border-[var(--petal)]/60 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[var(--rose)]"
                />
                <button
                  onClick={() => handleSendMessage()}
                  className="w-8 h-8 rounded-xl bg-[var(--rose)] hover:bg-[var(--rose-dark)] transition-colors flex items-center justify-center text-white flex-shrink-0 cursor-pointer"
                >
                  <SendHorizontal size={14} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--gold)] text-white shadow-xl flex items-center justify-center border border-white/20 cursor-pointer relative"
      >
        <MessageSquare size={22} />
        {/* Pulsing indicator */}
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[var(--sage)] rounded-full border border-white animate-pulse" />
      </motion.button>
    </div>
  );
}
