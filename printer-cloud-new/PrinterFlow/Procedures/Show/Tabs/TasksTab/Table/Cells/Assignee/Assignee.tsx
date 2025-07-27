import * as React from 'react';
import { Typography } from 'printer-ui';
import { AssigneeCellProps } from './types';

const AssigneeCell = ({ task }: AssigneeCellProps) => {
  return (
    <div className="hidden sm:flex sm:w-48 px-4 justify-center items-center truncate">
      {task.assignee ? (
        <Typography variant="footnote1" className="truncate">
          {task.assignee.name}
        </Typography>
      ) : null}
    </div>
  );
};

export default AssigneeCell;
