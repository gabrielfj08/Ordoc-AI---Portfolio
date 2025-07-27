import * as React from 'react';
import { Typography } from 'printer-ui';
import { DeletedAtCellProps } from './types';

const DeletedAtCell = ({ documentDeletedAt }: DeletedAtCellProps) => {
  return (
    <div className="items-center space-x-8 hidden sm:flex px-4 justify-center">
      <Typography variant="footnote1">{documentDeletedAt}</Typography>
    </div>
  );
};

export default DeletedAtCell;
