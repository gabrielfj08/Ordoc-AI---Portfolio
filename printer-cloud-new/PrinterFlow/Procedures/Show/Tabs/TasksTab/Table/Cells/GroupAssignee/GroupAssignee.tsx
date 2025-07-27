import * as React from 'react';
import { Typography } from 'printer-ui';
import { GroupAssigneeCellProps } from './types';

const GroupAssigneeCell = ({ task }: GroupAssigneeCellProps) => {
  return (
    <div className="hidden sm:flex sm:w-48 px-4 justify-center items-center truncate">
      {task.groupAssignee ? (
        <Typography variant="footnote1" className="truncate">
          {task.groupAssignee.name}
        </Typography>
      ) : null}
    </div>
  );
};

export default GroupAssigneeCell;
