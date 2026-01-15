import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Folder, Share2, UserX } from "lucide-react";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    warnings?: {
        shared_count?: number;
        not_owned_count?: number;
        folder_count?: number;
        shared_docs?: Array<{ id: string; name: string; owner: string }>;
        not_owned_docs?: Array<{ id: string; name: string; owner: string }>;
    };
}

export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirmar ação",
    description = "Tem certeza que deseja prosseguir?",
    warnings
}: ConfirmationModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-amber-600">
                        <AlertTriangle className="h-5 w-5" />
                        {title}
                    </DialogTitle>
                    <DialogDescription className="space-y-4 pt-2">
                        <p>{description}</p>

                        {warnings && (
                            <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-900 space-y-2">
                                {warnings.folder_count && warnings.folder_count > 0 && (
                                    <div className="flex items-start gap-2">
                                        <Folder className="h-4 w-4 mt-0.5 shrink-0 text-amber-700" />
                                        <span>
                                            Você está prestes a excluir <strong>{warnings.folder_count} pastas</strong> e todo o seu conteúdo.
                                        </span>
                                    </div>
                                )}

                                {warnings.shared_count && warnings.shared_count > 0 && (
                                    <div className="flex items-start gap-2">
                                        <Share2 className="h-4 w-4 mt-0.5 shrink-0 text-amber-700" />
                                        <span>
                                            <strong>{warnings.shared_count} documentos</strong> são compartilhados. Outros usuários perderão acesso.
                                        </span>
                                    </div>
                                )}

                                {warnings.not_owned_count && warnings.not_owned_count > 0 && (
                                    <div className="flex items-start gap-2">
                                        <UserX className="h-4 w-4 mt-0.5 shrink-0 text-amber-700" />
                                        <span>
                                            <strong>{warnings.not_owned_count} documentos</strong> pertencem a outros usuários.
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        <p className="text-xs text-muted-foreground">
                            Esta ação moverá os itens para a lixeira, onde poderão ser restaurados por 30 dias.
                        </p>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button onClick={onConfirm} className="bg-amber-600 hover:bg-amber-700 text-white">
                        Continuar mesmo assim
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
