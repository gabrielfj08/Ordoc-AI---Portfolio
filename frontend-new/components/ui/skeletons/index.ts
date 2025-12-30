/**
 * Skeleton Components
 *
 * Componentes reutilizáveis de skeleton para diferentes layouts.
 * Todos baseados no componente Skeleton do shadcn/ui.
 *
 * @example
 * ```tsx
 * import { TableSkeleton, CardsSkeleton } from '@/components/ui/skeletons'
 *
 * // Em páginas com Suspense
 * <Suspense fallback={<TableSkeleton rows={10} />}>
 *   <DataTable />
 * </Suspense>
 * ```
 */

export { CardsSkeleton } from './cards-skeleton'
export { TableSkeleton } from './table-skeleton'
export { TreeSkeleton } from './tree-skeleton'
export { FormSkeleton } from './form-skeleton'
export { KanbanSkeleton } from './kanban-skeleton'
