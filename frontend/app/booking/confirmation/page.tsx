'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import PetalBackground from '@/components/floral/PetalBackground';
import FloatIn from '@/components/motion/FloatIn';
import InvoiceViewer, { InvoiceData } from '@/components/checkout/InvoiceViewer';
import {
  CheckCircle,
  Calendar,
  Download,
  MessageCircle,
  ArrowRight,
  Sparkles,
  FileText,
} from 'lucide-react';

// Mock booking confirmation data
const mockBooking = {
  id: 'KL-2026-00847',
  outfit: 'Royal Maroon Bridal Lehenga',
  seller: 'Priya Collections',
  size: 'M',
  pickup_date: '2026-06-12',
  return_date: '2026-06-15',
  days: 3,
  rental_amount: 8000,
  security_deposit: 10000,
  delivery_fee: 300,
  platform_fee: 400,
  total_amount: 18700,
  payment_method: 'Razorpay (UPI)',
  status: 'confirmed',
};

const timelineSteps = [
  { label: 'Booking Confirmed', date: 'Today', active: true, complete: true },
  { label: 'Outfit Dispatched', date: 'Jun 11', active: false, complete: false },
  { label: 'Picked Up', date: 'Jun 12', active: false, complete: false },
  { label: 'In Use', date: 'Jun 12-15', active: false, complete: false },
  { label: 'Returned', date: 'Jun 15', active: false, complete: false },
  { label: 'Deposit Refunded', date: 'Jun 18', active: false, complete: false },
];

export default function BookingConfirmationPage() {
  const [showInvoice, setShowInvoice] = useState(false);

  const invoiceData: InvoiceData = {
    invoiceNumber: mockBooking.id,
    date: new Date().toLocaleDateString('en-IN'),
    renterName: 'Arundhati Roy',
    renterEmail: 'arundhati@gmail.com',
    shippingAddress: {
      full_address: '42, Rose Garden Apartments, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
    },
    items: [
      {
        id: 'outfit-mock-1',
        title: mockBooking.outfit,
        price: Math.round(mockBooking.rental_amount / mockBooking.days),
        deposit: mockBooking.security_deposit,
        size: mockBooking.size,
        startDate: mockBooking.pickup_date,
        endDate: mockBooking.return_date,
        quantity: 1,
        sellerName: mockBooking.seller,
      }
    ],
    subtotal: mockBooking.rental_amount,
    securityDeposit: mockBooking.security_deposit,
    platformFee: mockBooking.platform_fee,
    tax: Math.round(mockBooking.rental_amount * 0.08),
    shippingFee: mockBooking.delivery_fee,
    discount: 0,
    total: mockBooking.total_amount + Math.round(mockBooking.rental_amount * 0.08),
    paymentMethod: mockBooking.payment_method,
  };

  return (
    <div className="min-h-screen relative pb-16" style={{ background: 'var(--ivory)' }}>
      <PetalBackground />

      <div className="container mx-auto px-6 py-8 relative z-10">
        <AnimatePresence mode="wait">
          {showInvoice ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-4"
            >
              <InvoiceViewer invoice={invoiceData} onClose={() => setShowInvoice(false)} />
            </motion.div>
          ) : (
            <div className="max-w-5xl mx-auto">
              {/* Success Hero */}
              <FloatIn>
                <div className="text-center max-w-lg mx-auto mb-10">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{
                      background: 'linear-gradient(135deg, rgba(143, 175, 143, 0.2), rgba(143, 175, 143, 0.1))',
                      border: '2px solid rgba(143, 175, 143, 0.3)',
                    }}
                  >
                    <CheckCircle size={36} style={{ color: 'var(--sage)' }} />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[var(--sage-dark)] font-bold">
                      Booking Confirmed
                    </span>
                    <h1 className="text-3xl md:text-4xl font-display font-bold mt-2 mb-3" style={{ color: 'var(--ink)' }}>
                      You&apos;re All Set! ✨
                    </h1>
                    <p className="text-sm" style={{ color: 'var(--ink-light)' }}>
                      Your outfit is reserved. We&apos;ve sent the details to your email and phone.
                    </p>
                  </motion.div>
                </div>
              </FloatIn>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Booking Details Card */}
                <div className="lg:col-span-7">
                  <FloatIn>
                    <div
                      className="rounded-[24px] p-6 md:p-8 bg-white relative"
                      style={{ border: '1px solid var(--petal)', boxShadow: 'var(--shadow-md)' }}
                    >
                      {/* Gold accent strip */}
                      <div className="absolute top-0 inset-x-0 h-1 rounded-t-[24px] bg-gradient-to-r from-[var(--gold)] via-[var(--bloom)] to-[var(--gold)]" />

                      <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: '1px solid var(--bloom)' }}>
                        <div>
                          <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: 'var(--ink-lighter)' }}>
                            Booking Reference
                          </span>
                          <p className="font-mono text-lg font-bold mt-1" style={{ color: 'var(--ink)' }}>
                            {mockBooking.id}
                          </p>
                        </div>
                        <span className="badge badge-sage font-bold uppercase text-[10px] py-1 px-3">
                          {mockBooking.status}
                        </span>
                      </div>

                      {/* Outfit info */}
                      <div className="mb-6">
                        <h3 className="font-display text-xl font-bold" style={{ color: 'var(--ink)' }}>
                          {mockBooking.outfit}
                        </h3>
                        <p className="text-xs mt-1" style={{ color: 'var(--ink-light)' }}>
                          by {mockBooking.seller} · Size {mockBooking.size}
                        </p>
                      </div>

                      {/* Date & Location */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="rounded-xl p-4" style={{ background: 'var(--bloom)', border: '1px solid var(--petal)' }}>
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar size={14} style={{ color: 'var(--rose)' }} />
                            <span className="text-[10px] font-mono tracking-wider uppercase" style={{ color: 'var(--ink-lighter)' }}>
                              Pickup
                            </span>
                          </div>
                          <p className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>
                            {mockBooking.pickup_date}
                          </p>
                        </div>
                        <div className="rounded-xl p-4" style={{ background: 'var(--bloom)', border: '1px solid var(--petal)' }}>
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar size={14} style={{ color: 'var(--rose)' }} />
                            <span className="text-[10px] font-mono tracking-wider uppercase" style={{ color: 'var(--ink-lighter)' }}>
                              Return By
                            </span>
                          </div>
                          <p className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>
                            {mockBooking.return_date}
                          </p>
                        </div>
                      </div>

                      {/* Price breakdown */}
                      <div className="space-y-2 text-sm mb-6 pb-4" style={{ borderBottom: '1px solid var(--bloom)' }}>
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--ink-light)' }}>Rental ({mockBooking.days} days)</span>
                          <span className="font-mono" style={{ color: 'var(--ink)' }}>₹{mockBooking.rental_amount.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--ink-light)' }}>Security Deposit</span>
                          <span className="font-mono" style={{ color: 'var(--ink)' }}>₹{mockBooking.security_deposit.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--ink-light)' }}>Delivery</span>
                          <span className="font-mono" style={{ color: 'var(--ink)' }}>₹{mockBooking.delivery_fee}</span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--ink-light)' }}>Platform Fee</span>
                          <span className="font-mono" style={{ color: 'var(--ink)' }}>₹{mockBooking.platform_fee}</span>
                        </div>
                        <div className="flex justify-between pt-2 mt-2" style={{ borderTop: '1px solid var(--bloom)' }}>
                          <span className="font-semibold" style={{ color: 'var(--ink)' }}>Total Paid</span>
                          <span className="font-mono font-bold text-lg" style={{ color: 'var(--ink)' }}>
                            ₹{mockBooking.total_amount.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowInvoice(true)}
                          className="btn-outline flex-1 !py-3 text-xs flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <FileText size={14} />
                          View Receipt
                        </button>
                        <button className="btn-outline flex-1 !py-3 text-xs flex items-center justify-center gap-2">
                          <MessageCircle size={14} />
                          Contact Seller
                        </button>
                      </div>
                    </div>
                  </FloatIn>
                </div>

                {/* Timeline */}
                <div className="lg:col-span-5">
                  <FloatIn direction="right" delay={0.1}>
                    <div
                      className="rounded-[24px] p-6 bg-white"
                      style={{ border: '1px solid var(--petal)', boxShadow: 'var(--shadow-sm)' }}
                    >
                      <h2 className="text-sm font-semibold uppercase tracking-widest mb-6" style={{ color: 'var(--ink)' }}>
                        Booking Timeline
                      </h2>

                      <div className="space-y-0">
                        {timelineSteps.map((step, i) => (
                          <div key={step.label} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div
                                className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{
                                  background: step.complete
                                    ? 'var(--sage)'
                                    : step.active
                                    ? 'var(--rose)'
                                    : 'var(--bloom)',
                                  border: `2px solid ${step.complete ? 'var(--sage)' : step.active ? 'var(--rose)' : 'var(--petal)'}`,
                                }}
                              >
                                {step.complete && (
                                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                                    <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                              </div>
                              {i < timelineSteps.length - 1 && (
                                <div
                                  className="w-px h-10"
                                  style={{
                                    background: step.complete ? 'var(--sage)' : 'var(--petal)',
                                  }}
                                />
                              )}
                            </div>

                            <div className="pb-6">
                              <p
                                className="text-sm font-semibold -mt-0.5"
                                style={{
                                  color: step.complete || step.active ? 'var(--ink)' : 'var(--ink-lighter)',
                                }}
                              >
                                {step.label}
                              </p>
                              <span className="text-[11px]" style={{ color: 'var(--ink-lighter)' }}>
                                {step.date}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </FloatIn>

                  {/* Quick actions */}
                  <FloatIn direction="right" delay={0.2}>
                    <div className="mt-6 space-y-3">
                      <Link
                        href="/renter/dashboard"
                        className="block rounded-2xl p-4 bg-white text-center transition-all duration-300 hover:shadow-md border"
                        style={{ borderColor: 'var(--petal)' }}
                      >
                        <span className="text-xs font-mono tracking-wider uppercase text-[var(--rose)] flex items-center justify-center gap-1.5">
                          View All Bookings <ArrowRight size={12} />
                        </span>
                      </Link>
                      <Link
                        href="/discover"
                        className="block rounded-2xl p-4 bg-white text-center transition-all duration-300 hover:shadow-md border"
                        style={{ borderColor: 'var(--petal)' }}
                      >
                        <span className="text-xs font-mono tracking-wider uppercase flex items-center justify-center gap-1 text-[var(--gold)]">
                          <Sparkles size={12} />
                          Continue Browsing
                        </span>
                      </Link>
                    </div>
                  </FloatIn>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
