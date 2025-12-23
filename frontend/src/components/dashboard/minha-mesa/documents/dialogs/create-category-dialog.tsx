'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Grid, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

interface CreateCategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface CategoryFormData {
    name: string;
    color: string;
    description?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: `${API_BASE_URL}/api/v1`,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    config.headers['X-Subdomain'] = 'demo';
    const token = localStorage.getItem('ordoc_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const PRESET_COLORS = [
    '#EF4444', // red
    '#F97316', // orange
    '#F59E0B', // amber
    '#EAB308', // yellow
    '#84CC16', // lime
    '#22C55E', // green
    '#10B981', // emerald
    '#14B8A6', // teal
    '#06B6D4', // cyan
    '#0EA5E9', // sky
    '#3B82F6', // blue
    '#6366F1', // indigo
    '#8B5CF6', // violet
    '#A855F7', // purple
    '#D946EF', // fuchsia
    '#EC4899', // pink
];

export function CreateCategoryDialog({ open, onOpenChange }: CreateCategoryDialogProps) {
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<CategoryFormData>({
        defaultValues: {
            color: '#3B82F6'
        }
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const selectedColor = watch('color');

    const createCategoryMutation = useMutation({
        mutationFn: async (data: CategoryFormData) => {
            const response = await api.post('/ordoc-air/tags/', {
                name: data.name,
                color: data.color,
                description: data.description || '',
            });
            return response.data;
        },
        onSuccess: () => {
            toast.success('Categoria criada com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            queryClient.invalidateQueries({ queryKey: ['tags'] });
            reset();
            onOpenChange(false);
        },
        onError: (error: any) => {
            const message = error.response?.data?.detail || error.response?.data?.name?.[0] || 'Erro ao criar categoria';
            toast.error(message);
        },
    });

    const onSubmit = async (data: CategoryFormData) => {
        setIsSubmitting(true);
        try {
            await createCategoryMutation.mutateAsync(data);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Grid className="w-5 h-5 text-orange-600" />
                        Nova Categoria
                    </DialogTitle>
                    <DialogDescription>
                        Crie uma nova categoria para organizar seus documentos.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome da Categoria *</Label>
                        <Input
                            id="name"
                            placeholder="Ex: Financeiro"
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
                        <Label>Cor *</Label>
                        <div className="flex flex-wrap gap-2">
                            {PRESET_COLORS.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setValue('color', color)}
                                    className={`w-8 h-8 rounded-md transition-all ${
                                        selectedColor === color 
                                            ? 'ring-2 ring-offset-2 ring-orange-600 scale-110' 
                                            : 'hover:scale-105'
                                    }`}
                                    style={{ backgroundColor: color }}
                                    title={color}
                                />
                            ))}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <Label htmlFor="custom-color" className="text-sm text-muted-foreground">
                                Ou escolha uma cor personalizada:
                            </Label>
                            <input
                                id="custom-color"
                                type="color"
                                {...register('color')}
                                className="w-12 h-8 rounded cursor-pointer"
                            />
                            <span className="text-sm text-muted-foreground">{selectedColor}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descrição (opcional)</Label>
                        <Textarea
                            id="description"
                            placeholder="Descreva o tipo de documentos desta categoria..."
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
                            Criar Categoria
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
