'use client';

import { useState } from 'react';
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
import { useDeleteDocuments } from '@/hooks/use-document-actions';

interface DeleteDocumentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    document: any;
}

export function DeleteDocumentDialog({ open, onOpenChange, document }: DeleteDocumentDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [warnings, setWarnings] = useState<any>(null);
    const deleteDocumentsMutation = useDeleteDocuments();

    const handleDelete = async (confirmed = false) => {
        if (!document) return;

        setIsDeleting(true);
        try {
            const result = await deleteDocumentsMutation.mutateAsync({
                documentIds: [document.id],
                permanent: false,
                confirmed
            });

            // If requires confirmation, show warnings
            if (result?.requires_confirmation) {
                setWarnings(result.warnings);
                setIsDeleting(false);
                return;
            }

            // Success - close dialog
            onOpenChange(false);
            setWarnings(null);
        } finally {
            setIsDeleting(false);
        }
    };

    if (!document) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="w-5 h-5" />
                        Excluir Documento
                    </DialogTitle>
                    <DialogDescription className="pt-2">
                        Tem certeza que deseja excluir <strong>{document.title || document.name}</strong>?
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-3">
                    {warnings ? (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                            <p className="text-sm font-medium text-orange-900 mb-2">
                                ⚠️ Atenção
                            </p>
                            {warnings.shared_count > 0 && (
                                <p className="text-sm text-orange-700">
                                    • Este documento está compartilhado com outros usuários
                                </p>
                            )}
                            {warnings.not_owned_count > 0 && (
                                <p className="text-sm text-orange-700">
                                    • Este documento não pertence a você
                                </p>
                            )}
                            <p className="text-sm text-orange-600 mt-2">
                                Deseja continuar mesmo assim?
                            </p>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            O documento será movido para a lixeira e poderá ser restaurado nos próximos 30 dias.
                        </p>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            onOpenChange(false);
                            setWarnings(null);
                        }}
                        disabled={isDeleting}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => handleDelete(!!warnings)}
                        disabled={isDeleting}
                    >
                        {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {warnings ? 'Confirmar Exclusão' : 'Mover para Lixeira'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
