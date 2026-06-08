'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

function SkeletonBase({
  className = '',
  width,
  height,
  style,
}: {
  className?: string;
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      className={`rounded-xl overflow-hidden ${className}`}
      style={{
        width,
        height,
        background:
          'linear-gradient(90deg, var(--bloom) 0%, var(--ivory-warm) 50%, var(--bloom) 100%)',
        backgroundSize: '200% 100%',
        ...style,
      }}
      animate={{
        backgroundPosition: ['200% 0', '-200% 0'],
      }}
      transition={{
        duration: 1.8,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}

export default function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  lines = 1,
}: SkeletonProps) {
  if (variant === 'text') {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonBase
            key={i}
            height={14}
            width={i === lines - 1 && lines > 1 ? '70%' : '100%'}
            className="rounded-md"
          />
        ))}
      </div>
    );
  }

  if (variant === 'circular') {
    return (
      <SkeletonBase
        className={className}
        width={width || 48}
        height={height || 48}
        style={{ borderRadius: '50%' }}
      />
    );
  }

  if (variant === 'card') {
    return (
      <div
        className={`rounded-2xl overflow-hidden ${className}`}
        style={{ border: '1px solid var(--petal)' }}
      >
        <SkeletonBase height={240} className="!rounded-none" />
        <div className="p-4 space-y-3 bg-white">
          <SkeletonBase height={18} width="75%" className="rounded-md" />
          <SkeletonBase height={14} width="50%" className="rounded-md" />
          <div className="flex justify-between items-center pt-2">
            <SkeletonBase height={20} width={80} className="rounded-md" />
            <SkeletonBase height={14} width={40} className="rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  return <SkeletonBase className={className} width={width} height={height} />;
}

// Pre-composed skeleton layouts
export function OutfitCardSkeleton() {
  return <Skeleton variant="card" />;
}

export function OutfitGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <OutfitCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl p-5 bg-white"
            style={{ border: '1px solid var(--petal)' }}
          >
            <SkeletonBase height={14} width="60%" className="rounded-md mb-3" />
            <SkeletonBase height={28} width="40%" className="rounded-md mb-2" />
            <SkeletonBase height={12} width="80%" className="rounded-md" />
          </div>
        ))}
      </div>
      <div className="rounded-2xl p-6 bg-white" style={{ border: '1px solid var(--petal)' }}>
        <SkeletonBase height={200} className="rounded-xl" />
      </div>
    </div>
  );
}
