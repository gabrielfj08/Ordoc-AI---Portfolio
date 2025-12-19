import React from 'react';
import { DirectoryCard } from '../card';
import type { IndexDirectory } from '@/types/ordoc-air/directory';

export interface DirectoryListProps {
  directories: IndexDirectory[];
}

const DirectoryList: React.FC<DirectoryListProps> = ({ directories }) => (
  <div className="grid gap-4">
    {directories.map((directory) => (
      <DirectoryCard key={directory.id} directory={directory} />
    ))}
  </div>
);

export default DirectoryList;
