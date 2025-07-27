import * as React from 'react';
import { Typography } from 'printer-ui';
import { DeadlineCellProps } from './types';

const DeadlineCell = ({ procedure }: DeadlineCellProps) => {
  return (
    <div className="space-x-8 hidden sm:flex items-center">
      {procedure.deadline !== null ? (
        <Typography variant="footnote1">
          {new Intl.DateTimeFormat('pt-BR', {
            dateStyle: 'short',
          }).format(
            new Date(
              new Date(procedure.deadline).toISOString().replace('.000Z', '')
            )
          )}
        </Typography>
      ) : null}
    </div>
  );
};

export default DeadlineCell;
