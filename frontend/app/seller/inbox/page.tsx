'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Search,
  Filter,
  Edit,
  Send,
  Paperclip,
  Calendar,
  MoreVertical,
  User,
  Check,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import FloatIn from '@/components/motion/FloatIn';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender: 'renter' | 'seller' | 'system';
  text: string;
  time: string;
  isSystemIcon?: boolean;
}

interface Thread {
  id: string;
  senderName: string;
  senderRole: string;
  pastRentals: number;
  avatarUrl: string;
  subject: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  itemTitle?: string;
  itemPrice?: string;
  itemImage?: string;
  messages: Message[];
}

const initialThreads: Thread[] = [
  {
    id: 'thread-1',
    senderName: 'Eleanor Vance',
    senderRole: 'Renter',
    pastRentals: 5,
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCL-5xXWsx_z6c2eBonHBw8nLtu52wbZO4R-YWTQ-QytpHuKgKdPyW2uaEgNGe04JWxv7uZ5Zr5Osmma2lA5nm9ibQdv9T1e8-mP129RW4irhAVVKHVGHIfGmYk-dzFa3E6RisxWWWnK8MjIsrJzq2x5qLS83Nm66YqMs6IQQNuR54t1zVxghOI_VMCvUXF_JJQk2RaoYEKZ-rMDGGCxLro0azZgktB2QMc3uwVZPp5eCKeRI6FjG25dm59k6a12V8ePbKCzto6XaRP',
    subject: 'Regarding the Vintage Chanel Blazer',
    lastMessage: 'Is this piece available for next weekend?',
    time: '10:42 AM',
    unread: true,
    itemTitle: 'Vintage Chanel Tweed Blazer',
    itemPrice: '$150 / day',
    itemImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDmeUAvsOjpLNOE3U3wG512khb05tSauC_2Z87XNKXuy6qbToxLElspRDqRovaocrPLJdyoe9XV-ISLICnLvpzi8ZdcF-wNewHCBIdXp6atk4Uy5bD9osvUiXzyPJ_L2RVQ8utK48JwqoyEZKBjE9rm40uWi2K987Rzv4ywQZXEBXDDdFrRzb0d4QWUHe0VSu70gLf27MCUNMUhd5AbsqK9_6oLP2U2BJ4wVdIjdrMSGCcV6YnXa3T4WvGC8T80ZN8Ffnoyeu2TpfFz',
    messages: [
      {
        id: 'msg-1',
        sender: 'renter',
        text: "Hi! I absolutely love this piece. I'm attending a gallery opening next Saturday. Is this blazer available for the weekend of the 24th? Also, does it run true to size, or a bit small across the shoulders?",
        time: '10:42 AM',
      },
      {
        id: 'msg-2',
        sender: 'system',
        text: 'Item is currently marked as available for Oct 24 - Oct 26.',
        time: '10:43 AM',
        isSystemIcon: true,
      },
    ],
  },
  {
    id: 'thread-2',
    senderName: 'KLOSET Concierge',
    senderRole: 'System Partner',
    pastRentals: 0,
    avatarUrl: '',
    subject: 'Authentication Verified',
    lastMessage: 'Your recent listing has been approved and is now live.',
    time: 'Yesterday',
    unread: false,
    itemTitle: 'Royal Maroon Bridal Lehenga',
    itemPrice: '$350 / day',
    itemImage:
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=300&h=400&fit=crop',
    messages: [
      {
        id: 'msg-3',
        sender: 'renter',
        text: 'Hello, your outfit Royal Maroon Bridal Lehenga has been verified by our design compliance desk. The thread details and quality checks are in line with Kloset Platinum standards. Your listing is now visible to renters.',
        time: 'Yesterday, 3:00 PM',
      },
    ],
  },
  {
    id: 'thread-3',
    senderName: 'Julian S.',
    senderRole: 'Renter',
    pastRentals: 2,
    avatarUrl: '',
    subject: 'Rental Return Confirmation',
    lastMessage: 'Thanks! The dress was perfect for the gala.',
    time: 'Oct 12',
    unread: false,
    itemTitle: 'Golden Silk Zardozi Saree',
    itemPrice: '$180 / day',
    itemImage:
      'https://images.unsplash.com/photo-1610030469983-398883ce42d1?w=300&h=400&fit=crop',
    messages: [
      {
        id: 'msg-4',
        sender: 'seller',
        text: 'Hi Julian! Glad the outfit was delivered on time. Let me know how it fits.',
        time: 'Oct 11, 4:21 PM',
      },
      {
        id: 'msg-5',
        sender: 'renter',
        text: 'Thanks! The dress was perfect for the gala. Standard courier return pickup has been arranged for tomorrow morning.',
        time: 'Oct 12, 9:15 AM',
      },
    ],
  },
  {
    id: 'thread-4',
    senderName: 'Chloe M.',
    senderRole: 'Renter',
    pastRentals: 1,
    avatarUrl: '',
    subject: 'Sizing Inquiry',
    lastMessage: 'Does the silk slip run true to size or a bit small?',
    time: 'Oct 10',
    unread: false,
    messages: [
      {
        id: 'msg-6',
        sender: 'renter',
        text: 'Does the silk slip run true to size or a bit small? I am in between US 4 and 6.',
        time: 'Oct 10, 11:10 AM',
      },
    ],
  },
];

export default function SellerInboxPage() {
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [activeThreadId, setActiveThreadId] = useState<string>('thread-1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [replyText, setReplyText] = useState<string>('');
  const [showOnlyUnread, setShowOnlyUnread] = useState<boolean>(false);
  const [isMobileThreadView, setIsMobileThreadView] = useState<boolean>(false);

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  const handleSendReply = () => {
    if (!replyText.trim()) return;

    const newMessage: Message = {
      id: `new-msg-${Date.now()}`,
      sender: 'seller',
      text: replyText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setThreads((prevThreads) =>
      prevThreads.map((t) => {
        if (t.id === activeThread.id) {
          return {
            ...t,
            lastMessage: replyText,
            time: 'Just Now',
            messages: [...t.messages, newMessage],
          };
        }
        return t;
      })
    );

    setReplyText('');
    toast.success('Message sent');
  };

  const handleApproveRental = () => {
    toast.success('Rental approved! Pending booking payment notification sent.');
    const systemMsg: Message = {
      id: `sys-msg-${Date.now()}`,
      sender: 'system',
      text: 'You approved the rental request. Renter has been notified to complete payment.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSystemIcon: false,
    };
    setThreads((prevThreads) =>
      prevThreads.map((t) => {
        if (t.id === activeThread.id) {
          return {
            ...t,
            messages: [...t.messages, systemMsg],
          };
        }
        return t;
      })
    );
  };

  const markAsRead = (id: string) => {
    setThreads((prevThreads) =>
      prevThreads.map((t) => (t.id === id ? { ...t, unread: false } : t))
    );
  };

  useEffect(() => {
    if (activeThread && activeThread.unread) {
      markAsRead(activeThread.id);
    }
  }, [activeThreadId]);

  const filteredThreads = threads.filter((t) => {
    const matchesSearch =
      t.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUnread = showOnlyUnread ? t.unread : true;
    return matchesSearch && matchesUnread;
  });

  return (
    <div
      className="min-h-[calc(100vh-var(--nav-height))] flex flex-col"
      style={{ background: 'var(--kloset-bg)' }}
    >
      <div className="w-full max-w-[1400px] mx-auto px-6 py-8 flex-grow flex flex-col">
        {/* Editorial Title Header */}
        <div className="mb-8 flex justify-between items-center border-b border-[var(--kloset-border)] pb-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-[var(--kloset-dark)]">
              Seller Communications
            </h1>
            <p className="text-xs text-[var(--kloset-text-muted)] mt-1 uppercase tracking-wider font-mono">
              Direct inbox for customer outfit rentals and queries
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-xs font-mono py-1 px-3 bg-[var(--kloset-gold-light)] text-[var(--kloset-gold)] rounded-full uppercase tracking-wider">
              {threads.filter((t) => t.unread).length} Unread Conversations
            </span>
          </div>
        </div>

        <div className="flex-grow flex flex-col lg:flex-row bg-white border border-[var(--kloset-border)] rounded-2xl overflow-hidden shadow-sm h-[680px]">
          {/* Left Column: Thread List */}
          <div
            className={`w-full lg:w-[350px] border-r border-[var(--kloset-border)] flex flex-col h-full bg-[var(--kloset-bg)] ${
              isMobileThreadView ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* Search and Filters */}
            <div className="p-4 border-b border-[var(--kloset-border)] bg-white flex flex-col gap-3">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--kloset-text-muted)]"
                />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-[var(--kloset-bg)] border border-[var(--kloset-border)] rounded-full focus:outline-none focus:border-[var(--kloset-dark)] transition-colors"
                />
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => setShowOnlyUnread(!showOnlyUnread)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-colors ${
                    showOnlyUnread
                      ? 'bg-[var(--kloset-dark)] text-white'
                      : 'border border-[var(--kloset-border)] text-[var(--kloset-text-muted)] hover:text-[var(--kloset-dark)]'
                  }`}
                >
                  <Filter size={12} />
                  {showOnlyUnread ? 'Showing Unread' : 'Filter Unread'}
                </button>

                <button
                  onClick={() => toast.info('New message composer is currently disabled.')}
                  className="p-1.5 rounded-full hover:bg-[var(--kloset-bg)] border border-[var(--kloset-border)] text-[var(--kloset-dark)] transition-colors"
                  aria-label="New Thread"
                >
                  <Edit size={14} />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-grow overflow-y-auto divide-y divide-[var(--kloset-border)]">
              {filteredThreads.length === 0 ? (
                <div className="p-8 text-center text-xs text-[var(--kloset-text-muted)] uppercase tracking-wider font-mono">
                  No conversations found
                </div>
              ) : (
                filteredThreads.map((thread) => {
                  const isActive = thread.id === activeThreadId;
                  return (
                    <div
                      key={thread.id}
                      onClick={() => {
                        setActiveThreadId(thread.id);
                        setIsMobileThreadView(true);
                      }}
                      className={`p-4 cursor-pointer transition-colors relative flex items-start gap-3 ${
                        isActive
                          ? 'bg-white'
                          : 'hover:bg-white/50'
                      }`}
                    >
                      {/* Active Indicator Bar */}
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--kloset-dark)]" />
                      )}

                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-[var(--kloset-gold-light)] flex-shrink-0 flex items-center justify-center overflow-hidden border border-[var(--kloset-border)]">
                        {thread.avatarUrl ? (
                          <img
                            src={thread.avatarUrl}
                            alt={thread.senderName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={16} className="text-[var(--kloset-gold)]" />
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <span className="font-semibold text-sm text-[var(--kloset-dark)] truncate">
                            {thread.senderName}
                          </span>
                          <span className="text-[10px] text-[var(--kloset-text-muted)] flex-shrink-0 font-mono">
                            {thread.time}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-[var(--kloset-dark)] truncate mb-0.5">
                          {thread.subject}
                        </p>
                        <p className="text-xs text-[var(--kloset-text-muted)] truncate">
                          {thread.lastMessage}
                        </p>
                      </div>

                      {/* Unread dot */}
                      {thread.unread && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[var(--kloset-gold)] flex-shrink-0 self-center" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Chat View */}
          <div
            className={`flex-grow flex flex-col h-full bg-white ${
              !isMobileThreadView ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* Thread Header */}
            <div className="p-4 border-b border-[var(--kloset-border)] flex justify-between items-center bg-[var(--kloset-bg)]">
              <div className="flex items-center gap-3">
                {/* Back button on mobile */}
                <button
                  onClick={() => setIsMobileThreadView(false)}
                  className="lg:hidden p-1.5 text-[var(--kloset-dark)] hover:bg-white border border-[var(--kloset-border)] rounded-full transition-colors"
                >
                  <ArrowLeft size={16} />
                </button>

                <div className="w-11 h-11 rounded-full bg-[var(--kloset-gold-light)] flex-shrink-0 flex items-center justify-center overflow-hidden border border-[var(--kloset-border)]">
                  {activeThread.avatarUrl ? (
                    <img
                      src={activeThread.avatarUrl}
                      alt={activeThread.senderName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={18} className="text-[var(--kloset-gold)]" />
                  )}
                </div>

                <div>
                  <h2 className="text-base font-display font-semibold text-[var(--kloset-dark)]">
                    {activeThread.senderName}
                  </h2>
                  <p className="text-[10px] font-mono text-[var(--kloset-text-muted)] uppercase tracking-wider">
                    {activeThread.senderRole} • {activeThread.pastRentals} Past Rentals
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    toast.info(`Fulfilling profile check for user: ${activeThread.senderName}`)
                  }
                  className="btn-outline !h-8 !px-3 !py-1 text-[10px] uppercase font-mono tracking-wider cursor-pointer"
                >
                  View Profile
                </button>
                <button className="p-1.5 rounded-full hover:bg-white text-[var(--kloset-text-muted)] hover:text-[var(--kloset-dark)] transition-colors">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>

            {/* Context Item Panel */}
            {activeThread.itemTitle && (
              <div className="px-4 py-3 bg-[var(--kloset-gold-light)]/30 border-b border-[var(--kloset-border)] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-12 rounded bg-[var(--kloset-bg)] border border-[var(--kloset-border)] overflow-hidden flex-shrink-0 relative">
                    <img
                      src={activeThread.itemImage}
                      alt={activeThread.itemTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider font-mono text-[var(--kloset-gold)] block">
                      Outfit Under Discussion
                    </span>
                    <span className="text-xs font-semibold text-[var(--kloset-dark)]">
                      {activeThread.itemTitle}
                    </span>
                    <span className="text-xs text-[var(--kloset-text-muted)] ml-2">
                      ({activeThread.itemPrice})
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleApproveRental}
                  className="btn-gold !h-8 !px-4 !py-1 text-[10px] uppercase font-mono tracking-wider flex items-center gap-1 cursor-pointer"
                >
                  <Check size={12} />
                  Approve Rental
                </button>
              </div>
            )}

            {/* Message Thread Scroll Area */}
            <div className="flex-grow p-6 overflow-y-auto flex flex-col gap-6 bg-white">
              <div className="flex items-center justify-center my-2">
                <span className="bg-[var(--kloset-bg)] px-3 py-1 rounded-full text-[10px] text-[var(--kloset-text-muted)] uppercase tracking-wider font-mono border border-[var(--kloset-border)]">
                  Today's Correspondence
                </span>
              </div>

              {activeThread.messages.map((message) => {
                if (message.sender === 'system') {
                  return (
                    <div
                      key={message.id}
                      className="flex justify-center my-2 text-[10px] text-[var(--kloset-text-muted)] font-mono uppercase tracking-wider items-center gap-1.5"
                    >
                      {message.isSystemIcon && <Calendar size={12} className="text-[var(--kloset-gold)]" />}
                      <span>{message.text}</span>
                    </div>
                  );
                }

                const isMe = message.sender === 'seller';
                return (
                  <div
                    key={message.id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] p-4 rounded-2xl relative shadow-sm ${
                        isMe
                          ? 'bg-[var(--kloset-dark)] text-white rounded-tr-sm'
                          : 'bg-[var(--kloset-bg)] text-[var(--kloset-dark)] border border-[var(--kloset-border)] rounded-tl-sm'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
                      <span
                        className={`text-[9px] block text-right mt-2 font-mono uppercase tracking-wider ${
                          isMe ? 'text-white/60' : 'text-[var(--kloset-text-muted)]'
                        }`}
                      >
                        {message.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Form Composer */}
            <div className="p-4 border-t border-[var(--kloset-border)] bg-[var(--kloset-bg)]">
              <div className="flex items-end gap-2 bg-white border border-[var(--kloset-border)] rounded-xl p-2 focus-within:border-[var(--kloset-dark)] transition-colors shadow-sm">
                <button
                  onClick={() => toast.info('Media attachment selection is active.')}
                  className="p-2 text-[var(--kloset-text-muted)] hover:text-[var(--kloset-dark)] transition-colors flex-shrink-0"
                  aria-label="Attach File"
                >
                  <Paperclip size={16} />
                </button>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Write a message to ${activeThread.senderName}...`}
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendReply();
                    }
                  }}
                  className="w-full bg-transparent border-none focus:ring-0 resize-none text-sm text-[var(--kloset-dark)] max-h-24 min-h-[36px] py-1 px-2 focus:outline-none"
                />
                <button
                  onClick={handleSendReply}
                  disabled={!replyText.trim()}
                  className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                    replyText.trim()
                      ? 'bg-[var(--kloset-dark)] text-white hover:bg-[var(--kloset-dark)]/90'
                      : 'text-[var(--kloset-text-muted)] cursor-not-allowed'
                  }`}
                  aria-label="Send"
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="text-[9px] text-[var(--kloset-text-muted)] font-mono uppercase tracking-wider text-center mt-2 flex items-center justify-center gap-1">
                <Sparkles size={10} className="text-[var(--kloset-gold)]" />
                Keep correspondence within Kloset security protocols for protection coverage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
