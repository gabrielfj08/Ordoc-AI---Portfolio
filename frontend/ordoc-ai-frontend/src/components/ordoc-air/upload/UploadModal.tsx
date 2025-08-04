'use client';

import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import DragAndDrop from './DragAndDrop';
import UploadQueue from './UploadQueue';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFiles = (list: FileList | null) => {
    if (!list) return;
    setFiles((prev) => [...prev, ...Array.from(list)]);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <div className="bg-white rounded-lg shadow-xl p-6 z-10 w-full max-w-lg">
          <Dialog.Title className="text-lg font-medium mb-4">
            Enviar arquivos
          </Dialog.Title>
          <DragAndDrop onFiles={handleFiles} />
          <UploadQueue files={files} />
          <div className="mt-6 text-right">
            <button
              className="px-4 py-2 text-sm bg-gray-200 rounded-md" 
              onClick={onClose}
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default UploadModal;
