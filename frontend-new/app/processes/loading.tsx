import { KanbanSkeleton } from '@/components/ui/skeletons'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Loading state para a página de Processos
 * Exibe skeleton de board Kanban
 */
export default function ProcessesLoading() {
  return (
    <div className="container mx-auto p-6 max-w-[1600px]">
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-5 w-96" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-40 rounded-full" />
            <Skeleton className="h-10 w-40 rounded-full" />
          </div>
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-4 flex-wrap">
          <Skeleton className="h-10 flex-1 max-w-md rounded-full" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24 rounded-full" />
          <Skeleton className="h-10 w-24 rounded-full" />
        </div>

        {/* Kanban Board */}
        <KanbanSkeleton columns={5} cardsPerColumn={4} />
      </div>
    </div>
  )
}
