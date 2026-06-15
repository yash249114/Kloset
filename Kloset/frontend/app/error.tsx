'use client';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory">
      <div className="text-center space-y-4">
        <span className="text-[10px] font-mono tracking-[0.25em] text-champagne uppercase font-bold block">
          Something went wrong
        </span>
        <h1 className="text-4xl font-display font-medium text-charcoal">Unexpected Error</h1>
        <p className="text-sm text-charcoal-light max-w-md mx-auto">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={() => reset()}
          className="btn btn-primary h-11 px-8 text-xs font-mono uppercase tracking-widest inline-flex items-center justify-center mt-4 cursor-pointer"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
