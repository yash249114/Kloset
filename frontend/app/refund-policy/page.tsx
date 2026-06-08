'use client';

import FloatIn from '@/components/motion/FloatIn';
import PetalBackground from '@/components/floral/PetalBackground';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen relative pb-24" style={{ background: 'var(--ivory)' }}>
      <PetalBackground />
      <div className="container mx-auto px-6 max-w-3xl pt-16 relative z-10 space-y-8 text-[#111111] font-body select-none">
        
        <FloatIn>
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[var(--kloset-gold)] font-bold">
            Escrow Shield
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold mt-2 mb-4">
            Refund Policy
          </h1>
          <p className="text-xs text-[var(--kloset-text-muted)] font-mono">
            Last Updated: June 2026
          </p>
        </FloatIn>

        <FloatIn delay={0.1}>
          <div className="prose prose-sm max-w-none text-xs sm:text-sm leading-relaxed space-y-6 text-gray-700">
            <p>
              At <strong>Kloset</strong>, we operate a secure escrow structure to ensure both renters and hosts are protected. This policy outlines security deposit releases and fee refunds.
            </p>

            <h3 className="font-display text-base font-bold text-gray-900 pt-2 border-b border-[var(--kloset-border)] pb-1">
              1. Security Deposit Releases
            </h3>
            <p>
              Your security deposit is locked during the rental booking. Once the outfit is returned and passes a 10-point quality check at our partner boutiques, the deposit refund is initiated automatically within 72 hours.
            </p>

            <h3 className="font-display text-base font-bold text-gray-900 pt-2 border-b border-[var(--kloset-border)] pb-1">
              2. Fit Mismatch & Alteration Refunds
            </h3>
            <p>
              If the garment does not fit, contact us within 4 hours of receipt. We will attempt to courier a replacement size. If unavailable, you will receive a 100% store credit or a full rental fee refund.
            </p>

            <h3 className="font-display text-base font-bold text-gray-900 pt-2 border-b border-[var(--kloset-border)] pb-1">
              3. Processing Timelines
            </h3>
            <p>
              Refunds approved by our billing desk are sent back to the original payment source (credit card, UPI, bank transfer) via Razorpay. It typically takes 3-5 business days for the funds to reflect in your account.
            </p>
          </div>
        </FloatIn>

      </div>
    </div>
  );
}
