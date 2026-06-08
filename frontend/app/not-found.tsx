import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="min-h-[calc(100vh-var(--nav-height))] flex items-center justify-center px-6"
      style={{
        background:
          'radial-gradient(ellipse at 50% 30%, rgba(249,232,232,0.6) 0%, transparent 60%)',
      }}
    >
      <div className="text-center max-w-md">
        {/* Decorative number */}
        <div
          className="text-[120px] md:text-[160px] font-display font-bold leading-none mb-2"
          style={{
            background: 'linear-gradient(135deg, var(--petal), var(--gold-light))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          404
        </div>

        {/* Floral icon */}
        <div
          className="w-16 h-16 rounded-[20px] flex items-center justify-center mx-auto mb-6"
          style={{
            background: 'linear-gradient(135deg, var(--bloom), rgba(201, 169, 110, 0.1))',
            border: '1.5px solid var(--petal)',
          }}
        >
          <span className="text-2xl">🌸</span>
        </div>

        <h1
          className="text-2xl md:text-3xl font-display font-bold mb-3"
          style={{ color: 'var(--ink)' }}
        >
          Page Not Found
        </h1>
        <p
          className="text-sm mb-8 leading-relaxed"
          style={{ color: 'var(--ink-light)' }}
        >
          The outfit you&apos;re looking for seems to have floated away.
          Let&apos;s get you back to our beautiful collection.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="btn-gold !text-xs !py-3.5 !px-8 tracking-[0.15em]"
          >
            Back to Home
          </Link>
          <Link
            href="/discover"
            className="btn-outline !text-xs !py-3.5 !px-8 tracking-[0.15em]"
          >
            Browse Outfits
          </Link>
        </div>
      </div>
    </div>
  );
}
