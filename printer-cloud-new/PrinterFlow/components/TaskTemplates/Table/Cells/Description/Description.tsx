import * as React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Typography } from 'printer-ui';
import { TaskTemplateDescriptionCellProps } from './types';

const TaskTemplateDescriptionCell = ({
  taskTemplate,
}: TaskTemplateDescriptionCellProps) => {
  return (
    <div
      id={`taskTemplateDescription${taskTemplate.id}`}
      data-tooltip-content={taskTemplate.description}
      className="hidden sm:block items-center justify-start sm:w-80 px-4"
    >
      <Typography variant="footnote1" className="truncate">
        {taskTemplate.description}
      </Typography>
      <ReactTooltip anchorId={`taskTemplateDescription${taskTemplate.id}`} />
    </div>
  );
};

export default TaskTemplateDescriptionCell;
