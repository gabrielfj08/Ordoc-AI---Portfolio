import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface FormSkeletonProps {
  fields?: number;
  showTitle?: boolean;
  showButtons?: boolean;
  columns?: 1 | 2;
}

/**
 * Skeleton placeholder for form layouts
 * Used during form initialization or data loading
 *
 * @param fields - Number of form fields to display (default: 6)
 * @param showTitle - Whether to show form title (default: true)
 * @param showButtons - Whether to show action buttons (default: true)
 * @param columns - Form layout columns (default: 1)
 */
export function FormSkeleton({
  fields = 6,
  showTitle = true,
  showButtons = true,
  columns = 1
}: FormSkeletonProps) {
  const gridClass = columns === 2 ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6';

  return (
    <Card className="w-full">
      {showTitle && (
        <CardHeader>
          <Skeleton className="h-8 w-1/3 mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
      )}

      <CardContent>
        <div className={gridClass}>
          {Array.from({ length: fields }).map((_, i) => (
            <div key={`field-${i}`} className="space-y-2">
              {/* Field Label */}
              <Skeleton className="h-4 w-1/4" />

              {/* Field Input */}
              <Skeleton className="h-10 w-full" />

              {/* Optional helper text (appears on some fields) */}
              {i % 3 === 0 && (
                <Skeleton className="h-3 w-3/4" />
              )}
            </div>
          ))}
        </div>

        {showButtons && (
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
