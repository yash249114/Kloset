'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import FloatIn from '@/components/motion/FloatIn';
import PetalBackground from '@/components/floral/PetalBackground';
import EmptyState from '@/components/ui/EmptyState';
import {
  Plus,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ArrowUpDown,
  Star,
  MapPin,
} from 'lucide-react';
import type { OutfitStatus } from '@/types';

// Mock outfits data
const mockOutfits = [
  {
    id: 'outfit-1',
    title: 'Royal Maroon Bridal Lehenga',
    category: 'Lehenga',
    city: 'Mumbai',
    price_1day: 3500,
    status: 'active' as OutfitStatus,
    rating_avg: 4.8,
    rating_count: 45,
    view_count: 380,
    booking_count: 12,
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=200&h=250&fit=crop',
    created_at: '2026-04-15',
  },
  {
    id: 'outfit-2',
    title: 'Golden Silk Zardozi Saree',
    category: 'Saree',
    city: 'Delhi',
    price_1day: 3000,
    status: 'active' as OutfitStatus,
    rating_avg: 4.5,
    rating_count: 23,
    view_count: 180,
    booking_count: 7,
    image: 'https://images.unsplash.com/photo-1610030469983-398883ce42d1?w=200&h=250&fit=crop',
    created_at: '2026-05-02',
  },
  {
    id: 'outfit-3',
    title: 'Midnight Blue Anarkali Set',
    category: 'Anarkali',
    city: 'Bangalore',
    price_1day: 1800,
    status: 'rented' as OutfitStatus,
    rating_avg: 4.9,
    rating_count: 67,
    view_count: 420,
    booking_count: 22,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&h=250&fit=crop',
    created_at: '2026-03-20',
  },
  {
    id: 'outfit-4',
    title: 'Blush Pink Sharara',
    category: 'Sharara',
    city: 'Jaipur',
    price_1day: 2200,
    status: 'cleaning' as OutfitStatus,
    rating_avg: 4.3,
    rating_count: 12,
    view_count: 95,
    booking_count: 3,
    image: 'https://images.unsplash.com/photo-1594463750939-ebb28c3f7a75?w=200&h=250&fit=crop',
    created_at: '2026-05-10',
  },
  {
    id: 'outfit-5',
    title: 'Emerald Green Gown',
    category: 'Gown',
    city: 'Hyderabad',
    price_1day: 4000,
    status: 'inactive' as OutfitStatus,
    rating_avg: 4.7,
    rating_count: 34,
    view_count: 310,
    booking_count: 15,
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=200&h=250&fit=crop',
    created_at: '2026-02-28',
  },
];

const statusConfig: Record<OutfitStatus, { label: string; bg: string; color: string; border: string }> = {
  active: { label: 'Active', bg: 'rgba(143,175,143,0.1)', color: 'var(--sage-dark)', border: 'rgba(143,175,143,0.2)' },
  rented: { label: 'Rented', bg: 'rgba(201,169,110,0.1)', color: 'var(--gold)', border: 'rgba(201,169,110,0.2)' },
  cleaning: { label: 'Cleaning', bg: 'rgba(123,165,193,0.1)', color: '#5a8fa8', border: 'rgba(123,165,193,0.2)' },
  inactive: { label: 'Inactive', bg: 'var(--bloom)', color: 'var(--ink-lighter)', border: 'var(--petal)' },
  draft: { label: 'Draft', bg: 'var(--bloom)', color: 'var(--ink-lighter)', border: 'var(--petal)' },
  pending_approval: { label: 'Pending', bg: 'rgba(201,169,110,0.1)', color: 'var(--gold)', border: 'rgba(201,169,110,0.2)' },
  rejected: { label: 'Rejected', bg: 'rgba(193,123,123,0.1)', color: 'var(--rose)', border: 'rgba(193,123,123,0.2)' },
};

type FilterStatus = 'all' | OutfitStatus;

export default function SellerOutfitsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const filteredOutfits = mockOutfits.filter((outfit) => {
    if (searchQuery && !outfit.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (statusFilter !== 'all' && outfit.status !== statusFilter) return false;
    return true;
  });

  const statusFilters: { value: FilterStatus; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'rented', label: 'Rented' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'inactive', label: 'Inactive' },
  ];

  return (
    <div className="min-h-screen relative pb-16" style={{ background: 'var(--ivory)' }}>
      <PetalBackground />

      {/* Header */}
      <section className="relative pt-8 pb-4">
        <div className="container mx-auto px-6">
          <FloatIn>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[var(--gold)] font-bold">
                  Seller Studio
                </span>
                <h1 className="text-3xl md:text-4xl font-display font-bold mt-1" style={{ color: 'var(--ink)' }}>
                  My Outfits
                </h1>
              </div>
              <Link
                href="/outfit/new"
                className="btn-gold !text-xs !py-3.5 !px-6 tracking-[0.15em] self-start sm:self-auto"
              >
                <Plus size={16} />
                List New Outfit
              </Link>
            </div>
          </FloatIn>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--ink-lighter)' }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your outfits..."
                className="input-kloset !pl-11 !py-3"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {statusFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setStatusFilter(filter.value)}
                  className="px-4 py-2.5 rounded-xl text-xs font-mono tracking-wider uppercase font-semibold whitespace-nowrap transition-all duration-300"
                  style={{
                    background: statusFilter === filter.value ? 'var(--rose)' : 'white',
                    color: statusFilter === filter.value ? 'white' : 'var(--ink-light)',
                    border: `1.5px solid ${statusFilter === filter.value ? 'var(--rose)' : 'var(--petal)'}`,
                  }}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm" style={{ color: 'var(--ink-lighter)' }}>
              <strong style={{ color: 'var(--ink)' }}>{filteredOutfits.length}</strong> outfits
            </p>
            <button className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider" style={{ color: 'var(--ink-light)' }}>
              <ArrowUpDown size={12} />
              Sort
            </button>
          </div>
        </div>
      </section>

      {/* Outfits List */}
      <section>
        <div className="container mx-auto px-6">
          {filteredOutfits.length === 0 ? (
            <EmptyState
              emoji="👗"
              title="No outfits found"
              description={searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters or search query.'
                : 'Start building your wardrobe on Kloset. List your first outfit now!'}
              actionLabel={statusFilter !== 'all' || searchQuery ? 'Reset Filters' : 'List Your First Outfit'}
              onAction={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              actionHref={statusFilter === 'all' && !searchQuery ? '/outfit/new' : undefined}
            />
          ) : (
            <div className="space-y-3">
              {filteredOutfits.map((outfit, i) => {
                const status = statusConfig[outfit.status];
                return (
                  <motion.div
                    key={outfit.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                    className="rounded-2xl p-4 bg-white flex flex-col sm:flex-row gap-4 items-center hover:shadow-md transition-all duration-300 relative"
                    style={{ border: '1px solid var(--petal)' }}
                  >
                    {/* Image */}
                    <div className="relative w-20 h-24 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={outfit.image}
                        alt={outfit.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start mb-1">
                        <span className="badge badge-gold !py-0.5 !px-2.5 text-[9px]">
                          {outfit.category}
                        </span>
                        <span
                          className="badge !py-0.5 !px-2.5 text-[9px] uppercase font-bold"
                          style={{
                            background: status.bg,
                            color: status.color,
                            border: `1px solid ${status.border}`,
                          }}
                        >
                          {status.label}
                        </span>
                      </div>
                      <h3 className="font-display text-base font-bold truncate" style={{ color: 'var(--ink)' }}>
                        {outfit.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 justify-center sm:justify-start text-xs" style={{ color: 'var(--ink-lighter)' }}>
                        <span className="flex items-center gap-1">
                          <MapPin size={10} /> {outfit.city}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star size={10} fill="var(--gold)" style={{ color: 'var(--gold)' }} />
                          {outfit.rating_avg} ({outfit.rating_count})
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={10} /> {outfit.view_count}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-4 text-center flex-shrink-0">
                      <div>
                        <p className="text-lg font-display font-bold" style={{ color: 'var(--ink)' }}>
                          {outfit.booking_count}
                        </p>
                        <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'var(--ink-lighter)' }}>
                          Bookings
                        </p>
                      </div>
                      <div>
                        <p className="text-lg font-display font-bold price">
                          ₹{outfit.price_1day.toLocaleString('en-IN')}
                        </p>
                        <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'var(--ink-lighter)' }}>
                          / Day
                        </p>
                      </div>
                    </div>

                    {/* Actions menu */}
                    <div className="relative flex-shrink-0">
                      <button
                        onClick={() => setActiveMenu(activeMenu === outfit.id ? null : outfit.id)}
                        className="p-2 rounded-xl hover:bg-[var(--bloom)] transition-colors"
                      >
                        <MoreVertical size={16} style={{ color: 'var(--ink-light)' }} />
                      </button>

                      <AnimatePresence>
                        {activeMenu === outfit.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -5 }}
                            className="absolute right-0 top-full mt-1 w-44 rounded-xl bg-white shadow-lg overflow-hidden z-20"
                            style={{ border: '1px solid var(--petal)' }}
                          >
                            <Link
                              href={`/outfit/${outfit.id}`}
                              className="flex items-center gap-2 px-4 py-2.5 text-xs hover:bg-[var(--bloom)] transition-colors"
                              style={{ color: 'var(--ink)' }}
                            >
                              <Eye size={14} /> View Listing
                            </Link>
                            <button
                              className="flex items-center gap-2 px-4 py-2.5 text-xs hover:bg-[var(--bloom)] transition-colors w-full text-left"
                              style={{ color: 'var(--ink)' }}
                            >
                              <Edit size={14} /> Edit Details
                            </button>
                            <button
                              className="flex items-center gap-2 px-4 py-2.5 text-xs hover:bg-[var(--bloom)] transition-colors w-full text-left"
                              style={{ color: 'var(--ink)' }}
                            >
                              {outfit.status === 'active' ? (
                                <><ToggleLeft size={14} /> Deactivate</>
                              ) : (
                                <><ToggleRight size={14} /> Activate</>
                              )}
                            </button>
                            <div style={{ borderTop: '1px solid var(--petal)' }}>
                              <button
                                className="flex items-center gap-2 px-4 py-2.5 text-xs hover:bg-[var(--bloom)] transition-colors w-full text-left"
                                style={{ color: 'var(--rose)' }}
                              >
                                <Trash2 size={14} /> Delete
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
