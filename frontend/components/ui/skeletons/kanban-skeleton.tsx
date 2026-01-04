import { Skeleton } from '../skeleton'

interface KanbanSkeletonProps {
  /**
   * Número de colunas
   * @default 4
   */
  columns?: number
  /**
   * Cards por coluna
   * @default 3
   */
  cardsPerColumn?: number
}

/**
 * Skeleton para boards Kanban (workflows, processos, etc)
 *
 * @example
 * ```tsx
 * <KanbanSkeleton columns={5} cardsPerColumn={4} />
 * <KanbanSkeleton columns={3} />
 * ```
 */
export function KanbanSkeleton({ columns = 4, cardsPerColumn = 3 }: KanbanSkeletonProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {Array.from({ length: columns }).map((_, colIndex) => (
        <div
          key={colIndex}
          className="flex-shrink-0 w-80 bg-muted/20 rounded-lg p-4 space-y-3"
        >
          {/* Header da coluna */}
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="size-8 rounded-full" />
          </div>

          {/* Cards */}
          <div className="space-y-3">
            {Array.from({ length: cardsPerColumn }).map((_, cardIndex) => (
              <div
                key={cardIndex}
                className="bg-background rounded-lg border border-border/50 p-4 space-y-3"
              >
                {/* Título do card */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>

                {/* Tags */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>

                {/* Footer - meta info */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}
          </div>

          {/* Botão adicionar */}
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
      ))}
    </div>
  )
}
