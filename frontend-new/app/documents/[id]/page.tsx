'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowLeft, Download, Share2, Star, Trash2, FileText, Calendar, User, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Document {
    id: string
    name: string
    file_name: string
    file_type: string
    file_size: number
    file: string
    created_at: string
    updated_at: string
    created_by?: string
    tags?: { id: string; name: string; color?: string }[]
    description?: string
    is_starred?: boolean
}

export default function DocumentViewPage() {
    const params = useParams()
    const router = useRouter()
    const documentId = params.id as string

    const [document, setDocument] = useState<Document | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (documentId) {
            fetchDocument()
        }
    }, [documentId])

    const fetchDocument = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ordoc-air/documents/${documentId}/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            })

            if (!response.ok) {
                throw new Error('Falha ao carregar documento')
            }

            const data = await response.json()
            setDocument(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido')
        } finally {
            setLoading(false)
        }
    }

    const formatFileSize = (bytes: number) => {
        const kb = bytes / 1024
        const mb = kb / 1024
        if (mb >= 1) return `${mb.toFixed(1)} MB`
        return `${kb.toFixed(0)} KB`
    }

    if (loading) {
        return (
            <div className="h-screen flex flex-col">
                {/* Header Skeleton */}
                <div className="border-b bg-background p-4">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <div className="flex-1">
                            <Skeleton className="h-6 w-64 mb-2" />
                            <Skeleton className="h-4 w-96" />
                        </div>
                    </div>
                </div>

                {/* Content Skeleton */}
                <div className="flex-1 p-8">
                    <Skeleton className="h-full w-full rounded-lg" />
                </div>
            </div>
        )
    }

    if (error || !document) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-center">
                    <FileText className="size-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h2 className="text-2xl font-bold mb-2">Falha ao carregar documento</h2>
                    <p className="text-muted-foreground mb-6">{error || 'Documento não encontrado'}</p>
                    <Button onClick={() => router.push('/documents')}>
                        <ArrowLeft className="size-4 mr-2" />
                        Voltar para Documentos
                    </Button>
                </div>
            </div>
        )
    }

    const isPDF = document.file_type?.toLowerCase() === 'application/pdf' || document.file_name?.endsWith('.pdf')

    return (
        <div className="h-screen flex flex-col bg-background">
            {/* Header */}
            <div className="border-b bg-background p-4 shrink-0">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push('/documents')}
                        className="shrink-0"
                    >
                        <ArrowLeft className="size-5" />
                    </Button>

                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl font-bold truncate">{document.name || document.file_name}</h1>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                            <Badge variant="secondary" className="text-xs">
                                {document.file_name?.split('.').pop()?.toUpperCase() || 'FILE'}
                            </Badge>
                            <span>{formatFileSize(document.file_size)}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <Calendar className="size-3" />
                                {format(new Date(document.created_at), "dd 'de' MMM, yyyy", { locale: ptBR })}
                            </span>
                            {document.created_by && (
                                <>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <User className="size-3" />
                                        {document.created_by}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <Button variant="ghost" size="icon">
                            <Star className={`size-5 ${document.is_starred ? 'fill-warning text-warning' : ''}`} />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Share2 className="size-5" />
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                            <a href={document.file} download>
                                <Download className="size-5" />
                            </a>
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Trash2 className="size-5" />
                        </Button>
                    </div>
                </div>

                {/* Tags */}
                {document.tags && document.tags.length > 0 && (
                    <div className="flex items-center gap-2 mt-3">
                        <Tag className="size-4 text-muted-foreground" />
                        <div className="flex flex-wrap gap-1.5">
                            {document.tags.map((tag) => (
                                <Badge
                                    key={tag.id}
                                    variant="secondary"
                                    className="text-xs"
                                    style={{ backgroundColor: tag.color ? `${tag.color}20` : undefined }}
                                >
                                    {tag.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Document Viewer */}
            <div className="flex-1 overflow-hidden">
                {isPDF ? (
                    <iframe
                        src={document.file}
                        className="w-full h-full border-0"
                        title={document.file_name}
                    />
                ) : (
                    <div className="h-full flex items-center justify-center p-8">
                        <div className="text-center max-w-md">
                            <FileText className="size-20 mx-auto mb-4 text-muted-foreground opacity-50" />
                            <h3 className="text-lg font-semibold mb-2">Visualização não disponível</h3>
                            <p className="text-muted-foreground mb-6">
                                Este tipo de arquivo não pode ser visualizado diretamente no navegador.
                                Faça o download para abrir em seu computador.
                            </p>
                            <Button asChild>
                                <a href={document.file} download>
                                    <Download className="size-4 mr-2" />
                                    Baixar Arquivo
                                </a>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
