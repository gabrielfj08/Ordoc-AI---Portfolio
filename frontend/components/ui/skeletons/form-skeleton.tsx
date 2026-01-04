import { Skeleton } from '../skeleton'

interface FormSkeletonProps {
  /**
   * Número de campos do formulário
   * @default 5
   */
  fields?: number
  /**
   * Mostrar botões de ação
   * @default true
   */
  showActions?: boolean
  /**
   * Layout de 2 colunas
   * @default false
   */
  twoColumns?: boolean
}

/**
 * Skeleton para formulários
 *
 * @example
 * ```tsx
 * <FormSkeleton fields={8} />
 * <FormSkeleton fields={6} twoColumns />
 * ```
 */
export function FormSkeleton({ fields = 5, showActions = true, twoColumns = false }: FormSkeletonProps) {
  return (
    <div className="space-y-6">
      {/* Título do formulário */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>

      {/* Campos */}
      <div className={`space-y-4 ${twoColumns ? 'md:grid md:grid-cols-2 md:gap-4 md:space-y-0' : ''}`}>
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            {/* Label */}
            <Skeleton className="h-4 w-24" />

            {/* Input - varia entre tipos */}
            {i % 4 === 0 ? (
              // Textarea
              <Skeleton className="h-24 w-full rounded-lg" />
            ) : i % 4 === 1 ? (
              // Select
              <Skeleton className="h-10 w-full rounded-lg" />
            ) : i % 4 === 2 ? (
              // Checkbox/Radio group
              <div className="space-y-2">
                <Skeleton className="h-5 w-32 rounded" />
                <Skeleton className="h-5 w-40 rounded" />
                <Skeleton className="h-5 w-28 rounded" />
              </div>
            ) : (
              // Input normal
              <Skeleton className="h-10 w-full rounded-lg" />
            )}

            {/* Helper text (apenas em alguns campos) */}
            {i % 3 === 0 && <Skeleton className="h-3 w-56" />}
          </div>
        ))}
      </div>

      {/* Divisor */}
      <div className="border-t my-6" />

      {/* Botões de ação */}
      {showActions && (
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-24 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>
      )}
    </div>
  )
}
