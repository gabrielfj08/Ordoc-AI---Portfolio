"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTasks } from '../hooks/use-tasks'
import { procedureTemplatesApi } from '../api'
import type { CreateTaskDto, ProcedureTemplate } from '../types'

interface TaskFormModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    procedureId?: string
    onSuccess?: () => void
}

export function TaskFormModal({
    open,
    onOpenChange,
    procedureId,
    onSuccess
}: TaskFormModalProps) {
    const { createTask, loading } = useTasks()
    const [templates, setTemplates] = useState<ProcedureTemplate[]>([])

    const [formData, setFormData] = useState<Partial<CreateTaskDto>>({
        procedure: procedureId || '',
        name: '',
        description: '',
        priority: 'normal',
        deadline: null,
        task_template: null,
        assignee: null,
        group_assignee: null,
    })

    useEffect(() => {
        if (open) {
            // Carregar templates se necessário
            loadTemplates()
        }
    }, [open])

    const loadTemplates = async () => {
        try {
            const response = await procedureTemplatesApi.list({ status: 'active' })
            setTemplates(response.results)
        } catch (error) {
            console.error('Erro ao carregar templates:', error)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.procedure || !formData.name || !formData.description) {
            return
        }

        try {
            await createTask(formData as CreateTaskDto)

            // Reset form
            setFormData({
                procedure: procedureId || '',
                name: '',
                description: '',
                priority: 'normal',
                deadline: null,
                task_template: null,
                assignee: null,
                group_assignee: null,
            })

            onSuccess?.()
            onOpenChange(false)
        } catch (error) {
            // Erro já tratado pelo hook
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Nova Tarefa</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nome da Tarefa */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome da Tarefa *</Label>
                        <Input
                            id="name"
                            placeholder="Ex: Revisar Documento"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    {/* Descrição */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Descrição *</Label>
                        <Textarea
                            id="description"
                            placeholder="Descreva a tarefa em detalhes..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            required
                        />
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

                    {/* Procedimento (se não fornecido) */}
                    {!procedureId && (
                        <div className="space-y-2">
                            <Label htmlFor="procedure">Procedimento *</Label>
                            <Input
                                id="procedure"
                                placeholder="ID do Procedimento"
                                value={formData.procedure}
                                onChange={(e) => setFormData({ ...formData, procedure: e.target.value })}
                                required
                            />
                        </div>
                    )}

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
                            disabled={loading || !formData.name || !formData.description || !formData.procedure}
                        >
                            {loading ? 'Criando...' : 'Criar Tarefa'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
