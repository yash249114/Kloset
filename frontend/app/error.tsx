'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div
      className="min-h-[calc(100vh-var(--nav-height))] flex items-center justify-center px-6"
      style={{
        background:
          'radial-gradient(ellipse at 50% 30%, rgba(249,232,232,0.6) 0%, transparent 60%)',
      }}
    >
      <div className="text-center max-w-md">
        {/* Decorative icon */}
        <div
          className="w-20 h-20 rounded-[24px] flex items-center justify-center mx-auto mb-6"
          style={{
            background: 'rgba(193, 123, 123, 0.08)',
            border: '1.5px solid rgba(193, 123, 123, 0.15)',
          }}
        >
          <span className="text-3xl">🪷</span>
        </div>

        <h1
          className="text-2xl md:text-3xl font-display font-bold mb-3"
          style={{ color: 'var(--ink)' }}
        >
          Something went wrong
        </h1>
        <p
          className="text-sm mb-8 leading-relaxed"
          style={{ color: 'var(--ink-light)' }}
        >
          We encountered an unexpected issue. Our team has been notified and
          is working on a fix. Please try again.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="btn-gold !text-xs !py-3.5 !px-8 tracking-[0.15em]"
          >
            Try Again
          </button>
          <a
            href="/"
            className="btn-outline !text-xs !py-3.5 !px-8 tracking-[0.15em]"
          >
            Back to Home
          </a>
        </div>

        {error.digest && (
          <p
            className="text-[10px] font-mono mt-6 tracking-wider"
            style={{ color: 'var(--ink-lighter)' }}
          >
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
