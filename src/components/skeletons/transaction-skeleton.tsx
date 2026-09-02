import { Skeleton } from "@/components/ui/skeleton";

interface TransactionSkeletonProps {
  count?: number;
}

export function TransactionSkeleton({ count = 3 }: TransactionSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-3.5 sm:p-4 animate-pulse"
        >
          <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
            {/* Avatar Skeleton */}
            <Skeleton className="w-9 h-9 sm:w-10 sm:h-10 rounded-full shrink-0 bg-purple-100/70" />
            
            {/* Customer & Type Skeleton */}
            <div className="flex flex-col gap-1.5 min-w-0">
              <Skeleton className="h-4 w-28 sm:w-36 rounded-md bg-purple-100/70" />
              <Skeleton className="h-2.5 w-20 sm:w-24 rounded-md bg-purple-50" />
            </div>
          </div>

          {/* Amount & Date Skeleton */}
          <div className="flex flex-col items-end gap-1.5 shrink-0 ml-2">
            <Skeleton className="h-4 w-16 sm:w-20 rounded-md bg-purple-100/70" />
            <Skeleton className="h-2.5 w-12 sm:w-16 rounded-md bg-purple-50" />
          </div>
        </div>
      ))}
    </>
  );
}
