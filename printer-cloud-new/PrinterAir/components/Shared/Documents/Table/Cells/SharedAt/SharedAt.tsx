import * as React from 'react';
import { Typography } from 'printer-ui';
import { SharedAtCellProps } from './types';

const SharedAtCell = ({ sharedDocument }: SharedAtCellProps) => {
  return (
    <div className="items-center space-x-8 hidden sm:flex px-4 justify-center">
      <Typography variant="footnote1">
        {new Intl.DateTimeFormat('pt-BR', {
          dateStyle: 'short',
          timeStyle: 'medium',
        }).format(new Date(sharedDocument.createdAt))}
      </Typography>
    </div>
  );
};

export default SharedAtCell;
