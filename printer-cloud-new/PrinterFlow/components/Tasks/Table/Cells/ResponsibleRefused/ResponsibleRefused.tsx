import * as React from 'react';
import { Typography } from 'printer-ui';
import { ResponsibleRefusedTaskCellProps } from './types';

const ReponsibleRefusedTaskCell = ({
  task,
}: ResponsibleRefusedTaskCellProps) => {
  return (
    <div className="hidden sm:flex w-40 px-4 justify-center items-center truncate">
      {task.assignee !== null ? (
        <Typography
          variant="footnote1"
          className={task.status === 'refused' ? 'block' : 'hidden'}
        >
          {task.assignee.name}
        </Typography>
      ) : null}
    </div>
  );
};

export default ReponsibleRefusedTaskCell;
