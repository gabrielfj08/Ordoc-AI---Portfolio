import { TreeSkeleton } from '@/components/ui/skeletons'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Loading state para a página de Documentos
 * Exibe skeleton de árvore de arquivos
 */
export default function DocumentsLoading() {
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
            <Skeleton className="h-10 w-32 rounded-full" />
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 flex-1 max-w-md rounded-full" />
          <Skeleton className="h-10 w-24 rounded-full" />
          <Skeleton className="h-10 w-24 rounded-full" />
        </div>

        {/* Árvore de documentos */}
        <TreeSkeleton items={8} showNested={true} showActions={true} />
      </div>
    </div>
  )
}
