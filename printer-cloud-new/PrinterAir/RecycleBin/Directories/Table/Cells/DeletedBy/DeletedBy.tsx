import { Typography } from 'printer-ui';
import * as React from 'react';
import { DeletedByCellProps } from './types';

const DeletedByCell = ({ directoryDeletedBy }: DeletedByCellProps) => {
  return (
    <div className="hidden sm:flex items-center justify-center max-w-[180px] min-w-full lg:max-w-[200px] md:max-w-[150px] sm:max-w-[100px] truncate px-4">
      <Typography variant="footnote1" className="truncate">
        {directoryDeletedBy}
      </Typography>
    </div>
  );
};

export default DeletedByCell;
