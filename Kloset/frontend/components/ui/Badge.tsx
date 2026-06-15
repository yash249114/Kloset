'use client';

import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'rose' | 'sage' | 'charcoal' | 'outline' | 'success' | 'error';
  className?: string;
}

export default function Badge({
  children,
  variant = 'gold',
  className = '',
}: BadgeProps) {
  
  const baseStyle = "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider select-none border";
  
  let variantStyle = "";
  switch (variant) {
    case 'gold':
      variantStyle = "bg-champagne/10 text-champagne border-champagne/30";
      break;
    case 'rose':
      variantStyle = "bg-rose-gold/10 text-rose-gold border-rose-gold/30";
      break;
    case 'sage':
      variantStyle = "bg-success/10 text-success border-success/30";
      break;
    case 'charcoal':
      variantStyle = "bg-charcoal/10 text-charcoal border-charcoal/30";
      break;
    case 'success':
      variantStyle = "bg-success/10 text-success border-success/30";
      break;
    case 'error':
      variantStyle = "bg-error/10 text-error border-error/30";
      break;
    case 'outline':
      variantStyle = "bg-transparent text-charcoal-light border-border";
      break;
  }

  return (
    <span className={`${baseStyle} ${variantStyle} ${className}`}>
      {children}
    </span>
  );
}
