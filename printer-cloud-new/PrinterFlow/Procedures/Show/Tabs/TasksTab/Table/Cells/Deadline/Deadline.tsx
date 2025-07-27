import * as React from 'react';
import { Typography } from 'printer-ui';
import { DeadlineCellProps } from './types';

const DeadlineCell = ({ task }: DeadlineCellProps) => {
  return (
    <div className="space-x-8 flex w-32 items-center">
      {task.deadline !== null ? (
        <Typography variant="footnote1">
          {new Intl.DateTimeFormat('pt-BR', {
            dateStyle: 'short',
          }).format(
            new Date(new Date(task.deadline).toISOString().replace('.000Z', ''))
          )}
        </Typography>
      ) : null}
    </div>
  );
};

export default DeadlineCell;
