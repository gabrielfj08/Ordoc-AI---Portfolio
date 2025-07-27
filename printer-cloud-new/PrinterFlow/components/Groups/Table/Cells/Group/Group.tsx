import * as React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Typography } from 'printer-ui';
import { GroupCellProps } from './types';

const GroupCell = ({ group }: GroupCellProps) => {
  return (
    <>
      <div
        id={`groups${group.id}`}
        data-tooltip-content={group.name}
        className="w-44 sm:block hidden space-y-2 "
      >
        <div className="w-full flex py-2 3 lg:min-w-[350px] px-4 truncate">
          <Typography variant="footnote1" className="truncate">
            {group.name}
          </Typography>
          <ReactTooltip anchorId={`groups${group.id}`} />
        </div>
      </div>
      <div className="sm:hidden w-32 px-4 truncate">
        <Typography variant="footnote1" className="truncate">
          {group.name}
        </Typography>
      </div>
    </>
  );
};

export default GroupCell;
