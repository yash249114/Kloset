import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory">
      <div className="text-center space-y-4">
        <span className="text-[10px] font-mono tracking-[0.25em] text-champagne uppercase font-bold block">
          Error 404
        </span>
        <h1 className="text-4xl font-display font-medium text-charcoal">Page Not Found</h1>
        <p className="text-sm text-charcoal-light max-w-md mx-auto">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="btn btn-primary h-11 px-8 text-xs font-mono uppercase tracking-widest inline-flex items-center justify-center mt-4"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
