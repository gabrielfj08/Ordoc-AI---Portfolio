import * as React from 'react';
import { TreeViewProps } from './types';
import TreeItem from './TreeItem';

const TreeView = ({ data }: TreeViewProps) => {
  return (
    <ul className="w-full">
      {Array.isArray(data) ? (
        data.map((node) => (
          <TreeItem
            label={`${node.code}. ${node.name}`}
            key={node.id}
            id={node.id}
            status={node.status}
          >
            {node.children}
          </TreeItem>
        ))
      ) : (
        <TreeItem
          label={`${data.code}. ${data.name}`}
          key={data.id}
          id={data.id}
          status={data.status}
        >
          {data.children}
        </TreeItem>
      )}
    </ul>
  );
};

export default TreeView;
