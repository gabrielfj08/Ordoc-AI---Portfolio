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
import { Brain, CheckCircle2, XCircle, AlertCircle, Tag, Folder } from 'lucide-react'
import type { AIAnalysis } from '@/hooks/use-document-upload-ai'

interface AISuggestionsModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    analysis: AIAnalysis
    documentName: string
    onApply: (selectedSuggestions: SelectedSuggestions) => Promise<void>
    onReject: () => void
}

export interface SelectedSuggestions {
    applyClassification: boolean
    applyCategory: boolean
    applyTags: string[]
    applyExtractedData: boolean
}

export function AISuggestionsModal({
    open,
    onOpenChange,
    analysis,
    documentName,
    onApply,
    onReject,
}: AISuggestionsModalProps) {
    const [loading, setLoading] = useState(false)
    const [selected, setSelected] = useState<SelectedSuggestions>({
        applyClassification: analysis.confidence >= 0.85,
        applyCategory: !!analysis.suggestedCategory && analysis.confidence >= 0.7,
        applyTags: analysis.suggestedTags || [],
        applyExtractedData: false,
    })

    const confidenceLevel =
        analysis.confidence >= 0.85 ? 'high' : analysis.confidence >= 0.7 ? 'medium' : 'low'
    const confidenceColor =
        confidenceLevel === 'high' ? 'green' : confidenceLevel === 'medium' ? 'yellow' : 'red'
    const confidenceLabel =
        confidenceLevel === 'high' ? 'Alta' : confidenceLevel === 'medium' ? 'Média' : 'Baixa'

    const handleApply = async () => {
        setLoading(true)
        try {
            await onApply(selected)
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
        setSelected(prev => ({
            ...prev,
            applyTags: prev.applyTags.includes(tag)
                ? prev.applyTags.filter(t => t !== tag)
                : [...prev.applyTags, tag],
        }))
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh]">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-purple-500" />
                        <DialogTitle>Sugestões de IA</DialogTitle>
                    </div>
                    <DialogDescription>
                        Análise automática concluída para: <strong>{documentName}</strong>
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[50vh]">
                    <div className="space-y-4 pr-4">
                        {/* Confiança */}
                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                <span className="text-sm font-medium">Confiança da análise</span>
                            </div>
                            <Badge
                                variant={
                                    confidenceColor === 'green'
                                        ? 'default'
                                        : confidenceColor === 'yellow'
                                        ? 'secondary'
                                        : 'destructive'
                                }
                            >
                                {confidenceLabel} ({Math.round(analysis.confidence * 100)}%)
                            </Badge>
                        </div>

                        <Separator />

                        {/* Classificação */}
                        {analysis.classification && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-base font-semibold">
                                        Tipo de documento
                                    </Label>
                                    <Checkbox
                                        checked={selected.applyClassification}
                                        onCheckedChange={checked =>
                                            setSelected(prev => ({
                                                ...prev,
                                                applyClassification: checked as boolean,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded border border-blue-200 dark:border-blue-800">
                                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                        {analysis.classification}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Categoria */}
                        {analysis.suggestedCategory && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-base font-semibold flex items-center gap-2">
                                        <Folder className="h-4 w-4" />
                                        Categoria sugerida
                                    </Label>
                                    <Checkbox
                                        checked={selected.applyCategory}
                                        onCheckedChange={checked =>
                                            setSelected(prev => ({
                                                ...prev,
                                                applyCategory: checked as boolean,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded border border-purple-200 dark:border-purple-800">
                                    <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                                        {analysis.suggestedCategory}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Tags */}
                        {analysis.suggestedTags && analysis.suggestedTags.length > 0 && (
                            <div className="space-y-2">
                                <Label className="text-base font-semibold flex items-center gap-2">
                                    <Tag className="h-4 w-4" />
                                    Tags sugeridas
                                </Label>
                                <div className="flex flex-wrap gap-2">
                                    {analysis.suggestedTags.map(tag => (
                                        <Badge
                                            key={tag}
                                            variant={
                                                selected.applyTags.includes(tag)
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            className="cursor-pointer"
                                            onClick={() => toggleTag(tag)}
                                        >
                                            {tag}
                                            {selected.applyTags.includes(tag) && (
                                                <CheckCircle2 className="ml-1 h-3 w-3" />
                                            )}
                                        </Badge>
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Clique nas tags para selecioná-las
                                </p>
                            </div>
                        )}

                        {/* Dados extraídos */}
                        {analysis.extractedData && Object.keys(analysis.extractedData).length > 0 && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-base font-semibold">
                                        Dados extraídos
                                    </Label>
                                    <Checkbox
                                        checked={selected.applyExtractedData}
                                        onCheckedChange={checked =>
                                            setSelected(prev => ({
                                                ...prev,
                                                applyExtractedData: checked as boolean,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded border space-y-2">
                                    {Object.entries(analysis.extractedData).map(([key, value]) => (
                                        <div key={key} className="flex justify-between text-sm">
                                            <span className="font-medium text-muted-foreground">
                                                {key}:
                                            </span>
                                            <span className="font-mono">
                                                {typeof value === 'object'
                                                    ? JSON.stringify(value)
                                                    : String(value)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Texto extraído (preview) */}
                        {analysis.extractedText && (
                            <div className="space-y-2">
                                <Label className="text-base font-semibold">Texto extraído</Label>
                                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded border">
                                    <p className="text-xs text-muted-foreground line-clamp-4">
                                        {analysis.extractedText}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleReject}
                        disabled={loading}
                    >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rejeitar
                    </Button>
                    <Button type="button" onClick={handleApply} disabled={loading}>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        {loading ? 'Aplicando...' : 'Aplicar selecionados'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
