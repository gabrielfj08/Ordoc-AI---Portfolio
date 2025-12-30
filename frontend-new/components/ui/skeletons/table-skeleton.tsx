import { Skeleton } from '../skeleton'

interface TableSkeletonProps {
  /**
   * Número de linhas a exibir
   * @default 5
   */
  rows?: number
  /**
   * Número de colunas a exibir
   * @default 5
   */
  columns?: number
  /**
   * Mostrar cabeçalho
   * @default true
   */
  showHeader?: boolean
  /**
   * Mostrar filtros e busca
   * @default false
   */
  showFilters?: boolean
}

/**
 * Skeleton para tabelas de dados
 *
 * @example
 * ```tsx
 * <TableSkeleton rows={10} columns={6} />
 * <TableSkeleton rows={5} showFilters />
 * ```
 */
export function TableSkeleton({
  rows = 5,
  columns = 5,
  showHeader = true,
  showFilters = false
}: TableSkeletonProps) {
  return (
    <div className="space-y-4">
      {/* Filtros e busca */}
      {showFilters && (
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-10 flex-1 max-w-md" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
          </div>
        </div>
      )}

      {/* Tabela */}
      <div className="rounded-lg border border-border/50 overflow-hidden">
        {/* Header */}
        {showHeader && (
          <div className="border-b bg-muted/50">
            <div className="grid gap-4 p-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
              {Array.from({ length: columns }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-20" />
              ))}
            </div>
          </div>
        )}

        {/* Rows */}
        <div className="divide-y">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid gap-4 p-4 hover:bg-muted/30 transition-colors"
              style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton
                  key={colIndex}
                  className={`h-4 ${colIndex === 0 ? 'w-full' : 'w-3/4'}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-40" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-24 rounded-full" />
        </div>
      </div>
    </div>
  )
}
