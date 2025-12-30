'use client'

import { FileText, Calendar, User, Tag, Sparkles } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'

interface Document {
  id: string
  file_name: string
  title?: string
  created_at: string
  file_size?: number
  created_by?: string
  tags?: (string | { id: string; name: string; slug: string; color?: string })[]
  description?: string
  relevance_score?: number
}

interface DocumentPreviewTooltipProps {
  document: Document
  children: React.ReactNode
  disabled?: boolean
}

export function DocumentPreviewTooltip({
  document,
  children,
  disabled = false
}: DocumentPreviewTooltipProps) {
  if (disabled) return <>{children}</>

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A'
    const kb = bytes / 1024
    const mb = kb / 1024
    if (mb >= 1) return `${mb.toFixed(1)} MB`
    return `${kb.toFixed(0)} KB`
  }

  const getFileExtension = (filename?: string) => {
    if (!filename) return 'FILE'
    const parts = filename.split('.')
    return parts.length > 1 ? parts.pop()?.toUpperCase() : 'FILE'
  }

  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent
        side="right"
        align="start"
        sideOffset={10}
        className="w-80 p-0 overflow-hidden border-border/40 shadow-2xl animate-in fade-in-0 zoom-in-95"
      >
        {/* Header com gradiente sutil */}
        <div className="bg-gradient-to-br from-primary/5 to-transparent p-4">
          <div className="flex items-start gap-4">
            <div className="size-12 rounded-xl bg-gradient-to-br from-destructive/20 to-destructive/10 flex items-center justify-center shrink-0 shadow-sm border border-destructive/10">
              <FileText className="size-6 text-destructive" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm text-foreground leading-tight truncate mb-1">
                {document.title || document.file_name}
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-1.5 py-0.5 bg-muted rounded font-bold tracking-wider">
                  {getFileExtension(document.file_name)}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  {formatFileSize(document.file_size)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detalhes com padding */}
        <div className="p-4 pt-0 space-y-4">
          <div className="h-px bg-border/40" />

          <div className="space-y-3">
            {/* Score de Relevância (se existir) */}
            {document.relevance_score && (
              <div className="flex items-center gap-2 text-xs bg-success/5 p-2 rounded-lg border border-success/10">
                <Sparkles className="size-3.5 text-success" />
                <span className="text-success font-semibold">
                  {Math.round(document.relevance_score * 100)}% de relevância
                </span>
              </div>
            )}

            {/* Data de criação */}
            <div className="flex items-center gap-3 text-xs">
              <Calendar className="size-4 text-muted-foreground shrink-0" />
              <div className="flex flex-col">
                <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-tighter">Criado em</span>
                <span className="font-semibold text-foreground">
                  {format(new Date(document.created_at), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                </span>
              </div>
            </div>

            {/* Criador */}
            <div className="flex items-center gap-3 text-xs">
              <User className="size-4 text-muted-foreground shrink-0" />
              <div className="flex flex-col">
                <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-tighter">Proprietário</span>
                <span className="font-semibold text-foreground">{document.created_by || 'Sistema'}</span>
              </div>
            </div>

            {/* Tags */}
            {document.tags && document.tags.length > 0 && (
              <div className="flex items-start gap-3 text-xs">
                <Tag className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="flex flex-wrap gap-1.5">
                  {document.tags.map((tag, index) => (
                    <span
                      key={typeof tag === 'string' ? index : tag.id}
                      className="px-2 py-0.5 bg-orange-600/5 text-primary rounded-md text-[10px] font-bold border border-primary/5"
                    >
                      {typeof tag === 'string' ? tag : tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Descrição */}
            {document.description && (
              <div className="pt-3 border-t border-border/40">
                <p className="text-xs text-muted-foreground leading-relaxed italic">
                  "{document.description}"
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-muted/30 p-3 text-[10px] text-muted-foreground text-center font-medium border-t border-border/40">
          Clique para abrir o painel de visualização completa
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
