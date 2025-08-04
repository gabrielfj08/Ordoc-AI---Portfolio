'use client';

import React, { useState } from 'react';
import type { IndexDirectory } from '@/types/ordoc-air/directory';
import { Share2 } from 'lucide-react';
import { ShareModal } from '../../sharing';

export interface DirectoryCardProps {
  directory: IndexDirectory;
}

const DirectoryCard: React.FC<DirectoryCardProps> = ({ directory }) => {
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <div className="relative border rounded-md p-4 shadow-sm">
      <button
        onClick={() => setShareOpen(true)}
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        title="Compartilhar"
        type="button"
      >
        <Share2 className="w-4 h-4" />
      </button>
      <h3 className="font-semibold text-gray-900">{directory.name}</h3>
      {directory.description && (
        <p className="mt-1 text-sm text-gray-600">{directory.description}</p>
      )}
      {shareOpen && (
        <ShareModal
          objectId={directory.id}
          objectType="directory"
          onClose={() => setShareOpen(false)}
        />
      )}
    </div>
  );
};

export default DirectoryCard;
