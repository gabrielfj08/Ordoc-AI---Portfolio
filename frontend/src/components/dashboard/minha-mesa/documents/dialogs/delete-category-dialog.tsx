'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { SmartCategory } from '@/services/dashboard';

interface DeleteCategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category: SmartCategory | null;
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

export function DeleteCategoryDialog({ open, onOpenChange, category }: DeleteCategoryDialogProps) {
    const queryClient = useQueryClient();
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteCategoryMutation = useMutation({
        mutationFn: async () => {
            if (!category) throw new Error('Categoria não selecionada');
            await api.delete(`/ordoc-air/tags/${category.id}/`);
        },
        onSuccess: () => {
            toast.success('Categoria excluída com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['smart-categories'] });
            onOpenChange(false);
        },
        onError: (error: any) => {
            const message = error.response?.data?.detail || 'Erro ao excluir categoria';
            toast.error(message);
        },
    });

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteCategoryMutation.mutateAsync();
        } finally {
            setIsDeleting(false);
        }
    };

    if (!category) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="w-5 h-5" />
                        Excluir Categoria
                    </DialogTitle>
                    <DialogDescription className="pt-2">
                        Tem certeza que deseja excluir a categoria <strong>{category.name}</strong>?
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {category.docCount && category.docCount > 0 ? (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                            <p className="text-sm text-orange-800">
                                <strong>Atenção:</strong> Esta categoria possui <strong>{category.docCount}</strong> {category.docCount === 1 ? 'documento associado' : 'documentos associados'}.
                            </p>
                            <p className="text-sm text-orange-700 mt-2">
                                Os documentos não serão excluídos, mas perderão esta categoria.
                            </p>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            Esta ação não pode ser desfeita.
                        </p>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isDeleting}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Excluir Categoria
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
