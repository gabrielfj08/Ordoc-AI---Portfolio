import * as React from 'react';
import { DeletedByCellContainerProps } from './types';
import DeletedByCell from './DeletedBy';

const DeletedByCellContainer = ({ document }: DeletedByCellContainerProps) => {
  return (
    <DeletedByCell documentDeletedBy={document.updatedBy?.name as string} />
  );
};

export default DeletedByCellContainer;
