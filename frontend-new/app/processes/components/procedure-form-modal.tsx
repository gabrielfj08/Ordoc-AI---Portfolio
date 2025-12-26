"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useProcedures } from '../hooks/use-procedures'
import { procedureTemplatesApi } from '../api'
import type { CreateProcedureDto, ProcedureTemplate } from '../types'

interface ProcedureFormModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export function ProcedureFormModal({
    open,
    onOpenChange,
    onSuccess
}: ProcedureFormModalProps) {
    const { createProcedure, loading } = useProcedures()
    const [templates, setTemplates] = useState<ProcedureTemplate[]>([])
    const [loadingTemplates, setLoadingTemplates] = useState(false)

    const [formData, setFormData] = useState<Partial<CreateProcedureDto>>({
        procedure_template: '',
        priority: 'normal',
        deadline: null,
        payload: [],
        schema: {},
        private: false,
    })

    useEffect(() => {
        if (open) {
            loadTemplates()
        }
    }, [open])

    const loadTemplates = async () => {
        setLoadingTemplates(true)
        try {
            const response = await procedureTemplatesApi.list({ status: 'active' })
            setTemplates(response.results)
        } catch (error: any) {
            // Silenciar erro 401 (não autenticado) - é esperado
            if (error.response?.status !== 401) {
                console.error('Erro ao carregar templates:', error)
            }
        } finally {
            setLoadingTemplates(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.procedure_template) {
            return
        }

        try {
            await createProcedure(formData as CreateProcedureDto)

            // Reset form
            setFormData({
                procedure_template: '',
                priority: 'normal',
                deadline: null,
                payload: [],
                schema: {},
                private: false,
            })

            onSuccess?.()
            onOpenChange(false)
        } catch (error) {
            // Erro já tratado pelo hook
        }
    }

    const selectedTemplate = templates.find(t => t.id === formData.procedure_template)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Novo Procedimento</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Template */}
                    <div className="space-y-2">
                        <Label htmlFor="template">Template de Procedimento *</Label>
                        <Select
                            value={formData.procedure_template}
                            onValueChange={(value) => setFormData({ ...formData, procedure_template: value })}
                            disabled={loadingTemplates}
                        >
                            <SelectTrigger id="template">
                                <SelectValue placeholder={loadingTemplates ? "Carregando..." : "Selecione um template"} />
                            </SelectTrigger>
                            <SelectContent>
                                {templates.map((template) => (
                                    <SelectItem key={template.id} value={template.id}>
                                        {template.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {selectedTemplate && (
                            <p className="text-sm text-muted-foreground">
                                {selectedTemplate.description}
                            </p>
                        )}
                    </div>

                    {/* Prioridade e Prazo */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="priority">Prioridade</Label>
                            <Select
                                value={formData.priority}
                                onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
                            >
                                <SelectTrigger id="priority">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="high">Alta</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="deadline">Prazo</Label>
                            <Input
                                id="deadline"
                                type="date"
                                value={formData.deadline || ''}
                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value || null })}
                            />
                        </div>
                    </div>

                    {/* Privado */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="private"
                            checked={formData.private}
                            onChange={(e) => setFormData({ ...formData, private: e.target.checked })}
                            className="h-4 w-4"
                        />
                        <Label htmlFor="private" className="cursor-pointer">
                            Procedimento Privado
                        </Label>
                    </div>

                    {/* Ações */}
                    <div className="flex items-center justify-end gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="bg-orange-600 hover:bg-orange-700"
                            disabled={loading || !formData.procedure_template}
                        >
                            {loading ? 'Criando...' : 'Criar Procedimento'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
