'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  emoji?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  emoji,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  className = '',
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`text-center py-16 px-6 ${className}`}
    >
      <div
        className="w-20 h-20 rounded-[28px] flex items-center justify-center mx-auto mb-6"
        style={{
          background: 'linear-gradient(135deg, var(--bloom), rgba(201, 169, 110, 0.1))',
          border: '1.5px dashed var(--petal)',
        }}
      >
        {emoji ? (
          <span className="text-3xl">{emoji}</span>
        ) : Icon ? (
          <Icon size={32} style={{ color: 'var(--rose)' }} />
        ) : (
          <span className="text-3xl">✨</span>
        )}
      </div>

      <h3
        className="text-xl font-display font-semibold mb-2"
        style={{ color: 'var(--ink)' }}
      >
        {title}
      </h3>

      {description && (
        <p
          className="text-sm max-w-sm mx-auto mb-8 leading-relaxed"
          style={{ color: 'var(--ink-light)' }}
        >
          {description}
        </p>
      )}

      {actionLabel && (
        actionHref ? (
          <a href={actionHref} className="btn-gold !text-xs !py-3.5 !px-8 tracking-[0.15em]">
            {actionLabel}
          </a>
        ) : onAction ? (
          <button onClick={onAction} className="btn-gold !text-xs !py-3.5 !px-8 tracking-[0.15em]">
            {actionLabel}
          </button>
        ) : null
      )}
    </motion.div>
  );
}
