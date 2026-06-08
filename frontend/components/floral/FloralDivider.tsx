'use client';

interface FloralDividerProps {
  className?: string;
  spacing?: 'sm' | 'md' | 'lg';
}

export default function FloralDivider({ className = '', spacing = 'md' }: FloralDividerProps) {
  const marginClass = {
    sm: 'my-6',
    md: 'my-12',
    lg: 'my-20'
  }[spacing];

  return (
    <div className={`${marginClass} flex items-center justify-center ${className}`}>
      <div className="h-[1px] w-12 bg-[var(--border)]"></div>
    </div>
  );
}
