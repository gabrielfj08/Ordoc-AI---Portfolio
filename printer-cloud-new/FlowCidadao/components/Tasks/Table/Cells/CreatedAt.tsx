import * as React from 'react';
import { TypographyV3 as Typography } from 'printer-ui';
import { CellProps } from '../types';

const CreatedAtCell = ({ task }: CellProps) => {
  return (
    <div className="sm:flex items-center justify-center">
      <div>
        <Typography variant="bodyMd" family="jakartaLight">
          {new Intl.DateTimeFormat('pt-BR', {
            dateStyle: 'short',
          }).format(
            new Date(
              new Date(task.createdAt).toISOString().replace('.000Z', '')
            )
          )}
        </Typography>
      </div>
    </div>
  );
};

export default CreatedAtCell;
