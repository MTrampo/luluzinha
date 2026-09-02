import { Skeleton } from "@/components/ui/skeleton";

interface CustomerCardSkeletonProps {
  count?: number;
}

export function CustomerCardSkeleton({ count = 4 }: CustomerCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex gap-4 items-center border border-purple-50 bg-white/60 p-4 rounded-md shadow-xs animate-pulse"
        >
          {/* Avatar Skeleton */}
          <Skeleton className="w-12 h-12 rounded-full shrink-0 bg-purple-100/70" />

          {/* Info Skeleton */}
          <div className="flex flex-col flex-1 gap-2 min-w-0">
            <Skeleton className="h-4 w-3/4 rounded-md bg-purple-100/70" />
            <Skeleton className="h-3 w-1/2 rounded-md bg-purple-50" />
          </div>

          {/* Action icon Skeleton */}
          <Skeleton className="w-10 h-10 rounded-full shrink-0 bg-purple-50" />
        </div>
      ))}
    </>
  );
}
