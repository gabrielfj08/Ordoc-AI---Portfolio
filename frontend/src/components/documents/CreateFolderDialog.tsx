'use client';

import { useState } from 'react';
import { FolderPlus, Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDirectoryActions } from '@/hooks/useDirectories';

interface CreateFolderDialogProps {
    parentDirectoryId?: string;
    onSuccess?: () => void;
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function CreateFolderDialog({
    parentDirectoryId,
    onSuccess,
    trigger,
    open: externalOpen,
    onOpenChange: externalOnOpenChange
}: CreateFolderDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const { create, isCreating } = useDirectoryActions();

    // Use external control if provided, otherwise use internal state
    const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
    const setIsOpen = externalOnOpenChange || setInternalOpen;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            return;
        }

        try {
            await create({
                name: name.trim(),
                description: description.trim() || undefined,
                parent_directory: parentDirectoryId,
            });

            // Reset form
            setName('');
            setDescription('');
            setIsOpen(false);

            // Callback de sucesso
            onSuccess?.();
        } catch (error) {
            // Erro já tratado pelo hook com toast
            console.error('Failed to create folder:', error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {trigger && (
                <DialogTrigger asChild>
                    {trigger}
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Criar Nova Pasta</DialogTitle>
                        <DialogDescription>
                            Crie uma nova pasta para organizar seus documentos.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">
                                Nome da Pasta <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ex: Contratos 2025"
                                maxLength={100}
                                required
                                autoFocus
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Descrição (opcional)</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Adicione uma descrição..."
                                rows={3}
                                maxLength={500}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            disabled={isCreating}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isCreating || !name.trim()}>
                            {isCreating ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Criando...
                                </>
                            ) : (
                                <>
                                    <FolderPlus className="h-4 w-4 mr-2" />
                                    Criar Pasta
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
