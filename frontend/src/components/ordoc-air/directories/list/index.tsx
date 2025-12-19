'use client';

import React from 'react';
import { directoriesService } from '@/services/ordoc-air/directories';
import type {
  IndexDirectory,
  IndexDirectoriesAPIResponse,
} from '@/types/ordoc-air/directory';
import DirectoryList from './List';

const DirectoryListContainer: React.FC = () => {
  const [directories, setDirectories] = React.useState<IndexDirectory[]>([]);

  React.useEffect(() => {
    const loadDirectories = async () => {
      const response: IndexDirectoriesAPIResponse = await directoriesService.list({
        order: 'name',
        direction: 'asc',
      });
      setDirectories(response.directories);
    };

    loadDirectories();
  }, []);

  return <DirectoryList directories={directories} />;
};

export default DirectoryListContainer;
