'use client';

import React from 'react';
import type { IndexDirectory } from '@/types/ordoc-air/directory';

export interface DirectoryCardProps {
  directory: IndexDirectory;
}

const DirectoryCard: React.FC<DirectoryCardProps> = ({ directory }) => {
  return (
    <div className="border rounded-md p-4 shadow-sm">
      <h3 className="font-semibold text-gray-900">{directory.name}</h3>
      {directory.description && (
        <p className="mt-1 text-sm text-gray-600">{directory.description}</p>
      )}
    </div>
  );
};

export default DirectoryCard;
