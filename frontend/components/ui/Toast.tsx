'use client';

import React from 'react';
import { Toaster as SonnerToaster } from 'sonner';

export default function Toast() {
  return (
    <SonnerToaster
      position="bottom-right"
      theme="light"
      toastOptions={{
        style: {
          background: '#FFFCF8', // --warm-white
          color: '#2C2C2C', // --charcoal
          border: '1px solid #E8E0D5', // --border
          borderRadius: '4px',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '12px',
          letterSpacing: '0.02em',
          padding: '16px',
        },
        className: 'kloset-toast shadow-lg',
      }}
      style={{
        zIndex: 600, // Enforced Strict z-index Hierarchy
      }}
    />
  );
}
