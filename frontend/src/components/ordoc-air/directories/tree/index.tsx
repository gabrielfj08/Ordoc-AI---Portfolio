'use client';

import React from 'react';
import { directoriesService } from '@/services/ordoc-air/directories';
import DirectoryTree, { DirectoryTreeNode } from './Tree';

const DirectoryTreeContainer: React.FC = () => {
  const [nodes, setNodes] = React.useState<DirectoryTreeNode[]>([]);

  React.useEffect(() => {
    const loadTree = async () => {
      const response = await directoriesService.tree();
      setNodes(response as DirectoryTreeNode[]);
    };

    loadTree();
  }, []);

  return <DirectoryTree nodes={nodes} />;
};

export default DirectoryTreeContainer;
