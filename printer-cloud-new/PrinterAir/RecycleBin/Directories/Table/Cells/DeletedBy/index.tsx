import * as React from 'react';
import { DeletedByCellContainerProps } from './types';
import DeletedByCell from './DeletedBy';

const DeletedByCellContainer = ({ directory }: DeletedByCellContainerProps) => {
  return (
    <DeletedByCell directoryDeletedBy={directory.updatedBy?.name as string} />
  );
};

export default DeletedByCellContainer;
