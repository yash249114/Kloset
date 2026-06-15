'use client';

import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full text-left font-sans">
        {label && (
          <label className="text-[10px] font-mono tracking-widest uppercase text-charcoal-light font-bold select-none mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={`
              w-full h-[52px] px-4 text-sm font-sans bg-warm-white border rounded outline-none transition-all duration-300
              ${error 
                ? 'border-error focus:border-error focus:ring-1 focus:ring-error' 
                : 'border-border focus:border-champagne focus:ring-1 focus:ring-champagne'
              }
              placeholder-charcoal-light/40 text-charcoal disabled:opacity-50 disabled:bg-ivory-dark
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <span className="text-[10px] font-mono uppercase tracking-wider text-error font-medium mt-1">
            {error}
          </span>
        )}
        {!error && helperText && (
          <span className="text-[10px] font-mono uppercase tracking-wider text-charcoal-light font-medium mt-1">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
