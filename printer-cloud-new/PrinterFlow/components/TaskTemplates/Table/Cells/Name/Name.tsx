import * as React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Typography } from 'printer-ui';
import { TaskTemplateNameCellProps } from './types';

const TaskTemplateNameCell = ({ taskTemplate }: TaskTemplateNameCellProps) => {
  return (
    <div
      id={`taskTemplateName${taskTemplate.id}`}
      data-tooltip-content={taskTemplate.name}
      className="w-56 px-3 truncate"
    >
      <Typography variant="footnote1" className="truncate">
        {taskTemplate.name}
      </Typography>
      <ReactTooltip anchorId={`taskTemplateName${taskTemplate.id}`} />
    </div>
  );
};

export default TaskTemplateNameCell;
