'use client';

import FloatIn from '@/components/motion/FloatIn';
import PetalBackground from '@/components/floral/PetalBackground';

export default function RentalAgreementPage() {
  return (
    <div className="min-h-screen relative pb-24" style={{ background: 'var(--ivory)' }}>
      <PetalBackground />
      <div className="container mx-auto px-6 max-w-3xl pt-16 relative z-10 space-y-8 text-[#111111] font-body select-none">
        
        <FloatIn>
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[var(--kloset-gold)] font-bold">
            Renting Accord
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold mt-2 mb-4">
            Rental Agreement
          </h1>
          <p className="text-xs text-[var(--kloset-text-muted)] font-mono">
            Last Updated: June 2026
          </p>
        </FloatIn>

        <FloatIn delay={0.1}>
          <div className="prose prose-sm max-w-none text-xs sm:text-sm leading-relaxed space-y-6 text-gray-700">
            <p>
              By booking an outfit on <strong>Kloset</strong>, you acknowledge and agree to this Rental Agreement.
            </p>

            <h3 className="font-display text-base font-bold text-gray-900 pt-2 border-b border-[var(--kloset-border)] pb-1">
              1. Ownership
            </h3>
            <p>
              The renter acknowledges that the garments remain the sole property of the Seller. Renting does not transfer title, ownership, or intellectual property rights.
            </p>

            <h3 className="font-display text-base font-bold text-gray-900 pt-2 border-b border-[var(--kloset-border)] pb-1">
              2. Care &amp; Cleanliness
            </h3>
            <p>
              We handle dry cleaning! Renters are instructed **not** to wash, iron, or bleach the garment under any circumstances. Normal dry cleaning care is handled by the platform before and after the rental period.
            </p>

            <h3 className="font-display text-base font-bold text-gray-900 pt-2 border-b border-[var(--kloset-border)] pb-1">
              3. Late Fees &amp; Returns
            </h3>
            <p>
              Failure to return the garment on the scheduled return date (by 1:00 PM) will result in a late fee of 50% of the daily rental rate per day, which will be charged directly from the security deposit.
            </p>
          </div>
        </FloatIn>

      </div>
    </div>
  );
}
