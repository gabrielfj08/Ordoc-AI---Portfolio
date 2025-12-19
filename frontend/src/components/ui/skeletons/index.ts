/**
 * Modern Skeleton Components
 *
 * These components replace the legacy LoadingScreen with instant,
 * context-aware loading states using shadcn/ui Skeleton primitives.
 *
 * Usage:
 * ```tsx
 * import { Suspense } from 'react';
 * import { TableSkeleton } from '@/components/ui/skeletons';
 *
 * <Suspense fallback={<TableSkeleton rows={10} />}>
 *   <UsersTable />
 * </Suspense>
 * ```
 */

export { TableSkeleton } from './TableSkeleton';
export { CardSkeleton } from './CardSkeleton';
export { FormSkeleton } from './FormSkeleton';
export { TreeSkeleton } from './TreeSkeleton';
