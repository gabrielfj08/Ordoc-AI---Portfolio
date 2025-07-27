import * as React from 'react';
import { DeletedAtCellContainerProps } from './types';
import DeletedAtCell from './DeletedAt';

const DeletedAtCellContainer = ({ directory }: DeletedAtCellContainerProps) => {
  return (
    <DeletedAtCell
      directoryDeletedAt={new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'medium',
      }).format(new Date(directory.updatedAt))}
    />
  );
};

export default DeletedAtCellContainer;
