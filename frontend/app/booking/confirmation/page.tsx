'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check, Calendar, ArrowRight, Mail } from 'lucide-react';
import Card from '@/components/ui/Card';

const springTransition = { type: 'spring' as const, stiffness: 300, damping: 30 };

function ConfirmationContent() {
  const searchParams = useSearchParams() || new URLSearchParams();
  const [ref, setRef] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      const urlRef = searchParams.get('ref');
      if (urlRef) {
        setRef(urlRef);
      } else {
        setRef(`KL-2026-${Math.floor(100000 + Math.random() * 900000)}`);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [searchParams]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: springTransition 
    },
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-24 select-none font-sans text-charcoal">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8 text-center"
      >
        
        {/* Animated Check avatar */}
        <motion.div
          variants={itemVariants}
          className="w-20 h-20 bg-success/10 text-success border border-success/30 rounded-full flex items-center justify-center mx-auto shadow-sm"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={springTransition}
          >
            <Check size={36} className="text-success" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.div variants={itemVariants} className="space-y-2">
          <span className="text-[10px] font-mono tracking-[0.25em] text-champagne uppercase font-bold block">
            Escrow Payment Confirmed
          </span>
          <h1 className="text-3xl md:text-4xl font-display font-medium">
            Booking Confirmed
          </h1>
          <p className="text-xs text-charcoal-light font-mono">
            Order Registry Reference: <strong className="text-charcoal">{ref}</strong>
          </p>
        </motion.div>

        {/* Summary Card */}
        <motion.div variants={itemVariants}>
          <Card hoverEffect={false} padding="md" className="bg-white border-border text-left relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-success" />
            <h3 className="font-mono text-xs uppercase tracking-widest font-bold text-charcoal mb-4 flex items-center gap-1.5">
              <Calendar size={14} className="text-champagne" /> Upcoming Timelines
            </h3>
            
            {/* Steps indicator */}
            <div className="space-y-4 text-xs">
              {[
                { title: 'Bespoke Dry Cleaning', desc: 'Listing steam-sterilized and dry-cleaned under platform quality rules.', active: true },
                { title: 'Quality Assurance Dispatch', desc: 'Transit verification by Kloset logistics specialists.', active: false },
                { title: 'Doorstep Courier Delivery', desc: 'Secure hand-over at your shipping destination.', active: false },
                { title: 'Couture Return Pickup', desc: 'We handle return pickup on the last day of rental.', active: false },
              ].map((step, i) => (
                <div key={i} className="flex gap-4 relative">
                  {i < 3 && <div className="absolute left-[9px] top-5 bottom-[-16px] w-[1.5px] bg-border" />}
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono border-2 flex-shrink-0 ${
                    step.active ? 'bg-success border-success text-white' : 'bg-white border-border text-charcoal-light'
                  }`}>
                    {step.active ? '✓' : i + 1}
                  </div>
                  <div>
                    <h4 className={`font-semibold ${step.active ? 'text-charcoal' : 'text-charcoal-light'}`}>{step.title}</h4>
                    <p className="text-[10px] text-charcoal-light/80 mt-0.5 leading-relaxed font-light">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </Card>
        </motion.div>

        {/* Info alerts */}
        <motion.div 
          variants={itemVariants}
          className="p-4 border border-border bg-[#FAF9F6] rounded-lg text-[10px] text-charcoal-light leading-relaxed border-border/40 text-left font-mono flex items-start gap-2.5"
        >
          <Mail size={14} className="text-champagne mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold text-charcoal mb-0.5">Receipt Emailed</p>
            <p>An automated invoice, rental checklist, and courier tracker link have been dispatched to your email address.</p>
          </div>
        </motion.div>

        {/* Action button redirecting */}
        <motion.div variants={itemVariants} className="pt-4 flex flex-col sm:flex-row gap-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={springTransition} className="flex-grow flex">
            <Link href="/dashboard" className="btn btn-primary flex-grow text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2">
              Renter Studio <ArrowRight size={14} />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={springTransition} className="flex-grow flex">
            <Link href="/discover" className="btn btn-outline flex-grow text-xs font-mono uppercase tracking-widest">
              Rent More Couture
            </Link>
          </motion.div>
        </motion.div>

      </motion.div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="py-24 text-center">
        <span className="font-mono text-xs uppercase animate-pulse">Loading Confirmation...</span>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
