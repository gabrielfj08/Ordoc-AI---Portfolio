import * as React from 'react';
import { DeletedAtCellContainerProps } from './types';
import DeletedAtCell from './DeletedAt';

const DeletedAtCellContainer = ({ document }: DeletedAtCellContainerProps) => {
  return (
    <DeletedAtCell
      documentDeletedAt={new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'medium',
      }).format(new Date(document.updatedAt))}
    />
  );
};

export default DeletedAtCellContainer;
