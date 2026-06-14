'use client';

import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';

interface GoogleButtonProps {
  onSuccess: (credentialResponse: any) => void;
  onError?: () => void;
  variant?: 'primary' | 'outline';
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

function GoogleSvg() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.54 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.99 23.99 0 0 0 0 24c0 3.77.87 7.35 2.56 10.56l7.98-5.97z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 5.97C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

export default function GoogleButton({
  onSuccess,
  onError,
  variant = 'outline',
  children,
  className = '',
  disabled = false,
}: GoogleButtonProps) {
  const signIn = useGoogleLogin({
    onSuccess,
    onError: onError || (() => {}),
    flow: 'auth-code',
  });

  const handleClick = () => {
    if (!disabled) {
      signIn();
    }
  };

  const baseStyle = 'inline-flex items-center justify-center h-[52px] px-8 text-xs font-mono font-semibold uppercase tracking-widest transition-all duration-300 rounded focus:outline-none disabled:opacity-50 disabled:pointer-events-none select-none gap-2';
  
  const variantStyle = variant === 'primary'
    ? 'bg-charcoal text-ivory border border-charcoal hover:bg-charcoal-mid hover:border-charcoal-mid'
    : 'bg-transparent text-charcoal border-2 border-charcoal hover:bg-charcoal hover:text-ivory';

  return (
    <motion.button
      whileHover={{ scale: 1.01, y: -1 }}
      whileTap={{ scale: 0.99, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`${baseStyle} ${variantStyle} ${className}`}
      onClick={handleClick}
      disabled={disabled}
      type="button"
    >
      <GoogleSvg />
      {children || 'Continue with Google'}
    </motion.button>
  );
}