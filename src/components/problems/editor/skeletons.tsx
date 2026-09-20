import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton, SkeletonRows } from '@/components/ui/skeleton';

export function UserProblemsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10" />
      <Separator />
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <SkeletonRows rows={6} className="h-12" />
      </div>
    </div>
  );
}

export function ProblemFormSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-10 w-full" />
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Skeleton className="h-10 md:col-span-3" />
            <Skeleton className="h-10" />
          </div>
          <Skeleton className="h-64" />
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
