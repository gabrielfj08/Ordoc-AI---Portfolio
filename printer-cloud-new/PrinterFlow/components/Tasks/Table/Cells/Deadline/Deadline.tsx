import * as React from 'react';
import { Typography } from 'printer-ui';
import { DeadlineCellProps } from './types';

const DeadlineCell = ({ task }: DeadlineCellProps) => {
  return (
    <div className="hidden sm:flex lg:w-full items-center justify-center px-2 truncate">
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
