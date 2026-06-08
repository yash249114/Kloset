'use client';

import FloatIn from '@/components/motion/FloatIn';
import PetalBackground from '@/components/floral/PetalBackground';

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen relative pb-24" style={{ background: 'var(--ivory)' }}>
      <PetalBackground />
      <div className="container mx-auto px-6 max-w-3xl pt-16 relative z-10 space-y-8 text-[#111111] font-body select-none">
        
        <FloatIn>
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[var(--kloset-gold)] font-bold">
            Fulfillment Logistics
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold mt-2 mb-4">
            Shipping &amp; Delivery Policy
          </h1>
          <p className="text-xs text-[var(--kloset-text-muted)] font-mono">
            Last Updated: June 2026
          </p>
        </FloatIn>

        <FloatIn delay={0.1}>
          <div className="prose prose-sm max-w-none text-xs sm:text-sm leading-relaxed space-y-6 text-gray-700">
            <p>
              This policy covers our standard shipping rates, regions, and delivery timelines.
            </p>

            <h3 className="font-display text-base font-bold text-gray-900 pt-2 border-b border-[var(--kloset-border)] pb-1">
              1. Delivery Timelines &amp; Locations
            </h3>
            <p>
              We currently service major metropolitan cities including Mumbai, Delhi NCR, Bangalore, Pune, Hyderabad, and Chennai. Standard delivery coordinates arrival of your outfit by 5:00 PM the evening before your booking begins.
            </p>

            <h3 className="font-display text-base font-bold text-gray-900 pt-2 border-b border-[var(--kloset-border)] pb-1">
              2. Return Pickups
            </h3>
            <p>
              Return pickup is scheduled for the morning immediately following your rental duration end (between 9:00 AM and 1:00 PM). Ensure the dress is repacked in the original Kloset zippered carrier bag.
            </p>

            <h3 className="font-display text-base font-bold text-gray-900 pt-2 border-b border-[var(--kloset-border)] pb-1">
              3. Flat Rate Shipping Charges
            </h3>
            <p>
              We charge a flat ₹300 fulfillment fee for each booking. This covers both doorstep delivery and return courier pickups.
            </p>
          </div>
        </FloatIn>

      </div>
    </div>
  );
}
