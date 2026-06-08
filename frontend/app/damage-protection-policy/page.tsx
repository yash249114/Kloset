'use client';

import FloatIn from '@/components/motion/FloatIn';
import PetalBackground from '@/components/floral/PetalBackground';

export default function DamagePolicyPage() {
  return (
    <div className="min-h-screen relative pb-24" style={{ background: 'var(--ivory)' }}>
      <PetalBackground />
      <div className="container mx-auto px-6 max-w-3xl pt-16 relative z-10 space-y-8 text-[#111111] font-body select-none">
        
        <FloatIn>
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[var(--kloset-gold)] font-bold">
            Damage Shield
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold mt-2 mb-4">
            Damage Protection Policy
          </h1>
          <p className="text-xs text-[var(--kloset-text-muted)] font-mono">
            Last Updated: June 2026
          </p>
        </FloatIn>

        <FloatIn delay={0.1}>
          <div className="prose prose-sm max-w-none text-xs sm:text-sm leading-relaxed space-y-6 text-gray-700">
            <p>
              This policy explains renter liability for spills, stains, and structure damages to rented garments.
            </p>

            <h3 className="font-display text-base font-bold text-gray-900 pt-2 border-b border-[var(--kloset-border)] pb-1">
              1. Normal Spills &amp; Tears (Fully Covered)
            </h3>
            <p>
              We cover minor wear and tear! Spills from normal eating, minor stains, small zipper glitches, and loose hooks/beads are completely covered. Renter security deposits will not be charged for these issues.
            </p>

            <h3 className="font-display text-base font-bold text-gray-900 pt-2 border-b border-[var(--kloset-border)] pb-1">
              2. Major Structural Damage
            </h3>
            <p>
              Severe damage such as large fabric burns, deep permanent oil/wine stains, extensive fabric tears, or loss of the garment is not covered under the standard waiver. The cost of repair or garment replacement value will be deducted from your security deposit.
            </p>

            <h3 className="font-display text-base font-bold text-gray-900 pt-2 border-b border-[var(--kloset-border)] pb-1">
              3. Inspection Process
            </h3>
            <p>
              Upon return, our boutique partner hub performs a 10-point check. If major damage is reported, Kloset holds the renter's deposit pending an arbitration review (usually resolved in 5 business days).
            </p>
          </div>
        </FloatIn>

      </div>
    </div>
  );
}
