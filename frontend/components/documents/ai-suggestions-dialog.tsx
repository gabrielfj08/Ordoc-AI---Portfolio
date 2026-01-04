'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Brain, CheckCircle2, XCircle, AlertCircle, Tag, Folder, FileText, Zap } from 'lucide-react'
import type { AnalysisResult } from '@/services/intelligence-api'
import type { Document } from '@/services/documents-api'

interface AISuggestionsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    analysis: AnalysisResult
    document: Document
    documentName: string
    onApply: (suggestions: ApplySuggestionsData) => Promise<void>
    onReject: () => void
}

export interface ApplySuggestionsData {
    classification?: boolean
    category?: string
    tags?: string[]
    extractedData?: Record<string, any>
}

export function AISuggestionsDialog({
    open,
    onOpenChange,
    analysis,
    document,
    documentName,
    onApply,
    onReject,
}: AISuggestionsDialogProps) {
    const [loading, setLoading] = useState(false)
    const [selectedSuggestions, setSelectedSuggestions] = useState<ApplySuggestionsData>(() => {
        // Auto-selecionar sugestões com alta confiança
        const autoSelect: ApplySuggestionsData = {}
        
        if (analysis.confidence >= 0.85 && analysis.results?.classification) {
            autoSelect.classification = true
        }
        
        if (analysis.confidence >= 0.7 && analysis.results?.suggested_category) {
            autoSelect.category = analysis.results.suggested_category
        }
        
        if (analysis.confidence >= 0.7 && analysis.results?.suggested_tags) {
            autoSelect.tags = analysis.results.suggested_tags
        }
        
        return autoSelect
    })

    const confidenceLevel =
        analysis.confidence >= 0.85 ? 'high' : analysis.confidence >= 0.7 ? 'medium' : 'low'
    const confidenceColor =
        confidenceLevel === 'high' ? 'text-success' : confidenceLevel === 'medium' ? 'text-warning' : 'text-destructive'
    const confidenceLabel =
        confidenceLevel === 'high' ? 'Alta Confiança' : confidenceLevel === 'medium' ? 'Confiança Média' : 'Baixa Confiança'

    const handleApply = async () => {
        setLoading(true)
        try {
            await onApply(selectedSuggestions)
            onOpenChange(false)
        } catch (error) {
            console.error('Erro ao aplicar sugestões:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleReject = () => {
        onReject()
        onOpenChange(false)
    }

    const toggleTag = (tag: string) => {
        setSelectedSuggestions(prev => {
            const currentTags = prev.tags || []
            const newTags = currentTags.includes(tag)
                ? currentTags.filter(t => t !== tag)
                : [...currentTags, tag]
            return { ...prev, tags: newTags }
        })
    }

    const hasAnySuggestions = 
        analysis.results?.classification ||
        analysis.results?.suggested_category ||
        (analysis.results?.suggested_tags && analysis.results.suggested_tags.length > 0) ||
        (analysis.results?.extracted_data && Object.keys(analysis.results.extracted_data).length > 0)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                            <Brain className="size-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <DialogTitle className="text-lg">Sugestões da Inteligência Artificial</DialogTitle>
                            <DialogDescription className="mt-1">
                                <strong>{documentName}</strong> foi analisado automaticamente
                            </DialogDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className={`${confidenceColor} border-current`}>
                                <Zap className="size-3 mr-1" />
                                {Math.round(analysis.confidence * 100)}%
                            </Badge>
                        </div>
                    </div>
                </DialogHeader>

                {!hasAnySuggestions ? (
                    <div className="text-center py-12">
                        <AlertCircle className="size-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-semibold text-lg mb-2">Nenhuma sugestão disponível</h3>
                        <p className="text-sm text-muted-foreground">
                            A análise foi concluída, mas não foram geradas sugestões automáticas
                        </p>
                    </div>
                ) : (
                    <Tabs defaultValue="suggestions" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="suggestions">Sugestões</TabsTrigger>
                            <TabsTrigger value="analysis">Análise Completa</TabsTrigger>
                        </TabsList>

                        <TabsContent value="suggestions" className="mt-4">
                            <ScrollArea className="h-[400px] pr-4">
                                <div className="space-y-5">
                                    {/* Confiança da análise */}
                                    <div className="p-4 bg-muted/50 rounded-xl">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium">Nível de Confiança</span>
                                            <span className={`text-sm font-bold ${confidenceColor}`}>
                                                {confidenceLabel}
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full ${
                                                    confidenceLevel === 'high' ? 'bg-success' :
                                                    confidenceLevel === 'medium' ? 'bg-warning' : 'bg-destructive'
                                                } transition-all`}
                                                style={{ width: `${analysis.confidence * 100}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            {confidenceLevel === 'high' && '✓ As sugestões são altamente confiáveis'}
                                            {confidenceLevel === 'medium' && '⚠ Revise as sugestões antes de aplicar'}
                                            {confidenceLevel === 'low' && '⚠ Baixa confiança - verifique manualmente'}
                                        </p>
                                    </div>

                                    {/* Classificação */}
                                    {analysis.results?.classification && (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-base font-semibold flex items-center gap-2">
                                                    <FileText className="size-4 text-blue-500" />
                                                    Tipo de Documento
                                                </Label>
                                                <Checkbox
                                                    checked={selectedSuggestions.classification}
                                                    onCheckedChange={checked =>
                                                        setSelectedSuggestions(prev => ({
                                                            ...prev,
                                                            classification: checked as boolean,
                                                        }))
                                                    }
                                                />
                                            </div>
                                            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
                                                <p className="font-medium text-blue-900 dark:text-blue-100">
                                                    {analysis.results.classification}
                                                </p>
                                                {analysis.results.classification_confidence && (
                                                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                                        Confiança: {Math.round(analysis.results.classification_confidence * 100)}%
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Categoria */}
                                    {analysis.results?.suggested_category && (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-base font-semibold flex items-center gap-2">
                                                    <Folder className="size-4 text-purple-500" />
                                                    Categoria Sugerida
                                                </Label>
                                                <Checkbox
                                                    checked={!!selectedSuggestions.category}
                                                    onCheckedChange={checked =>
                                                        setSelectedSuggestions(prev => ({
                                                            ...prev,
                                                            category: checked ? analysis.results?.suggested_category : undefined,
                                                        }))
                                                    }
                                                />
                                            </div>
                                            <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-xl border border-purple-200 dark:border-purple-800">
                                                <p className="font-medium text-purple-900 dark:text-purple-100">
                                                    {analysis.results.suggested_category}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Tags */}
                                    {analysis.results?.suggested_tags && analysis.results.suggested_tags.length > 0 && (
                                        <div className="space-y-3">
                                            <Label className="text-base font-semibold flex items-center gap-2">
                                                <Tag className="size-4 text-orange-500" />
                                                Tags Sugeridas
                                                <span className="text-xs font-normal text-muted-foreground">
                                                    (clique para selecionar/desselecionar)
                                                </span>
                                            </Label>
                                            <div className="flex flex-wrap gap-2">
                                                {analysis.results.suggested_tags.map((tag: string) => {
                                                    const isSelected = selectedSuggestions.tags?.includes(tag)
                                                    return (
                                                        <Badge
                                                            key={tag}
                                                            variant={isSelected ? 'default' : 'outline'}
                                                            className="cursor-pointer hover:scale-105 transition-transform text-sm py-1.5 px-3"
                                                            onClick={() => toggleTag(tag)}
                                                        >
                                                            {tag}
                                                            {isSelected && (
                                                                <CheckCircle2 className="ml-1.5 size-3" />
                                                            )}
                                                        </Badge>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Dados Extraídos */}
                                    {analysis.results?.extracted_data && 
                                     Object.keys(analysis.results.extracted_data).length > 0 && (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-base font-semibold">
                                                    Dados Extraídos
                                                </Label>
                                                <Checkbox
                                                    checked={!!selectedSuggestions.extractedData}
                                                    onCheckedChange={checked =>
                                                        setSelectedSuggestions(prev => ({
                                                            ...prev,
                                                            extractedData: checked ? analysis.results?.extracted_data : undefined,
                                                        }))
                                                    }
                                                />
                                            </div>
                                            <div className="p-4 bg-muted rounded-xl border space-y-2 max-h-[200px] overflow-auto">
                                                {Object.entries(analysis.results.extracted_data).map(([key, value]) => (
                                                    <div key={key} className="flex justify-between items-start gap-4 text-sm">
                                                        <span className="font-medium text-muted-foreground capitalize">
                                                            {key.replace(/_/g, ' ')}:
                                                        </span>
                                                        <span className="font-mono text-right flex-1">
                                                            {typeof value === 'object'
                                                                ? JSON.stringify(value, null, 2)
                                                                : String(value)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </TabsContent>

                        <TabsContent value="analysis" className="mt-4">
                            <ScrollArea className="h-[400px] pr-4">
                                <div className="space-y-4 text-sm">
                                    <div>
                                        <h4 className="font-semibold mb-2">Documento</h4>
                                        <p className="text-muted-foreground">ID: {document.id}</p>
                                        <p className="text-muted-foreground">Nome: {document.name}</p>
                                        <p className="text-muted-foreground">Tipo: {document.file_type}</p>
                                    </div>

                                    <Separator />

                                    <div>
                                        <h4 className="font-semibold mb-2">Status da Análise</h4>
                                        <p className="text-muted-foreground">Status: {analysis.status}</p>
                                        <p className="text-muted-foreground">Tipo: {analysis.analysis_type}</p>
                                        <p className="text-muted-foreground">
                                            Criado: {new Date(analysis.created_at).toLocaleString('pt-BR')}
                                        </p>
                                        {analysis.completed_at && (
                                            <p className="text-muted-foreground">
                                                Concluído: {new Date(analysis.completed_at).toLocaleString('pt-BR')}
                                            </p>
                                        )}
                                    </div>

                                    {analysis.results?.extracted_text && (
                                        <>
                                            <Separator />
                                            <div>
                                                <h4 className="font-semibold mb-2">Texto Extraído (OCR)</h4>
                                                <div className="p-3 bg-muted rounded-lg max-h-[300px] overflow-auto">
                                                    <p className="text-xs whitespace-pre-wrap">
                                                        {analysis.results.extracted_text}
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <Separator />

                                    <div>
                                        <h4 className="font-semibold mb-2">Resultado Completo</h4>
                                        <pre className="p-3 bg-muted rounded-lg text-xs overflow-auto max-h-[300px]">
                                            {JSON.stringify(analysis.results, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                )}

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleReject}
                        disabled={loading}
                    >
                        <XCircle className="size-4 mr-2" />
                        Rejeitar Tudo
                    </Button>
                    <Button type="button" onClick={handleApply} disabled={loading || !hasAnySuggestions}>
                        <CheckCircle2 className="size-4 mr-2" />
                        {loading ? 'Aplicando...' : 'Aplicar Selecionados'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
