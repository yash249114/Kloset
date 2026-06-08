'use client';

import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sections = [
    {
      title: 'ABOUT KLOSET',
      links: [
        { label: 'Terms & Conditions', href: '/terms' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Cancellation Policy', href: '/cancellation-policy' },
        { label: 'Refund Policy', href: '/refund-policy' },
      ],
    },
    {
      title: 'COLLECTIONS',
      links: [
        { label: 'Bridal Couture', href: '/discover?category=lehenga' },
        { label: 'Festive Wear', href: '/discover?category=saree' },
        { label: 'Mens Sherwani', href: '/discover?category=sherwani' },
        { label: 'Modern Gowns', href: '/discover?category=gown' },
      ],
    },
    {
      title: 'HOST AN OUTFIT',
      links: [
        { label: 'Start Earning', href: '/register?role=seller' },
        { label: 'Seller Agreement', href: '/seller-agreement' },
        { label: 'Damage Policy', href: '/damage-protection-policy' },
      ],
    },
    {
      title: 'CUSTOMER SERVICE',
      links: [
        { label: 'Help & FAQs', href: '/faq' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'Rental Agreement', href: '/rental-agreement' },
        { label: 'Shipping Policy', href: '/shipping-policy' },
      ],
    },
  ];

  return (
    <footer className="w-full bg-[#fbfaf8] border-t border-[var(--kloset-border)] font-body select-none">
      
      {/* Back to top banner */}
      <div className="border-b border-[var(--kloset-border)]">
        <button
          onClick={scrollToTop}
          className="w-full py-4 text-center text-[10px] uppercase tracking-[0.2em] font-semibold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
        >
          Back to top
        </button>
      </div>
 
      {/* Main directories grid */}
      <div className="max-w-[1440px] mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {sections.map((sec) => (
            <div key={sec.title} className="flex flex-col">
               <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-[0.2em] mb-4">
                {sec.title}
              </h4>
              <ul className="space-y-2.5">
                {sec.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[12px] text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
 
      {/* Bottom copyright & legal block */}
      <div className="border-t border-[var(--kloset-border)] py-10 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 flex flex-col items-center justify-center gap-4 text-center">
          <Link href="/" className="flex flex-col items-center justify-center group mb-2">
            <span className="font-display text-xl font-bold tracking-widest text-gray-900 group-hover:text-[var(--kloset-gold)] transition-colors">
              KLOSET
            </span>
            <span className="text-[8px] uppercase tracking-[0.25em] text-gray-400 font-semibold mt-0.5">
              Couture Rental
            </span>
          </Link>
          
          <div className="flex flex-wrap justify-center gap-6 text-[10px] uppercase tracking-[0.1em] text-gray-400 font-medium">
            <Link href="/privacy" className="hover:underline hover:text-gray-700">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline hover:text-gray-700">Terms of Use</Link>
            <Link href="/shipping-policy" className="hover:underline hover:text-gray-700">Fulfillment & Returns</Link>
          </div>

          <p className="text-[11px] text-gray-400 mt-2 max-w-xl leading-relaxed">
            © {year} Kloset. All designer wear, trademarks, and imagery are properties of their respective owners. Rent premium couture responsibly.
          </p>
        </div>
      </div>
    </footer>
  );
}
