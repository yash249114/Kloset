'use client';

import FloatIn from '@/components/motion/FloatIn';
import PetalBackground from '@/components/floral/PetalBackground';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen relative pb-24" style={{ background: 'var(--ivory)' }}>
      <PetalBackground />
      <div className="container mx-auto px-6 max-w-3xl pt-16 relative z-10 space-y-8 text-[#111111] font-body select-none">
        
        <FloatIn>
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[var(--kloset-gold)] font-bold">
            Data Integrity
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold mt-2 mb-4">
            Privacy Policy
          </h1>
          <p className="text-xs text-[var(--kloset-text-muted)] font-mono">
            Last Updated: June 2026
          </p>
        </FloatIn>

        <FloatIn delay={0.1}>
          <div className="prose prose-sm max-w-none text-xs sm:text-sm leading-relaxed space-y-6 text-gray-700">
            <p>
              At <strong>Kloset</strong>, we hold your personal and financial privacy in the highest regard. This policy details how we collect, safeguard, and use customer data.
            </p>

            <h3 className="font-display text-base font-bold text-gray-900 pt-2 border-b border-[var(--kloset-border)] pb-1">
              1. Information Collection
            </h3>
            <p>
              We collect information you directly provide, including your name, email, billing details, shipping addresses, size measurements, and KYC verification records (e.g., Aadhaar/PAN hashes).
            </p>

            <h3 className="font-display text-base font-bold text-gray-900 pt-2 border-b border-[var(--kloset-border)] pb-1">
              2. Transaction Security
            </h3>
            <p>
              Financial transactions, security deposits, and card processing are handled via 256-bit encrypted Razorpay token gateways. We do not store full credit card details or bank account passwords on our servers.
            </p>

            <h3 className="font-display text-base font-bold text-gray-900 pt-2 border-b border-[var(--kloset-border)] pb-1">
              3. Data Retention
            </h3>
            <p>
              KYC and renting history are retained securely to protect against loss, dispute, and theft. Personal metadata can be requested for deletion by contacting the support desk at support@kloset.in.
            </p>
          </div>
        </FloatIn>

      </div>
    </div>
  );
}
