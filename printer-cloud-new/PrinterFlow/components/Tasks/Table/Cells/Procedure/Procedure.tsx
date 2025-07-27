import * as React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Typography } from 'printer-ui';
import { ProcedureCellProps } from './types';

const ProcedureCell = ({ task }: ProcedureCellProps) => {
  return (
    <div
      id={`tasks${task.id}`}
      data-tooltip-content={task.procedureInfo}
      className="lg:w-[250px] md:w-[150px] w-44 justify-center sm:block items-center px-4 truncate hidden space-y-2"
    >
      <div className="justify-center items-center flex">
        <Typography variant="footnote1" className="truncate">
          {task.procedureInfo.split('-')[0]}
        </Typography>
        <ReactTooltip anchorId={`tasks${task.id}`} />
      </div>
      <div className="justify-center items-center flex">
        <Typography variant="footnote1" className="truncate">
          {task.procedureInfo.split('-')[1]}
        </Typography>
      </div>
    </div>
  );
};

export default ProcedureCell;
