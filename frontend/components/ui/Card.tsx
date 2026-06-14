'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onDragOver' | 'style'> {
  children: React.ReactNode;
  hoverEffect?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark' | 'admin';
}

export default function Card({
  children,
  hoverEffect = true,
  padding = 'md',
  theme = 'light',
  className = '',
  ...props
}: CardProps) {
  
  const baseStyle = "rounded-lg border overflow-hidden transition-all duration-300";
  
  let paddingStyle = "";
  switch (padding) {
    case 'none':
      paddingStyle = "";
      break;
    case 'sm':
      paddingStyle = "p-4"; // 16px padding
      break;
    case 'md':
      paddingStyle = "p-6"; // 24px padding (Card padding metric)
      break;
    case 'lg':
      paddingStyle = "p-8"; // 32px padding
      break;
  }

  let themeStyle = "";
  switch (theme) {
    case 'light':
      themeStyle = "bg-white border-border text-charcoal";
      break;
    case 'dark':
      themeStyle = "bg-charcoal text-ivory border-charcoal-mid";
      break;
    case 'admin':
      themeStyle = "bg-admin-surface border-admin-border text-white";
      break;
  }

  const hoverStyle = hoverEffect 
    ? theme === 'admin'
      ? "hover:border-champagne/40 hover:shadow-lg"
      : "hover:border-champagne/40 hover:shadow-md"
    : "";

  return (
    <motion.div
      whileHover={hoverEffect ? { y: -2 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`${baseStyle} ${paddingStyle} ${themeStyle} ${hoverStyle} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
