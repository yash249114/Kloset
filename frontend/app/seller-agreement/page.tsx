'use client';

import FloatIn from '@/components/motion/FloatIn';
import PetalBackground from '@/components/floral/PetalBackground';

export default function SellerAgreementPage() {
  return (
    <div className="min-h-screen relative pb-24" style={{ background: 'var(--ivory)' }}>
      <PetalBackground />
      <div className="container mx-auto px-6 max-w-3xl pt-16 relative z-10 space-y-8 text-[#111111] font-body select-none">
        
        <FloatIn>
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[var(--kloset-gold)] font-bold">
            Listing Protocol
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold mt-2 mb-4">
            Seller Agreement
          </h1>
          <p className="text-xs text-[var(--kloset-text-muted)] font-mono">
            Last Updated: June 2026
          </p>
        </FloatIn>

        <FloatIn delay={0.1}>
          <div className="prose prose-sm max-w-none text-xs sm:text-sm leading-relaxed space-y-6 text-gray-700">
            <p>
              By listing your wardrobe on <strong>Kloset</strong>, you acknowledge and agree to this Seller Agreement.
            </p>

            <h3 className="font-display text-base font-bold text-gray-900 pt-2 border-b border-[var(--kloset-border)] pb-1">
              1. Commission &amp; Payouts
            </h3>
            <p>
              Sellers retain 95% of the total rental fee. Kloset charges a 5% commission on each booking to cover payment gateway processing, logistics, and dry-cleaning coordination. Payments are initiated to your bank account within 48 hours of return quality confirmation.
            </p>

            <h3 className="font-display text-base font-bold text-gray-900 pt-2 border-b border-[var(--kloset-border)] pb-1">
              2. Product Descriptions &amp; Integrity
            </h3>
            <p>
              Sellers must list authentic designer outfits. Any listings containing counterfeit garments or misleading sizes will be permanently banned.
            </p>

            <h3 className="font-display text-base font-bold text-gray-900 pt-2 border-b border-[var(--kloset-border)] pb-1">
              3. Logistics Handover
            </h3>
            <p>
              When a booking is confirmed, our delivery rider will coordinate pickup of the garment. You must provide the outfit in clean, ready-to-transport condition within the specified pickup hours.
            </p>
          </div>
        </FloatIn>

      </div>
    </div>
  );
}
