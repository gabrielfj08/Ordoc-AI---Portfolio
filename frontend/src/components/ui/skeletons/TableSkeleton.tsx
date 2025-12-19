import { Skeleton } from '@/components/ui/skeleton';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
}

/**
 * Skeleton placeholder for table layouts
 * Used during data loading to provide visual feedback
 *
 * @param rows - Number of table rows to display (default: 10)
 * @param columns - Number of columns (default: 4)
 * @param showHeader - Whether to show header skeleton (default: true)
 */
export function TableSkeleton({
  rows = 10,
  columns = 4,
  showHeader = true
}: TableSkeletonProps) {
  return (
    <div className="space-y-3">
      {/* Table Header */}
      {showHeader && (
        <div className="flex gap-4 pb-2 border-b">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton
              key={`header-${i}`}
              className="h-10 flex-1"
            />
          ))}
        </div>
      )}

      {/* Table Rows */}
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={`row-${i}`} className="flex gap-4 items-center">
            {Array.from({ length: columns }).map((_, j) => (
              <Skeleton
                key={`cell-${i}-${j}`}
                className="h-12 flex-1"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
