import * as React from 'react';
import { Typography } from 'printer-ui';
import { DocumentCreatedAtCellProps } from './types';

const CreatedAtCell = ({ document }: DocumentCreatedAtCellProps) => {
  return (
    <div className="space-x-8 hidden sm:flex items-center">
      <Typography variant="footnote1">
        {new Intl.DateTimeFormat('pt-BR', {
          dateStyle: 'short',
          timeStyle: 'medium',
        }).format(new Date(document.createdAt))}
      </Typography>
    </div>
  );
};

export default CreatedAtCell;
