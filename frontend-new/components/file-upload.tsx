'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, FileIcon, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card } from '@/components/ui/card'

interface FileWithPreview extends File {
    preview?: string
}

interface FileUploadProps {
    onUpload: (files: File[]) => Promise<void>
    accept?: Record<string, string[]>
    maxSize?: number
    maxFiles?: number
    disabled?: boolean
    className?: string
}

export function FileUpload({
    onUpload,
    accept = {
        'application/pdf': ['.pdf'],
        'application/msword': ['.doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
            '.docx',
        ],
        'application/vnd.ms-excel': ['.xls'],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
            '.xlsx',
        ],
        'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    },
    maxSize = 10 * 1024 * 1024, // 10MB
    maxFiles = 10,
    disabled = false,
    className,
}: FileUploadProps) {
    const [files, setFiles] = useState<FileWithPreview[]>([])
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [uploadStatus, setUploadStatus] = useState<
        'idle' | 'uploading' | 'success' | 'error'
    >('idle')

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const filesWithPreview = acceptedFiles.map(file => {
            const fileWithPreview = file as FileWithPreview
            if (file.type.startsWith('image/')) {
                fileWithPreview.preview = URL.createObjectURL(file)
            }
            return fileWithPreview
        })
        setFiles(prev => [...prev, ...filesWithPreview])
        setUploadStatus('idle')
    }, [])

    const { getRootProps, getInputProps, isDragActive, fileRejections } =
        useDropzone({
            onDrop,
            accept,
            maxSize,
            maxFiles,
            disabled: disabled || uploading,
        })

    const removeFile = (index: number) => {
        setFiles(prev => {
            const newFiles = [...prev]
            const removedFile = newFiles[index]
            if (removedFile.preview) {
                URL.revokeObjectURL(removedFile.preview)
            }
            newFiles.splice(index, 1)
            return newFiles
        })
    }

    const handleUpload = async () => {
        if (files.length === 0) return

        setUploading(true)
        setUploadStatus('uploading')
        setProgress(0)

        try {
            // Simulação de progresso
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(interval)
                        return 90
                    }
                    return prev + 10
                })
            }, 200)

            await onUpload(files)

            clearInterval(interval)
            setProgress(100)
            setUploadStatus('success')

            // Limpar arquivos após 2s
            setTimeout(() => {
                setFiles([])
                setProgress(0)
                setUploadStatus('idle')
            }, 2000)
        } catch (error) {
            console.error('Upload error:', error)
            setUploadStatus('error')
        } finally {
            setUploading(false)
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    }

    const getStatusIcon = () => {
        switch (uploadStatus) {
            case 'success':
                return <CheckCircle2 className="h-5 w-5 text-green-500" />
            case 'error':
                return <AlertCircle className="h-5 w-5 text-red-500" />
            default:
                return null
        }
    }

    return (
        <div className={cn('space-y-4', className)}>
            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={cn(
                    'relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                    isDragActive
                        ? 'border-primary bg-primary/5'
                        : 'border-muted-foreground/25 hover:border-primary/50',
                    (disabled || uploading) && 'opacity-50 cursor-not-allowed'
                )}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2">
                    <Upload
                        className={cn(
                            'h-10 w-10',
                            isDragActive ? 'text-primary' : 'text-muted-foreground'
                        )}
                    />
                    <div>
                        <p className="text-sm font-medium">
                            {isDragActive
                                ? 'Solte os arquivos aqui'
                                : 'Arraste arquivos ou clique para selecionar'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Máx. {formatFileSize(maxSize)} por arquivo • Até{' '}
                            {maxFiles} arquivos
                        </p>
                    </div>
                </div>
            </div>

            {/* File Rejections */}
            {fileRejections.length > 0 && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
                    <p className="text-sm font-medium text-destructive mb-2">
                        Arquivos rejeitados:
                    </p>
                    {fileRejections.map(({ file, errors }) => (
                        <div key={file.name} className="text-xs text-destructive/80">
                            <span className="font-medium">{file.name}</span>:{' '}
                            {errors.map(e => e.message).join(', ')}
                        </div>
                    ))}
                </div>
            )}

            {/* File List */}
            {files.length > 0 && (
                <div className="space-y-2">
                    {files.map((file, index) => (
                        <Card key={index} className="p-3">
                            <div className="flex items-center gap-3">
                                {file.preview ? (
                                    <img
                                        src={file.preview}
                                        alt={file.name}
                                        className="h-10 w-10 rounded object-cover"
                                    />
                                ) : (
                                    <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                                        <FileIcon className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatFileSize(file.size)}
                                    </p>
                                </div>
                                {!uploading && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeFile(index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                                {uploading && getStatusIcon()}
                            </div>
                        </Card>
                    ))}

                    {/* Progress Bar */}
                    {uploading && (
                        <div className="space-y-2">
                            <Progress value={progress} />
                            <p className="text-xs text-center text-muted-foreground">
                                {uploadStatus === 'uploading' && `Enviando... ${progress}%`}
                                {uploadStatus === 'success' && 'Upload concluído!'}
                                {uploadStatus === 'error' && 'Erro no upload'}
                            </p>
                        </div>
                    )}

                    {/* Upload Button */}
                    {!uploading && uploadStatus === 'idle' && (
                        <Button
                            onClick={handleUpload}
                            className="w-full"
                            disabled={disabled}
                        >
                            Enviar {files.length} arquivo{files.length !== 1 ? 's' : ''}
                        </Button>
                    )}
                </div>
            )}
        </div>
    )
}
