'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`shimmer rounded animate-pulse bg-ivory-dark ${className}`} />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse select-none w-full">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-white border border-border rounded-2xl p-5 flex flex-col justify-between">
            <div className="h-4 bg-ivory-dark w-1/2 rounded" />
            <div className="h-8 bg-ivory-dark w-2/3 rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        <div className="lg:col-span-8 space-y-4">
          <div className="h-10 bg-white border border-border w-1/3 rounded-lg" />
          <div className="h-40 bg-white border border-border rounded-2xl" />
          <div className="h-40 bg-white border border-border rounded-2xl" />
        </div>
        <div className="lg:col-span-4">
          <div className="h-80 bg-white border border-border rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
