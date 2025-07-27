import * as React from 'react';
import { Typography } from 'printer-ui';
import { LastAccessedAtCellProps } from './types';

const LastAccessedAtCell = ({ recentDocument }: LastAccessedAtCellProps) => {
  return (
    <div className="hidden sm:flex items-center">
      <Typography variant="footnote1">
        {new Intl.DateTimeFormat('pt-BR', {
          dateStyle: 'short',
          timeStyle: 'medium',
        }).format(new Date(recentDocument.lastAccessedAt))}
      </Typography>
    </div>
  );
};

export default LastAccessedAtCell;
