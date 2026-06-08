'use client';

import FloatIn from '@/components/motion/FloatIn';
import PetalBackground from '@/components/floral/PetalBackground';

export default function TermsPage() {
  return (
    <div className="min-h-screen relative pb-24" style={{ background: 'var(--ivory)' }}>
      <PetalBackground />
      <div className="container mx-auto px-6 max-w-3xl pt-16 relative z-10 space-y-8 text-[#111111] font-body select-none">
        
        <FloatIn>
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[var(--kloset-gold)] font-bold">
            Legal Framework
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold mt-2 mb-4">
            Terms & Conditions
          </h1>
          <p className="text-xs text-[var(--kloset-text-muted)] font-mono">
            Last Updated: June 2026
          </p>
        </FloatIn>

        <FloatIn delay={0.1}>
          <div className="prose prose-sm max-w-none text-xs sm:text-sm leading-relaxed space-y-6 text-gray-700">
            <p>
              Welcome to <strong>Kloset</strong> (the "Platform"), a luxury couture rental marketplace. These Terms &amp; Conditions govern your access to and use of our website, mobile application, and related rental services.
            </p>

            <h3 className="font-display text-base font-bold text-gray-900 pt-2 border-b border-[var(--kloset-border)] pb-1">
              1. General Overview
            </h3>
            <p>
              Kloset provides a marketplace matching independent owners/hosts ("Sellers") who list luxury garments for rent with users wishing to rent those garments ("Renters"). By creating an account or booking an outfit, you agree to comply with and be legally bound by these terms.
            </p>

            <h3 className="font-display text-base font-bold text-gray-900 pt-2 border-b border-[var(--kloset-border)] pb-1">
              2. Account Registration &amp; KYC Verification
            </h3>
            <p>
              To ensure safety and integrity, all users must register an account and undergo Know Your Customer (KYC) identity check. You agree to provide accurate, current, and complete identification documents. Accounts with fraudulent or mismatched identity hashes will be terminated immediately.
            </p>

            <h3 className="font-display text-base font-bold text-gray-900 pt-2 border-b border-[var(--kloset-border)] pb-1">
              3. Rental Bookings &amp; Financial Security Deposits
            </h3>
            <p>
              Renters agree to pay the designated rental fee (available for 1, 3, or 7-day durations) plus a refundable security deposit. The security deposit acts as escrow protection for the Seller against severe garment damage, loss, or unauthorized holding of the outfit.
            </p>

            <h3 className="font-display text-base font-bold text-gray-900 pt-2 border-b border-[var(--kloset-border)] pb-1">
              4. Payment &amp; Escrow Releases
            </h3>
            <p>
              All payments are processed securely via our integration with Razorpay. Rental fees are held in escrow and released to the Seller (minus Kloset commission fees) once the rental concludes without dispute. Refunding the renter's deposit is initiated within 72 hours of the outfit successfully returning to our quality inspection hub.
            </p>

            <h3 className="font-display text-base font-bold text-gray-900 pt-2 border-b border-[var(--kloset-border)] pb-1">
              5. Intellectual Property
            </h3>
            <p>
              All brand names, original couture designs, custom logo vectors, and styling guides featured on Kloset are properties of their respective designers and owners. Copying, scraping, or replicating content without written platform consent is strictly prohibited.
            </p>
          </div>
        </FloatIn>

      </div>
    </div>
  );
}
