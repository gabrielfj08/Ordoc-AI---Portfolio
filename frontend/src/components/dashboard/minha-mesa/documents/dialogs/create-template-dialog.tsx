'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileCode, Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

interface CreateTemplateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface TemplateFormData {
    name: string;
    category: string;
    description?: string;
    file: FileList;
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

export function CreateTemplateDialog({ open, onOpenChange }: CreateTemplateDialogProps) {
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<TemplateFormData>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [category, setCategory] = useState<string>('');

    const createTemplateMutation = useMutation({
        mutationFn: async (data: TemplateFormData) => {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('category', category);
            if (data.description) {
                formData.append('description', data.description);
            }
            if (selectedFile) {
                formData.append('file', selectedFile);
            }
            formData.append('status', 'active');
            formData.append('version', '1.0');

            const response = await api.post('/ordoc-air/document-templates/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        },
        onSuccess: () => {
            toast.success('Template criado com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['templates'] });
            reset();
            setSelectedFile(null);
            setCategory('');
            onOpenChange(false);
        },
        onError: (error: any) => {
            const message = error.response?.data?.detail || error.response?.data?.name?.[0] || 'Erro ao criar template';
            toast.error(message);
        },
    });

    const onSubmit = async (data: TemplateFormData) => {
        if (!selectedFile) {
            toast.error('Por favor, selecione um arquivo');
            return;
        }
        if (!category) {
            toast.error('Por favor, selecione uma categoria');
            return;
        }

        setIsSubmitting(true);
        try {
            await createTemplateMutation.mutateAsync(data);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['.pdf', '.doc', '.docx', '.txt', '.odt'];
            const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
            if (!allowedTypes.includes(fileExt)) {
                toast.error('Tipo de arquivo não permitido. Use: PDF, DOC, DOCX, TXT ou ODT');
                return;
            }
            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                toast.error('Arquivo muito grande. Tamanho máximo: 10MB');
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileCode className="w-5 h-5 text-orange-600" />
                        Novo Template
                    </DialogTitle>
                    <DialogDescription>
                        Crie um novo template de documento para reutilização.
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
                        <Label htmlFor="file-upload">Arquivo do Template *</Label>
                        <div className="flex flex-col gap-2">
                            {!selectedFile ? (
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-orange-600 hover:bg-orange-50/50 transition-colors text-center">
                                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                        <p className="text-sm font-medium mb-1">Clique para selecionar arquivo</p>
                                        <p className="text-xs text-muted-foreground">PDF, DOC, DOCX, TXT ou ODT (máx. 10MB)</p>
                                    </div>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,.txt,.odt"
                                        onChange={handleFileChange}
                                    />
                                </label>
                            ) : (
                                <div className="border border-border rounded-lg p-4 flex items-center justify-between bg-secondary/50">
                                    <div className="flex items-center gap-3">
                                        <FileCode className="w-5 h-5 text-orange-600" />
                                        <div>
                                            <p className="text-sm font-medium">{selectedFile.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {(selectedFile.size / 1024).toFixed(2)} KB
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleRemoveFile}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
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
                            onClick={() => {
                                onOpenChange(false);
                                setSelectedFile(null);
                                setCategory('');
                                reset();
                            }}
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
                            Criar Template
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
