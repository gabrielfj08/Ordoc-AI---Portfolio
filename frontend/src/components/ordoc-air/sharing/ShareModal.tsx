'use client';

import React, { useEffect, useState } from 'react';
import type { ShareableLink } from '@/types/ordoc-air/shareableLink';
import shareableLinksService from '@/services/ordoc-air/shareableLinks';
import LinkList from './LinkList';
import PermissionControls from './PermissionControls';

export interface ShareModalProps {
  objectId: number;
  objectType: 'document' | 'directory';
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ objectId, objectType, onClose }) => {
  const [links, setLinks] = useState<ShareableLink[]>([]);

  const loadLinks = async () => {
    try {
      const response = await shareableLinksService.list(objectType, objectId);
      setLinks(response);
    } catch (error) {
      console.error('Erro ao carregar links compartilháveis', error);
    }
  };

  useEffect(() => {
    loadLinks();
  }, [objectId, objectType]);

  const handleCreate = async (expiresAt: string | null) => {
    try {
      await shareableLinksService.create(objectType, objectId, { expires_at: expiresAt });
      await loadLinks();
    } catch (error) {
      console.error('Erro ao criar link', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await shareableLinksService.destroy(id);
      await loadLinks();
    } catch (error) {
      console.error('Erro ao remover link', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-md shadow-md p-4 w-full max-w-lg">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">
            Compartilhar {objectType === 'document' ? 'documento' : 'diretório'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            type="button"
          >
            ✕
          </button>
        </div>
        <PermissionControls onCreate={handleCreate} />
        <LinkList links={links} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default ShareModal;
