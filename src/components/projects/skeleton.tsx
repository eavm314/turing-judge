import { Separator } from '@/components/ui/separator';
import { Skeleton, SkeletonRows } from '@/components/ui/skeleton';

export function ProjectsSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-[130px]" />
      </div>
      <Separator />
      <Skeleton className="h-5 w-32" />
      <SkeletonRows rows={6} className="h-12" />
    </div>
  );
}
