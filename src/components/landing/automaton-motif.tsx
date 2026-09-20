import { cn } from '@/lib/ui/utils';

const states = [
  { cx: 60, label: 'q0', delay: '0ms' },
  { cx: 160, label: 'q1', delay: '1200ms' },
  { cx: 260, label: 'q2', delay: '2400ms' },
];

export function AutomatonMotif({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 120"
      role="presentation"
      aria-hidden
      focusable="false"
      className={cn('w-full max-w-md', className)}
    >
      <defs>
        <marker
          id="automaton-motif-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L10 5 L0 10 z" className="fill-secondary" />
        </marker>
      </defs>

      <line x1="24" y1="52" x2="40" y2="60" strokeWidth="2" className="stroke-foreground" />
      <line x1="24" y1="68" x2="40" y2="60" strokeWidth="2" className="stroke-foreground" />

      {[
        { x1: 82, x2: 138 },
        { x1: 182, x2: 238 },
      ].map(({ x1, x2 }) => (
        <line
          key={x1}
          x1={x1}
          y1="60"
          x2={x2}
          y2="60"
          strokeWidth="2"
          strokeDasharray="6 6"
          markerEnd="url(#automaton-motif-arrow)"
          className="stroke-secondary animate-edge-dash motion-reduce:animate-none"
        />
      ))}

      {states.map(({ cx, label, delay }) => (
        <g key={label}>
          <circle
            cx={cx}
            cy="60"
            r="22"
            strokeWidth="2"
            style={{ animationDelay: delay }}
            className="fill-muted stroke-foreground animate-node-visit motion-reduce:animate-none"
          />
          <text
            x={cx}
            y="60"
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-foreground font-orbitron text-[11px]"
          >
            {label}
          </text>
        </g>
      ))}

      <circle cx="260" cy="60" r="17" strokeWidth="1.5" className="fill-none stroke-foreground" />
    </svg>
  );
}
