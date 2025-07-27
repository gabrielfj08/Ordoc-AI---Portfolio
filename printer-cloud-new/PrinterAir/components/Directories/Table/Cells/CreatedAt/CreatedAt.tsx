import * as React from 'react';
import { Typography } from 'printer-ui';
import { CreatedAtCellProps } from './types';

const DirectoryCreatedAtCell = ({ directory }: CreatedAtCellProps) => {
  return (
    <div className="space-x-8 hidden sm:flex items-center">
      <Typography variant="footnote1">
        {new Intl.DateTimeFormat('pt-BR', {
          dateStyle: 'short',
          timeStyle: 'medium',
        }).format(new Date(directory.createdAt))}
      </Typography>
    </div>
  );
};

export default DirectoryCreatedAtCell;
