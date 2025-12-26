'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pencil, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { SmartTemplate } from '@/services/dashboard';

interface EditTemplateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    template: SmartTemplate | null;
}

interface TemplateFormData {
    name: string;
    category: string;
    description?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: `${API_BASE_URL}/api/v1`,
});

api.interceptors.request.use((config) => {
    config.headers['X-Subdomain'] = 'demo';
    const token = localStorage.getItem('ordoc_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const TEMPLATE_CATEGORIES = [
    'Jurídico',
    'Financeiro',
    'RH',
    'Comercial',
    'Operacional',
    'Marketing',
    'TI',
    'Projetos',
    'Outros'
];

export function EditTemplateDialog({ open, onOpenChange, template }: EditTemplateDialogProps) {
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<TemplateFormData>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [category, setCategory] = useState<string>('');

    // Preencher formulário quando template mudar
    useEffect(() => {
        if (template) {
            setValue('name', template.name);
            setValue('description', template.description || '');
            setCategory(template.category);
        }
    }, [template, setValue]);

    const updateTemplateMutation = useMutation({
        mutationFn: async (data: TemplateFormData) => {
            if (!template) throw new Error('Template não selecionado');

            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('category', category);
            if (data.description) {
                formData.append('description', data.description);
            }

            const response = await api.patch(`/ordoc-air/document-templates/${template.id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        },
        onSuccess: () => {
            toast.success('Template atualizado com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['smart-templates'] });
            reset();
            onOpenChange(false);
        },
        onError: (error: any) => {
            const message = error.response?.data?.detail || error.response?.data?.name?.[0] || 'Erro ao atualizar template';
            toast.error(message);
        },
    });

    const onSubmit = async (data: TemplateFormData) => {
        if (!category) {
            toast.error('Por favor, selecione uma categoria');
            return;
        }

        setIsSubmitting(true);
        try {
            await updateTemplateMutation.mutateAsync(data);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Pencil className="w-5 h-5 text-orange-600" />
                        Editar Template
                    </DialogTitle>
                    <DialogDescription>
                        Atualize as informações do template.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome do Template *</Label>
                        <Input
                            id="name"
                            placeholder="Ex: Contrato de Prestação de Serviços"
                            {...register('name', {
                                required: 'Nome é obrigatório',
                                minLength: { value: 3, message: 'Nome deve ter pelo menos 3 caracteres' }
                            })}
                            className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Categoria *</Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                            <SelectContent>
                                {TEMPLATE_CATEGORIES.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                        {cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descrição (opcional)</Label>
                        <Textarea
                            id="description"
                            placeholder="Descreva o propósito deste template..."
                            rows={3}
                            {...register('description')}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="bg-orange-600 hover:bg-orange-700"
                            disabled={isSubmitting}
                        >
                            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Salvar Alterações
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
