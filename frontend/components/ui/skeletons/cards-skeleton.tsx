import { Skeleton } from '../skeleton'

interface CardsSkeletonProps {
  /**
   * Número de cards a exibir
   * @default 4
   */
  count?: number
  /**
   * Layout do grid
   * @default 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
   */
  gridCols?: string
}

/**
 * Skeleton para grids de cards (métricas, estatísticas, etc)
 *
 * @example
 * ```tsx
 * <CardsSkeleton count={4} />
 * <CardsSkeleton count={3} gridCols="grid-cols-3" />
 * ```
 */
export function CardsSkeleton({ count = 4, gridCols = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' }: CardsSkeletonProps) {
  return (
    <div className={`grid gap-5 ${gridCols}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-6 rounded-lg border border-border/50 space-y-3">
          {/* Icon + Badge */}
          <div className="flex items-center justify-between">
            <Skeleton className="size-12 rounded-2xl" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>

          {/* Value */}
          <Skeleton className="h-8 w-20" />

          {/* Label */}
          <Skeleton className="h-4 w-32" />

          {/* Target */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}
