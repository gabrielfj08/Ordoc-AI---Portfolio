'use client';

import React, { useState } from 'react';
import { RestoreItemsModalProps } from '@/types/ordoc-air/recycle-bin';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import { recycleBinService } from '@/services/ordoc-air/recycle-bin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

const RestoreItemsModal: React.FC<RestoreItemsModalProps> = ({
  selectedDocuments,
  selectedDirectories,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const queryClient = useQueryClient();

  const restoreMutation = useMutation({
    mutationFn: async () => {
      const promises = [];
      
      // Restaurar documentos
      if (selectedDocuments.length > 0) {
        promises.push(
          recycleBinService.restoreDocuments(selectedDocuments.map(d => d.id))
        );
      }
      
      // Restaurar diretórios
      if (selectedDirectories.length > 0) {
        promises.push(
          recycleBinService.restoreDirectories(selectedDirectories.map(d => d.id))
        );
      }
      
      await Promise.all(promises);
    },
    onSuccess: () => {
      toast.success('Itens restaurados com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['recycle-bin-documents'] });
      queryClient.invalidateQueries({ queryKey: ['recycle-bin-directories'] });
      handleClose();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao restaurar itens');
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const handleRestore = () => {
    restoreMutation.mutate();
  };

  const totalItems = selectedDocuments.length + selectedDirectories.length;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5" />
            Restaurar Itens
          </DialogTitle>
          <DialogDescription>
            Confirme a restauração dos itens selecionados.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-amber-800">
                Restaurar {totalItems} item{totalItems > 1 ? 's' : ''}
              </p>
              <p className="text-sm text-amber-700">
                {selectedDirectories.length > 0 && (
                  <span>{selectedDirectories.length} pasta{selectedDirectories.length > 1 ? 's' : ''}</span>
                )}
                {selectedDirectories.length > 0 && selectedDocuments.length > 0 && ' e '}
                {selectedDocuments.length > 0 && (
                  <span>{selectedDocuments.length} arquivo{selectedDocuments.length > 1 ? 's' : ''}</span>
                )}
                {' '}serão restaurados para suas localizações originais.
              </p>
            </div>
          </div>

          {(selectedDirectories.length > 0 || selectedDocuments.length > 0) && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium">Itens a serem restaurados:</h4>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {selectedDirectories.map((dir) => (
                  <div key={`dir-${dir.id}`} className="text-sm text-muted-foreground flex items-center gap-2">
                    <span>📁</span>
                    <span>{dir.name}</span>
                  </div>
                ))}
                {selectedDocuments.map((doc) => (
                  <div key={`doc-${doc.id}`} className="text-sm text-muted-foreground flex items-center gap-2">
                    <span>📄</span>
                    <span>{doc.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={restoreMutation.isPending}>
            Cancelar
          </Button>
          <Button 
            onClick={handleRestore} 
            disabled={restoreMutation.isPending}
          >
            {restoreMutation.isPending ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                Restaurando...
              </>
            ) : (
              <>
                <RotateCcw className="mr-2 h-4 w-4" />
                Restaurar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { RestoreItemsModal };
export default RestoreItemsModal;
