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
import { SmartTemplate } from '@/services/dashboard';

interface DeleteTemplateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    template: SmartTemplate | null;
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

export function DeleteTemplateDialog({ open, onOpenChange, template }: DeleteTemplateDialogProps) {
    const queryClient = useQueryClient();
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteTemplateMutation = useMutation({
        mutationFn: async () => {
            if (!template) throw new Error('Template não selecionado');
            await api.delete(`/ordoc-air/document-templates/${template.id}/`);
        },
        onSuccess: () => {
            toast.success('Template excluído com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['smart-templates'] });
            onOpenChange(false);
        },
        onError: (error: any) => {
            const message = error.response?.data?.detail || 'Erro ao excluir template';
            toast.error(message);
        },
    });

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteTemplateMutation.mutateAsync();
        } finally {
            setIsDeleting(false);
        }
    };

    if (!template) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="w-5 h-5" />
                        Excluir Template
                    </DialogTitle>
                    <DialogDescription className="pt-2">
                        Tem certeza que deseja excluir o template <strong>{template.name}</strong>?
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {template.usageCount && template.usageCount > 0 ? (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                            <p className="text-sm text-orange-800">
                                <strong>Atenção:</strong> Este template foi usado <strong>{template.usageCount}</strong> {template.usageCount === 1 ? 'vez' : 'vezes'}.
                            </p>
                            <p className="text-sm text-orange-700 mt-2">
                                A exclusão não afetará documentos já criados com este template.
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
                        Excluir Template
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
