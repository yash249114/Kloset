'use client';

import FloatIn from '@/components/motion/FloatIn';
import PetalBackground from '@/components/floral/PetalBackground';

export default function CancellationPolicyPage() {
  return (
    <div className="min-h-screen relative pb-24" style={{ background: 'var(--ivory)' }}>
      <PetalBackground />
      <div className="container mx-auto px-6 max-w-3xl pt-16 relative z-10 space-y-8 text-[#111111] font-body select-none">
        
        <FloatIn>
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[var(--kloset-gold)] font-bold">
            Booking Control
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold mt-2 mb-4">
            Cancellation Policy
          </h1>
          <p className="text-xs text-[var(--kloset-text-muted)] font-mono">
            Last Updated: June 2026
          </p>
        </FloatIn>

        <FloatIn delay={0.1}>
          <div className="prose prose-sm max-w-none text-xs sm:text-sm leading-relaxed space-y-6 text-gray-700">
            <p>
              This policy covers details regarding cancellations by renters or sellers.
            </p>

            <h3 className="font-display text-base font-bold text-gray-900 pt-2 border-b border-[var(--kloset-border)] pb-1">
              1. Renter Cancellation Policy
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Free Cancellations</strong>: Cancellations made more than 7 days prior to your booking pick-up date are fully refunded.</li>
              <li><strong>Late Cancellations</strong>: Cancellations between 3 to 7 days before the pick-up date are charged a 50% rental fee cancellation charge.</li>
              <li><strong>Non-refundable window</strong>: Cancellations within 48 hours of booking dispatch are non-refundable.</li>
            </ul>

            <h3 className="font-display text-base font-bold text-gray-900 pt-2 border-b border-[var(--kloset-border)] pb-1">
              2. Seller Cancellation Penalties
            </h3>
            <p>
              Sellers who accept a booking and subsequently cancel will be subject to a penalty charge of ₹1,000, which will be deducted from their active dashboard wallet. Repeated seller cancellations will lead to permanent account suspension.
            </p>
          </div>
        </FloatIn>

      </div>
    </div>
  );
}
