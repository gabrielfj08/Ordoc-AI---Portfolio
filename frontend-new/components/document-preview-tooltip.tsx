'use client'

import { useState, useRef, useEffect } from 'react'
import { FileText, Calendar, User, Tag, FileType } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Document {
  id: string
  file_name: string
  title?: string
  created_at: string
  file_size?: number
  created_by?: string
  tags?: string[]
  description?: string
}

interface DocumentPreviewTooltipProps {
  document: Document
  children: React.ReactNode
  disabled?: boolean
}

/**
 * Componente que exibe preview detalhado de documento ao fazer hover
 * 
 * @example
 * ```tsx
 * <DocumentPreviewTooltip document={doc}>
 *   <div>Contrato.pdf</div>
 * </DocumentPreviewTooltip>
 * ```
 */
export function DocumentPreviewTooltip({ 
  document, 
  children, 
  disabled = false 
}: DocumentPreviewTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const timeoutRef = useRef<NodeJS.Timeout>()
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (disabled) return

    // Delay de 500ms antes de mostrar
    timeoutRef.current = setTimeout(() => {
      const rect = triggerRef.current?.getBoundingClientRect()
      if (rect) {
        // Posicionar à direita do elemento
        setPosition({
          x: rect.right + 12,
          y: rect.top,
        })
      }
      setIsVisible(true)
    }, 500)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A'
    const kb = bytes / 1024
    const mb = kb / 1024
    if (mb >= 1) return `${mb.toFixed(1)} MB`
    return `${kb.toFixed(0)} KB`
  }

  const getFileExtension = (filename: string) => {
    const parts = filename.split('.')
    return parts.length > 1 ? parts.pop()?.toUpperCase() : 'FILE'
  }

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>

      {isVisible && (
        <div
          className="fixed z-50 w-80 bg-popover border rounded-lg shadow-xl p-4 animate-in fade-in-0 zoom-in-95"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={handleMouseLeave}
        >
          {/* Header com nome e extensão */}
          <div className="flex items-start gap-3 mb-3">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FileText className="size-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm truncate">
                {document.title || document.file_name}
              </h4>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs px-1.5 py-0.5 bg-muted rounded font-medium">
                  {getFileExtension(document.file_name)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatFileSize(document.file_size)}
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border mb-3" />

          {/* Detalhes */}
          <div className="space-y-2.5">
            {/* Data de criação */}
            <div className="flex items-center gap-2 text-xs">
              <Calendar className="size-3.5 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Criado em:</span>
              <span className="font-medium">
                {format(new Date(document.created_at), "dd 'de' MMMM, yyyy", { locale: ptBR })}
              </span>
            </div>

            {/* Criador */}
            {document.created_by && (
              <div className="flex items-center gap-2 text-xs">
                <User className="size-3.5 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">Por:</span>
                <span className="font-medium">{document.created_by}</span>
              </div>
            )}

            {/* Tags */}
            {document.tags && document.tags.length > 0 && (
              <div className="flex items-start gap-2 text-xs">
                <Tag className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="flex flex-wrap gap-1">
                  {document.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-primary/10 text-primary rounded-md text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                  {document.tags.length > 3 && (
                    <span className="text-muted-foreground">
                      +{document.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Descrição */}
            {document.description && (
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground line-clamp-3">
                  {document.description}
                </p>
              </div>
            )}
          </div>

          {/* Footer hint */}
          <div className="mt-3 pt-3 border-t text-xs text-muted-foreground text-center">
            Clique para ver detalhes completos
          </div>
        </div>
      )}
    </>
  )
}
