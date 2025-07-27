import * as React from 'react';
import TreeView from './TreeView';
import { TreeViewContainerProps } from './types';

const TreeViewContainer = ({ data }: TreeViewContainerProps) => {
  return <TreeView data={data} />;
};

export default TreeViewContainer;
