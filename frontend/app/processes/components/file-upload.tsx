"use client"

import { useState, useCallback } from 'react'
import { Upload, X, FileText, Image, Video, Music, File } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'

interface FileUploadProps {
    onUpload: (file: File) => Promise<void>
    accept?: string
    maxSize?: number // em MB
    multiple?: boolean
}

export function FileUpload({
    onUpload,
    accept = "*/*",
    maxSize = 10,
    multiple = false
}: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const { toast } = useToast()

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const validateFile = (file: File): boolean => {
        const maxSizeBytes = maxSize * 1024 * 1024

        if (file.size > maxSizeBytes) {
            toast({
                title: 'Arquivo muito grande',
                description: `O arquivo deve ter no máximo ${maxSize}MB`,
                variant: 'destructive',
            })
            return false
        }

        return true
    }

    const handleFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return

        const file = files[0]
        if (!validateFile(file)) return

        setUploading(true)
        setProgress(0)

        try {
            // Simular progresso
            const interval = setInterval(() => {
                setProgress((prev) => Math.min(prev + 10, 90))
            }, 100)

            await onUpload(file)

            clearInterval(interval)
            setProgress(100)

            toast({
                title: 'Sucesso',
                description: 'Arquivo enviado com sucesso',
            })
        } catch (error: any) {
            toast({
                title: 'Erro',
                description: error.message || 'Erro ao enviar arquivo',
                variant: 'destructive',
            })
        } finally {
            setUploading(false)
            setProgress(0)
        }
    }

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        await handleFiles(e.dataTransfer.files)
    }, [onUpload])

    const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        await handleFiles(e.target.files)
    }, [onUpload])

    return (
        <div className="space-y-4">
            <Card
                className={`border-2 border-dashed p-8 text-center transition-colors ${isDragging
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-border hover:border-orange-300'
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="flex flex-col items-center gap-4">
                    <div className="size-16 rounded-full bg-orange-100 flex items-center justify-center">
                        <Upload className="size-8 text-orange-600" />
                    </div>

                    <div>
                        <p className="text-lg font-semibold mb-1">
                            Arraste e solte seu arquivo aqui
                        </p>
                        <p className="text-sm text-muted-foreground">
                            ou clique para selecionar
                        </p>
                    </div>

                    <input
                        type="file"
                        accept={accept}
                        multiple={multiple}
                        onChange={handleFileInput}
                        className="hidden"
                        id="file-upload"
                        disabled={uploading}
                    />

                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-full"
                        onClick={() => document.getElementById('file-upload')?.click()}
                        disabled={uploading}
                    >
                        Selecionar Arquivo
                    </Button>

                    <p className="text-xs text-muted-foreground">
                        Tamanho máximo: {maxSize}MB
                    </p>
                </div>
            </Card>

            {uploading && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span>Enviando...</span>
                        <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>
            )}
        </div>
    )
}

// Componente para exibir ícone baseado no tipo de arquivo
export function FileIcon({ fileType, className = "size-5" }: { fileType: string, className?: string }) {
    if (fileType.startsWith('image/')) {
        return <Image className={className} />
    }
    if (fileType.startsWith('video/')) {
        return <Video className={className} />
    }
    if (fileType.startsWith('audio/')) {
        return <Music className={className} />
    }
    if (fileType.includes('pdf') || fileType.includes('document')) {
        return <FileText className={className} />
    }
    return <File className={className} />
}

// Função auxiliar para formatar tamanho de arquivo
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
