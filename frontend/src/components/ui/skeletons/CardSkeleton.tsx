import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface CardSkeletonProps {
  cards?: number;
  showHeader?: boolean;
  showFooter?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

/**
 * Skeleton placeholder for card layouts
 * Used for dashboard cards, detail views, and list items
 *
 * @param cards - Number of cards to display (default: 3)
 * @param showHeader - Whether to show card header (default: true)
 * @param showFooter - Whether to show card footer (default: false)
 * @param variant - Card complexity level (default: 'default')
 */
export function CardSkeleton({
  cards = 3,
  showHeader = true,
  showFooter = false,
  variant = 'default'
}: CardSkeletonProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: cards }).map((_, i) => (
        <Card key={`card-${i}`}>
          {showHeader && (
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
          )}

          <CardContent className="space-y-3">
            {variant === 'compact' && (
              <>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </>
            )}

            {variant === 'default' && (
              <>
                <Skeleton className="h-20 w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
              </>
            )}

            {variant === 'detailed' && (
              <>
                <Skeleton className="h-32 w-full rounded-md" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </>
            )}

            {showFooter && (
              <div className="pt-3 border-t flex justify-between">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
