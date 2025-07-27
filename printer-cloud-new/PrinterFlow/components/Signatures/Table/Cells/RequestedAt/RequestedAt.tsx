import * as React from 'react';
import { Typography } from 'printer-ui';
import { RequestedAtCellProps } from '../../types';

const RequestedAtCell = ({ requestedAt }: RequestedAtCellProps) => {
  return (
    <div className="flex justify-center w-28 2xl:w-44">
      <Typography variant="footnote1">
        {new Intl.DateTimeFormat('pt-BR', {
          dateStyle: 'short',
        }).format(new Date(requestedAt))}
      </Typography>
    </div>
  );
};

export default RequestedAtCell;
