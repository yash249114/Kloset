'use client';

import { ReactNode } from 'react';

interface PetalBackgroundProps {
  children?: ReactNode;
}

export default function PetalBackground({ children }: PetalBackgroundProps) {
  return <>{children}</>;
}
