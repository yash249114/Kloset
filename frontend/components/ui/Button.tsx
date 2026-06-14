'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onDragOver' | 'style'> {
  variant?: 'primary' | 'outline' | 'ghost' | 'gold';
  isLoading?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  isLoading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  
  const baseStyle = "inline-flex items-center justify-center h-[52px] px-8 text-xs font-mono font-semibold uppercase tracking-widest transition-all duration-300 rounded focus:outline-none disabled:opacity-50 disabled:pointer-events-none select-none";
  
  let variantStyle = "";
  switch (variant) {
    case 'primary':
      variantStyle = "bg-charcoal text-ivory border border-charcoal hover:bg-charcoal-mid hover:border-charcoal-mid";
      break;
    case 'gold':
      variantStyle = "bg-champagne text-warm-white border border-champagne hover:bg-gold hover:border-gold";
      break;
    case 'outline':
      variantStyle = "bg-transparent text-charcoal border-2 border-charcoal hover:bg-charcoal hover:text-ivory";
      break;
    case 'ghost':
      variantStyle = "bg-transparent text-charcoal border border-transparent hover:bg-ivory-dark";
      break;
  }

  return (
    <motion.button
      whileHover={{ scale: 1.01, y: -1 }}
      whileTap={{ scale: 0.99, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`${baseStyle} ${variantStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}
