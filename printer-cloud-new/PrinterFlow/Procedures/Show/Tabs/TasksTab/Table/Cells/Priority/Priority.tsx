import * as React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Icon, icon } from 'printer-ui';
import { PriorityCellProps } from './types';

const PriorityCell = ({ task }: PriorityCellProps) => {
  const statusIconMapping: Record<string, icon> = {
    high: 'highPriority',
    normal: 'mediumPriority',
  };

  const statusTooltipMapping: Record<string, string> = {
    high: 'Alta',
    normal: 'Normal',
  };
  return (
    <div className="hidden sm:flex items-center px-6">
      <div
        id={`priority${task.id}`}
        data-tooltip-content={statusTooltipMapping[task.priority]}
        className="hidden sm:flex items-center justify-center w-4/12"
      >
        <>
          <Icon
            alt="priority"
            name={statusIconMapping[task.priority]}
            w={30}
            h={30}
            color={task.priority === 'high' ? 'error' : 'yellow'}
            stroke
          />
          <ReactTooltip anchorId={`priority${task.id}`} />
        </>
      </div>
    </div>
  );
};

export default PriorityCell;
