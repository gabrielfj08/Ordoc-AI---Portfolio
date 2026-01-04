'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import {
    Upload,
    X,
    FileIcon,
    CheckCircle2,
    AlertCircle,
    Brain,
    Sparkles,
    Clock,
    AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { analysisApi } from '@/services/intelligence-api'
import { useToast } from '@/hooks/use-toast'

interface FileWithPreview extends File {
    preview?: string
    aiAnalysis?: AIAnalysisResult
    analyzing?: boolean
}

interface AIAnalysisResult {
    documentType: string
    category: string
    urgency: 'low' | 'medium' | 'high' | 'critical'
    confidence: number
    extractedEntities: Array<{
        type: string
        value: string
        confidence: number
    }>
    suggestedTags: string[]
    alerts: Array<{
        severity: 'info' | 'warning' | 'error' | 'critical'
        message: string
    }>
}

interface SmartFileUploadProps {
    onUpload: (files: File[], analysisResults?: AIAnalysisResult[]) => Promise<void>
    accept?: Record<string, string[]>
    maxSize?: number
    maxFiles?: number
    disabled?: boolean
    className?: string
    enableAI?: boolean
    autoAnalyze?: boolean
}

export function SmartFileUpload({
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
    enableAI = true,
    autoAnalyze = true,
}: SmartFileUploadProps) {
    const [files, setFiles] = useState<FileWithPreview[]>([])
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [uploadStatus, setUploadStatus] = useState<
        'idle' | 'uploading' | 'success' | 'error'
    >('idle')
    const { toast } = useToast()

    const analyzeFile = async (file: FileWithPreview): Promise<void> => {
        if (!enableAI) return

        setFiles(prev =>
            prev.map(f => (f.name === file.name ? { ...f, analyzing: true } : f))
        )

        try {
            // Chamar API de análise de IA
            const result = await analysisApi.analyze({
                file: file,
                analysis_types: ['classification', 'extraction', 'urgency'],
            })

            const aiAnalysis: AIAnalysisResult = {
                documentType: result.results?.document_type || 'Desconhecido',
                category: result.results?.extraction?.classifications?.category || 'general',
                urgency: result.results?.extraction?.classifications?.urgency || 'medium',
                confidence: result.confidence || 0,
                extractedEntities: result.results?.extraction?.entities || [],
                suggestedTags: result.results?.suggested_tags || [],
                alerts: result.results?.deliberation?.alerts || [],
            }

            setFiles(prev =>
                prev.map(f =>
                    f.name === file.name
                        ? { ...f, aiAnalysis, analyzing: false }
                        : f
                )
            )

            // Notificar se houver alertas críticos
            const criticalAlerts = aiAnalysis.alerts.filter(
                a => a.severity === 'critical' || a.severity === 'error'
            )
            if (criticalAlerts.length > 0) {
                toast({
                    title: '⚠️ Alertas Detectados',
                    description: `${criticalAlerts.length} alerta(s) crítico(s) encontrado(s) em ${file.name}`,
                    variant: 'destructive',
                })
            }
        } catch (error) {
            console.error('AI analysis error:', error)
            setFiles(prev =>
                prev.map(f =>
                    f.name === file.name ? { ...f, analyzing: false } : f
                )
            )

            toast({
                title: 'Análise de IA falhou',
                description: `Não foi possível analisar ${file.name}. O upload continuará normalmente.`,
                variant: 'default',
            })
        }
    }

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const filesWithPreview = acceptedFiles.map(file => {
                const fileWithPreview = file as FileWithPreview
                if (file.type.startsWith('image/')) {
                    fileWithPreview.preview = URL.createObjectURL(file)
                }
                return fileWithPreview
            })

            setFiles(prev => [...prev, ...filesWithPreview])
            setUploadStatus('idle')

            // Analisar automaticamente se habilitado
            if (enableAI && autoAnalyze) {
                toast({
                    title: '🧠 Análise de IA iniciada',
                    description: `Analisando ${filesWithPreview.length} arquivo(s)...`,
                })

                // Analisar cada arquivo
                for (const file of filesWithPreview) {
                    await analyzeFile(file)
                }
            }
        },
        [enableAI, autoAnalyze]
    )

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

            // Extrair análises de IA
            const aiAnalyses = files.map(f => f.aiAnalysis).filter(Boolean) as AIAnalysisResult[]

            await onUpload(files, aiAnalyses)

            clearInterval(interval)
            setProgress(100)
            setUploadStatus('success')

            toast({
                title: '✅ Upload concluído!',
                description: `${files.length} arquivo(s) enviado(s) com sucesso${
                    aiAnalyses.length > 0
                        ? ` e ${aiAnalyses.length} análise(s) de IA`
                        : ''
                }`,
            })

            // Limpar arquivos após 2s
            setTimeout(() => {
                setFiles([])
                setProgress(0)
                setUploadStatus('idle')
            }, 2000)
        } catch (error) {
            console.error('Upload error:', error)
            setUploadStatus('error')
            toast({
                title: 'Erro no upload',
                description: 'Ocorreu um erro ao enviar os arquivos. Tente novamente.',
                variant: 'destructive',
            })
        } finally {
            setUploading(false)
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
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

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case 'critical':
                return 'bg-red-500/10 text-red-700 border-red-200'
            case 'high':
                return 'bg-orange-500/10 text-orange-700 border-orange-200'
            case 'medium':
                return 'bg-yellow-500/10 text-yellow-700 border-yellow-200'
            case 'low':
                return 'bg-green-500/10 text-green-700 border-green-200'
            default:
                return 'bg-gray-500/10 text-gray-700 border-gray-200'
        }
    }

    const getUrgencyIcon = (urgency: string) => {
        switch (urgency) {
            case 'critical':
            case 'high':
                return <AlertTriangle className="h-3 w-3" />
            case 'medium':
                return <Clock className="h-3 w-3" />
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
                    <div className="relative">
                        <Upload
                            className={cn(
                                'h-10 w-10',
                                isDragActive ? 'text-primary' : 'text-muted-foreground'
                            )}
                        />
                        {enableAI && (
                            <div className="absolute -top-1 -right-1 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full p-1">
                                <Sparkles className="h-3 w-3 text-white" />
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-medium">
                            {isDragActive
                                ? 'Solte os arquivos aqui'
                                : 'Arraste arquivos ou clique para selecionar'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Máx. {formatFileSize(maxSize)} por arquivo • Até {maxFiles}{' '}
                            arquivos
                        </p>
                        {enableAI && (
                            <p className="text-xs text-purple-600 dark:text-purple-400 mt-2 flex items-center gap-1 justify-center">
                                <Brain className="h-3 w-3" />
                                Análise de IA automática habilitada
                            </p>
                        )}
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
                            <div className="space-y-2">
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
                                    {file.analyzing && (
                                        <div className="flex items-center gap-2 text-purple-600">
                                            <Brain className="h-4 w-4 animate-pulse" />
                                            <span className="text-xs">Analisando...</span>
                                        </div>
                                    )}
                                    {!uploading && !file.analyzing && (
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

                                {/* AI Analysis Results */}
                                {file.aiAnalysis && (
                                    <div className="pl-13 space-y-2 border-l-2 border-purple-200 dark:border-purple-800 ml-5">
                                        <div className="flex flex-wrap gap-2">
                                            {/* Document Type */}
                                            <Badge variant="outline" className="text-xs">
                                                {file.aiAnalysis.documentType}
                                            </Badge>

                                            {/* Category */}
                                            <Badge variant="secondary" className="text-xs">
                                                {file.aiAnalysis.category}
                                            </Badge>

                                            {/* Urgency */}
                                            <Badge
                                                className={cn(
                                                    'text-xs flex items-center gap-1',
                                                    getUrgencyColor(file.aiAnalysis.urgency)
                                                )}
                                            >
                                                {getUrgencyIcon(file.aiAnalysis.urgency)}
                                                {file.aiAnalysis.urgency}
                                            </Badge>

                                            {/* Confidence */}
                                            <Badge variant="outline" className="text-xs">
                                                <Brain className="h-3 w-3 mr-1" />
                                                {Math.round(file.aiAnalysis.confidence * 100)}%
                                            </Badge>
                                        </div>

                                        {/* Suggested Tags */}
                                        {file.aiAnalysis.suggestedTags.length > 0 && (
                                            <div className="text-xs text-muted-foreground">
                                                <span className="font-medium">Tags:</span>{' '}
                                                {file.aiAnalysis.suggestedTags.join(', ')}
                                            </div>
                                        )}

                                        {/* Alerts */}
                                        {file.aiAnalysis.alerts.length > 0 && (
                                            <div className="space-y-1">
                                                {file.aiAnalysis.alerts
                                                    .slice(0, 2)
                                                    .map((alert, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={cn(
                                                                'text-xs p-2 rounded',
                                                                alert.severity === 'critical' &&
                                                                    'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300',
                                                                alert.severity === 'error' &&
                                                                    'bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300',
                                                                alert.severity === 'warning' &&
                                                                    'bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300',
                                                                alert.severity === 'info' &&
                                                                    'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                                                            )}
                                                        >
                                                            {alert.message}
                                                        </div>
                                                    ))}
                                                {file.aiAnalysis.alerts.length > 2 && (
                                                    <p className="text-xs text-muted-foreground">
                                                        +{file.aiAnalysis.alerts.length - 2} mais
                                                        alerta(s)
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
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
                        <Button onClick={handleUpload} className="w-full" disabled={disabled}>
                            {enableAI && <Sparkles className="h-4 w-4 mr-2" />}
                            Enviar {files.length} arquivo{files.length !== 1 ? 's' : ''}
                            {enableAI && ' com IA'}
                        </Button>
                    )}
                </div>
            )}
        </div>
    )
}
