import * as React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Icon, icon } from 'printer-ui';
import { PriorityCellProps } from './types';

const PriorityCell = ({ procedure }: PriorityCellProps) => {
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
        id={`priority${procedure.id}`}
        data-tooltip-content={statusTooltipMapping[procedure.priority]}
        className="hidden sm:flex items-center justify-center w-4/12"
      >
        <>
          <Icon
            alt="priority"
            name={statusIconMapping[procedure.priority]}
            w={30}
            h={30}
            color={procedure.priority === 'high' ? 'error' : 'yellow'}
            stroke
          />
          <ReactTooltip anchorId={`priority${procedure.id}`} />
        </>
      </div>
    </div>
  );
};

export default PriorityCell;
