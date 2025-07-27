import * as React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Icon, icon } from 'printer-ui';
import { groupStatusCellProps } from './types';

const GroupStatusCell = ({ group }: groupStatusCellProps) => {
  const statusIconColorMapping: Record<string, string> = {
    active: 'success',
    inactive: 'error',
  };

  const statusTooltipMapping: Record<string, string> = {
    active: 'Ativo',
    inactive: 'Inativo',
  };
  {
    return (
      <div className="flex items-center justify-center space-x-2 px-4 w-fit lg:w-44">
        <div className="hidden sm:flex items-center justify-center px-6">
          <div
            id={`status${group.id}`}
            data-tooltip-content={statusTooltipMapping[group.status]}
            className="hidden sm:flex items-center justify-center w-4/12"
          >
            <>
              <Icon
                alt="activated"
                name="groupRequesterV3"
                w={28}
                h={28}
                fill
                color={statusIconColorMapping[group.status]}
              />
              <ReactTooltip anchorId={`status${group.id}`} />
            </>
          </div>
        </div>
      </div>
    );
  }
};

export default GroupStatusCell;
