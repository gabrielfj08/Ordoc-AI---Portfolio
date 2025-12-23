'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Folder, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

interface CreateFolderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    parentDirId?: string | null;
}

interface FolderFormData {
    name: string;
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

export function CreateFolderDialog({ open, onOpenChange, parentDirId }: CreateFolderDialogProps) {
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FolderFormData>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const createFolderMutation = useMutation({
        mutationFn: async (data: FolderFormData) => {
            const payload: any = {
                name: data.name,
                description: data.description || '',
            };

            if (parentDirId) {
                payload.parent_directory = parentDirId;
            }

            const response = await api.post('/ordoc-air/directories/', payload);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Pasta criada com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['directories'] });
            reset();
            onOpenChange(false);
        },
        onError: (error: any) => {
            const message = error.response?.data?.detail || error.response?.data?.name?.[0] || 'Erro ao criar pasta';
            toast.error(message);
        },
    });

    const onSubmit = async (data: FolderFormData) => {
        setIsSubmitting(true);
        try {
            await createFolderMutation.mutateAsync(data);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Folder className="w-5 h-5 text-orange-600" />
                        Nova Pasta
                    </DialogTitle>
                    <DialogDescription>
                        Crie uma nova pasta para organizar seus documentos.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome da Pasta *</Label>
                        <Input
                            id="name"
                            placeholder="Ex: Contratos 2024"
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
                        <Label htmlFor="description">Descrição (opcional)</Label>
                        <Textarea
                            id="description"
                            placeholder="Descreva o conteúdo desta pasta..."
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
                            Criar Pasta
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
