'use client';

import React, { useState } from 'react';
import { RecycleBinSelectedItemsMenuButtonProps } from '@/types/ordoc-air/recycle-bin';
import { Button } from '@/components/ui/button';
import { RotateCcw, Trash2 } from 'lucide-react';
import { RestoreItemsModal } from './RestoreItemsModal';

const SelectedItemsMenuButton: React.FC<RecycleBinSelectedItemsMenuButtonProps> = ({
  selectedDocuments,
  selectedDirectories,
}) => {
  const [showRestoreModal, setShowRestoreModal] = useState(false);

  const totalSelected = selectedDocuments.length + selectedDirectories.length;

  if (totalSelected === 0) {
    return null;
  }

  return (
    <>
      <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
        <span className="text-sm font-medium">
          {totalSelected} item{totalSelected > 1 ? 's' : ''} selecionado{totalSelected > 1 ? 's' : ''}
        </span>
        <div className="flex gap-2 ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRestoreModal(true)}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Restaurar
          </Button>
          <Button
            variant="destructive"
            size="sm"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir Permanentemente
          </Button>
        </div>
      </div>

      {showRestoreModal && (
        <RestoreItemsModal
          selectedDocuments={selectedDocuments}
          selectedDirectories={selectedDirectories}
          onClose={() => setShowRestoreModal(false)}
        />
      )}
    </>
  );
};

export default SelectedItemsMenuButton;
