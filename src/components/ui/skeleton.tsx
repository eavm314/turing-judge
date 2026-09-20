import { cn } from '@/lib/ui/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-neutral-foreground/10', className)}
      {...props}
    />
  );
}

function SkeletonRows({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} className={cn('h-10', className)} />
      ))}
    </div>
  );
}

export { Skeleton, SkeletonRows };
