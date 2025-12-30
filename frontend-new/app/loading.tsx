import { CardsSkeleton } from '@/components/ui/skeletons'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Loading global do Next.js App Router
 * Exibido automaticamente durante navegação entre páginas
 */
export default function Loading() {
  return (
    <div className="container mx-auto p-6 max-w-[1600px]">
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Header skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>

        {/* Cards skeleton */}
        <CardsSkeleton count={4} />

        {/* Content skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}
