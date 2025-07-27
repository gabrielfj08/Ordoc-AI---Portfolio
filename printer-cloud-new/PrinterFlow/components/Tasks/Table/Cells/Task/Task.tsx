import * as React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Typography } from 'printer-ui';
import { TaskCellProps } from './types';

const TaskCell = ({ task }: TaskCellProps) => {
  return (
    <div
      id={`task${task.id}`}
      data-tooltip-content={task.name}
      className="lg:w-[350px] md:w-[250px] w-44 px-2 truncate space-y-2"
    >
      <ReactTooltip anchorId={`task${task.id}`} />
      <Typography variant="footnote1" className="truncate">
        {task.name}
      </Typography>
      <Typography variant="footnote1" className="truncate flex sm:hidden">
        {task.procedureInfo.split('-')[0]}
      </Typography>
    </div>
  );
};

export default TaskCell;
