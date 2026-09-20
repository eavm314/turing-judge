'use client';

import { type ReactNode } from 'react';

import { useInView } from '@/hooks/use-in-view';
import { cn } from '@/lib/ui/utils';

// No horizontal offsets: translating a full-width child widens the document and
// breaks the zero-horizontal-overflow guarantee the mobile suite asserts.
const hiddenOffsets = {
  up: 'translate-y-6',
  down: '-translate-y-6',
  zoom: 'scale-[0.97]',
  none: '',
} as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  from?: keyof typeof hiddenOffsets;
};

export function Reveal({ children, className, delay = 0, from = 'up' }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      data-testid="reveal"
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        'transition duration-700 ease-out',
        inView ? 'translate-y-0 scale-100 opacity-100' : cn('opacity-0', hiddenOffsets[from]),
        'motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:transition-none',
        className,
      )}
    >
      {children}
    </div>
  );
}
