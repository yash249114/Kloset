'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FloatIn from '@/components/motion/FloatIn';
import PetalBackground from '@/components/floral/PetalBackground';
import { Search, ChevronDown, BookOpen, Truck, Shield, Calendar, HelpCircle, FileText, Undo, Star } from 'lucide-react';
import Link from 'next/link';

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const categories = [
    { id: 'all', label: 'All FAQs', icon: BookOpen },
    { id: 'rentals', label: 'Rentals & Fit', icon: HelpCircle },
    { id: 'returns', label: 'Returns & Shipments', icon: Truck },
    { id: 'cancellations', label: 'Cancellations & Refunds', icon: Undo },
    { id: 'terms', label: 'Policies & Damages', icon: FileText },
  ];

  const policySections = [
    {
      category: 'rentals',
      question: 'How does Kloset renting work?',
      answer: 'Browse our designer curated outfits, choose your size, select the booking rental dates on the outfit calendar (we offer 1, 3, or 7-day bookings), pay the security deposit and rental fee, and standard delivery will bring the outfit to your doorstep. Wear it, feel gorgeous, and return it in the provided package the morning after your booking ends.',
    },
    {
      category: 'rentals',
      question: 'What if the rented outfit does not fit?',
      answer: 'We provide free size exchanges (if inventory is available) or a 100% rental store credit. Contact customer support within 4 hours of receiving the delivery to initiate an exchange. Alternatively, visit any Kloset Partner Hub boutique for free minor alterations.',
    },
    {
      category: 'returns',
      question: 'What is the Returns Policy?',
      answer: 'Our courier partner will schedule a return pickup the morning after your rental period ends (usually between 9:00 AM and 1:00 PM). Please place the outfit back in the zippered garment bag provided. Do not wash, dry clean, or iron the dress; Kloset handles complete fabric sanitization.',
    },
    {
      category: 'cancellations',
      question: 'What is the Cancellation Policy?',
      answer: 'Cancellations made more than 7 days prior to your booking start date are 100% free of charge and fully refunded. For cancellations made between 3 to 7 days before rental starts, a 50% rental fee cancellation charge is applied. Cancellations within 48 hours of booking dispatch are non-refundable.',
    },
    {
      category: 'cancellations',
      question: 'What is the Refund Policy?',
      answer: 'Your security deposit is initiated for refund within 72 hours of the dress returning safely to our quality review warehouse. Once approved, the amount is refunded to your original payment method, taking 3-5 business days depending on your bank.',
    },
    {
      category: 'returns',
      question: 'What are the shipping fees and region restrictions?',
      answer: 'We charge a flat ₹300 fulfillment fee for door-to-door courier delivery and pick-ups. We currently service major metropolitan areas including Mumbai, Delhi NCR, Bangalore, Pune, Hyderabad, and Chennai. Region restrictions apply to rural pincodes; check availability on the product detail page.',
    },
    {
      category: 'terms',
      question: 'Terms & Conditions & Damage Coverage Policy',
      answer: 'By booking, you agree to treat the outfit with normal customer care. We cover minor food spills, slight stains, loose beads, and zipper glitches under our free Damage Waiver. Severe structural damages, burns, or losses may result in withholding partial or entire security deposits as evaluated by our inspection team.',
    },
    {
      category: 'terms',
      question: 'Privacy Policy & Data Protection',
      answer: 'Kloset prioritizes user privacy. All billing details are processed securely via 256-bit encrypted Razorpay gateways. We do not sell or distribute personal customer data. Renter profiles, KYC documentation, and sizes are stored securely following compliance architectures.',
    },
  ];

  const filteredPolicies = policySections.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen relative pb-20" style={{ background: 'var(--ivory)' }}>
      <PetalBackground />

      {/* Hero Header */}
      <div className="relative overflow-hidden py-16 text-center">
        <div className="container mx-auto px-6 relative z-10 space-y-4">
          <FloatIn>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[var(--kloset-gold)] font-bold">
              Frequently Asked Questions
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mt-2" style={{ color: 'var(--ink)' }}>
              Got Questions? We Have Answers.
            </h1>
            <p className="text-sm text-[var(--ink-light)] max-w-lg mx-auto mt-2">
              Browse categories or search directly for queries regarding fit, dry cleaning, refunds, and listing details.
            </p>
          </FloatIn>

          {/* Search bar */}
          <FloatIn delay={0.1}>
            <div className="max-w-md mx-auto relative mt-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-lighter)]" size={18} />
              <input
                type="text"
                placeholder="Search FAQs (e.g. security deposit, dry cleaning)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-kloset !pl-12 shadow-md !py-3.5 !rounded-2xl"
              />
            </div>
          </FloatIn>
        </div>
      </div>

      {/* Main content grid */}
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Category Toggles */}
        <FloatIn delay={0.2}>
          <div className="flex flex-wrap gap-2 justify-center mb-10 border-b border-[var(--petal)]/30 pb-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setOpenAccordion(null);
                  }}
                  className={`flex items-center gap-2 py-2.5 px-5 rounded-2xl text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[var(--kloset-dark)] text-white shadow-md'
                      : 'bg-white border border-[var(--petal)] text-[var(--ink-light)] hover:border-[var(--kloset-dark)]'
                  }`}
                >
                  <Icon size={14} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </FloatIn>

        {/* Accordions */}
        <FloatIn delay={0.3}>
          <div className="space-y-4">
            {filteredPolicies.length === 0 ? (
              <div className="empty-floral py-12">
                <p className="text-sm text-[var(--ink-light)]">No FAQs match your search term.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="text-xs text-[var(--kloset-gold)] hover:underline mt-2 font-mono uppercase tracking-wider"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              filteredPolicies.map((policy, idx) => {
                const isCurrentOpen = openAccordion === idx;
                return (
                  <div
                    key={idx}
                    className="card-floral bg-white overflow-hidden transition-all duration-300"
                    style={{ border: '1px solid var(--petal)' }}
                  >
                    <button
                      onClick={() => setOpenAccordion(isCurrentOpen ? null : idx)}
                      className="w-full p-5 text-left flex justify-between items-center hover:bg-[var(--bloom)]/10 transition-colors cursor-pointer animate-fade-in"
                    >
                      <span className="font-display font-semibold text-sm sm:text-base text-[var(--ink)] pr-4">
                        {policy.question}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`text-[var(--ink-light)] transition-transform duration-300 ${
                          isCurrentOpen ? 'rotate-180 text-[var(--kloset-gold)]' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isCurrentOpen && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden bg-[var(--ivory-warm)]/10"
                        >
                          <div className="p-5 border-t border-[var(--petal)]/30 text-xs sm:text-sm text-[var(--ink-light)] leading-relaxed whitespace-pre-line">
                            {policy.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>
        </FloatIn>

        {/* Support Box */}
        <FloatIn delay={0.4}>
          <div
            className="mt-12 rounded-[24px] p-6 text-center space-y-4 bg-white"
            style={{ border: '1px solid var(--petal)', boxShadow: 'var(--shadow-sm)' }}
          >
            <h3 className="font-display text-lg font-bold text-[var(--ink)]">
              Couldn't find the answers you need?
            </h3>
            <p className="text-xs text-[var(--ink-light)] max-w-md mx-auto">
              Our 24/7 care desk is ready to resolve all of your styling, fitting, and refund concerns. You can drop us a message directly in our Support Hub.
            </p>
            <div className="flex justify-center pt-2 gap-4">
              <Link
                href="/contact"
                className="btn-gold !h-[44px] text-xs uppercase tracking-wider"
              >
                Go to Support Hub
              </Link>
            </div>
          </div>
        </FloatIn>
      </div>
    </div>
  );
}
