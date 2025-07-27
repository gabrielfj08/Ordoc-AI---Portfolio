import * as React from 'react';
import ItemsList from './ItemsList';
import { ItemsListContainerProps } from './types';

const ItemsListContainer = ({
  selectedDirectories,
  selectedDocuments,
}: ItemsListContainerProps) => {
  return (
    <ItemsList
      selectedDirectories={selectedDirectories}
      selectedDocuments={selectedDocuments}
    />
  );
};

export default ItemsListContainer;
