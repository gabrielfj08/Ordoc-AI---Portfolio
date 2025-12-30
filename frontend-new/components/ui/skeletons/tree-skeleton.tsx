import { Skeleton } from '../skeleton'

interface TreeSkeletonProps {
  /**
   * Número de itens raiz
   * @default 5
   */
  items?: number
  /**
   * Mostrar itens aninhados (filhos)
   * @default true
   */
  showNested?: boolean
  /**
   * Mostrar ações no hover
   * @default true
   */
  showActions?: boolean
}

/**
 * Skeleton para árvores de diretórios/documentos
 *
 * @example
 * ```tsx
 * <TreeSkeleton items={6} />
 * <TreeSkeleton items={4} showNested={false} />
 * ```
 */
export function TreeSkeleton({ items = 5, showNested = true, showActions = true }: TreeSkeletonProps) {
  return (
    <div className="space-y-1">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="space-y-1">
          {/* Item raiz */}
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
            {/* Checkbox ou expand icon */}
            <Skeleton className="size-4 rounded shrink-0" />

            {/* Ícone de pasta/arquivo */}
            <Skeleton className="size-9 rounded-lg shrink-0" />

            {/* Nome do item */}
            <div className="flex-1 min-w-0 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>

            {/* Ações */}
            {showActions && (
              <div className="flex items-center gap-1">
                <Skeleton className="size-8 rounded-full" />
                <Skeleton className="size-8 rounded-full" />
                <Skeleton className="size-8 rounded-full" />
              </div>
            )}
          </div>

          {/* Itens aninhados (filhos) */}
          {showNested && i < 2 && (
            <div className="ml-8 space-y-1">
              {Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map((_, j) => (
                <div key={j} className="flex items-center gap-3 p-3 rounded-lg">
                  <Skeleton className="size-4 rounded shrink-0" />
                  <Skeleton className="size-7 rounded shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-36" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
