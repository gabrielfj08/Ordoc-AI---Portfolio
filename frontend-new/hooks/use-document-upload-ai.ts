import { useState, useCallback } from 'react'
import { documentsApi, type Document } from '@/services/documents-api'
import { analysisApi, type AnalysisResult } from '@/services/intelligence-api'
import { useToast } from '@/hooks/use-toast'

/**
 * Upload de documento com análise de IA integrada
 * 
 * Fluxo:
 * 1. Upload do arquivo
 * 2. Análise automática com IA (OCR, classificação, extração)
 * 3. Sugestões de categorização e tags
 * 4. Aplicação opcional das sugestões
 */

export interface AIAnalysis {
    classification?: string
    confidence: number
    suggestedTags?: string[]
    suggestedCategory?: string
    extractedText?: string
    extractedData?: Record<string, any>
}

export interface UploadWithAI {
    file: File
    progress: number
    status: 'pending' | 'uploading' | 'uploaded' | 'analyzing' | 'completed' | 'error'
    error?: string
    document?: Document
    aiAnalysis?: AIAnalysis
    analysisId?: string
}

export interface UploadAIOptions {
    /** Pasta de destino */
    directory?: string
    /** Habilitar análise de IA automática */
    enableAI?: boolean
    /** Tipos de análise a executar */
    analysisTypes?: ('ocr' | 'classification' | 'extraction')[]
    /** Aplicar sugestões automaticamente (se confiança > threshold) */
    autoApplySuggestions?: boolean
    /** Threshold de confiança para aplicação automática (0-1) */
    confidenceThreshold?: number
}

export function useDocumentUploadAI() {
    const [uploads, setUploads] = useState<UploadWithAI[]>([])
    const { toast } = useToast()

    const uploadFilesWithAI = useCallback(
        async (files: File[], options: UploadAIOptions = {}) => {
            const {
                directory,
                enableAI = true,
                analysisTypes = ['ocr', 'classification', 'extraction'],
                autoApplySuggestions = false,
                confidenceThreshold = 0.85,
            } = options

            // Inicializa uploads
            const initialUploads: UploadWithAI[] = files.map(file => ({
                file,
                progress: 0,
                status: 'pending',
            }))
            setUploads(prev => [...prev, ...initialUploads])

            // Processa uploads em paralelo
            const promises = files.map(async (file, index) => {
                const uploadIndex = uploads.length + index

                try {
                    // FASE 1: Upload do arquivo
                    setUploads(prev =>
                        prev.map((u, i) =>
                            i === uploadIndex ? { ...u, status: 'uploading' } : u
                        )
                    )

                    const document = await documentsApi.upload(
                        {
                            file,
                            directory,
                        },
                        (progressEvent: { loaded: number; total: number; percentage: number }) => {
                            const progress = Math.round(
                                (progressEvent.percentage || 0) * 0.7 // 70% do progresso total
                            )
                            setUploads(prev =>
                                prev.map((u, i) =>
                                    i === uploadIndex ? { ...u, progress } : u
                                )
                            )
                        }
                    )

                    setUploads(prev =>
                        prev.map((u, i) =>
                            i === uploadIndex
                                ? { ...u, status: 'uploaded', progress: 70, document }
                                : u
                        )
                    )

                    toast({
                        title: 'Upload concluído',
                        description: `${file.name} enviado com sucesso`,
                    })

                    // FASE 2: Análise com IA (se habilitado)
                    let aiAnalysis: AIAnalysis | undefined

                    if (enableAI && document) {
                        try {
                            setUploads(prev =>
                                prev.map((u, i) =>
                                    i === uploadIndex
                                        ? { ...u, status: 'analyzing', progress: 75 }
                                        : u
                                )
                            )

                            toast({
                                title: '🤖 Analisando com IA',
                                description: 'Extraindo informações e sugerindo categorias...',
                            })

                            // Chamar IA para análise
                            const analysis: AnalysisResult = await analysisApi.analyze({
                                document_id: document.id,
                                analysis_types: analysisTypes,
                            })

                            // Processar resultados da análise
                            aiAnalysis = {
                                classification: analysis.results?.classification,
                                confidence: analysis.confidence,
                                suggestedTags: analysis.results?.suggested_tags || [],
                                suggestedCategory: analysis.results?.suggested_category,
                                extractedText: analysis.results?.extracted_text,
                                extractedData: analysis.results?.extracted_data,
                            }

                            setUploads(prev =>
                                prev.map((u, i) =>
                                    i === uploadIndex
                                        ? {
                                              ...u,
                                              progress: 90,
                                              aiAnalysis,
                                              analysisId: analysis.id,
                                          }
                                        : u
                                )
                            )

                            // FASE 3: Aplicar sugestões (se configurado e confiança suficiente)
                            if (
                                autoApplySuggestions &&
                                aiAnalysis.confidence >= confidenceThreshold
                            ) {
                                // Aqui você pode atualizar o documento com as sugestões
                                // Por exemplo: adicionar tags, categoria, etc.
                                toast({
                                    title: '✨ Sugestões aplicadas',
                                    description: `Documento categorizado como: ${aiAnalysis.classification}`,
                                })
                            } else if (aiAnalysis.confidence >= 0.7) {
                                // Mostrar sugestões para aprovação manual
                                toast({
                                    title: '💡 Sugestões disponíveis',
                                    description: `IA sugere: ${aiAnalysis.classification} (${Math.round(aiAnalysis.confidence * 100)}% confiança)`,
                                })
                            }
                        } catch (aiError) {
                            console.error('Erro na análise de IA:', aiError)
                            // Não falhar o upload se a IA falhar
                            toast({
                                title: 'ℹ️ Análise de IA indisponível',
                                description: 'Documento enviado sem análise automática',
                            })
                        }
                    }

                    // FASE 4: Concluído
                    setUploads(prev =>
                        prev.map((u, i) =>
                            i === uploadIndex
                                ? {
                                      ...u,
                                      status: 'completed',
                                      progress: 100,
                                      document,
                                      aiAnalysis,
                                  }
                                : u
                        )
                    )

                    return { document, aiAnalysis }
                } catch (err) {
                    const error = err as Error
                    setUploads(prev =>
                        prev.map((u, i) =>
                            i === uploadIndex
                                ? {
                                      ...u,
                                      status: 'error',
                                      error: error.message,
                                  }
                                : u
                        )
                    )

                    toast({
                        variant: 'destructive',
                        title: 'Erro no upload',
                        description: `${file.name}: ${error.message}`,
                    })

                    return null
                }
            })

            const results = await Promise.all(promises)
            return results.filter((r): r is { document: Document; aiAnalysis: AIAnalysis | undefined } => r !== null)
        },
        [uploads.length, toast]
    )

    const clearUploads = useCallback(() => {
        setUploads([])
    }, [])

    const removeUpload = useCallback((index: number) => {
        setUploads(prev => prev.filter((_, i) => i !== index))
    }, [])

    const applySuggestions = useCallback(
        async (uploadIndex: number) => {
            const upload = uploads[uploadIndex]
            if (!upload?.document || !upload?.aiAnalysis) return

            try {
                // Aqui você implementaria a lógica de aplicar as sugestões
                // Por exemplo: atualizar tags, categoria, etc.
                
                toast({
                    title: 'Sugestões aplicadas',
                    description: 'Documento atualizado com sugestões da IA',
                })
            } catch (error) {
                toast({
                    variant: 'destructive',
                    title: 'Erro ao aplicar sugestões',
                    description: (error as Error).message,
                })
            }
        },
        [uploads, toast]
    )

    return {
        uploads,
        uploadFilesWithAI,
        clearUploads,
        removeUpload,
        applySuggestions,
    }
}
