import React from 'react';
import type { IndexDirectory } from '@/types/ordoc-air/directory';

export interface DirectoryTreeNode extends IndexDirectory {
  children?: DirectoryTreeNode[];
}

export interface DirectoryTreeProps {
  nodes: DirectoryTreeNode[];
}

const renderNodes = (nodes: DirectoryTreeNode[]) => (
  <ul className="ml-4">
    {nodes.map((node) => (
      <li key={node.id}>
        <span>{node.name}</span>
        {node.children && node.children.length > 0 && renderNodes(node.children)}
      </li>
    ))}
  </ul>
);

const DirectoryTree: React.FC<DirectoryTreeProps> = ({ nodes }) => {
  return <div>{renderNodes(nodes)}</div>;
};

export default DirectoryTree;
