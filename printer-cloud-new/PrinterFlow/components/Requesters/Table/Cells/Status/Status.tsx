import * as React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Icon, icon } from 'printer-ui';
import { RequesterStatusCellProps } from './types';

const RequesterStatusCell = ({ requesters }: RequesterStatusCellProps) => {
  const requesterIcoColorMapping: Record<string, string> = {
    active: 'success',
    inactive: 'error',
    blocked: 'error',
  };

  const requesterTooltipMapping: Record<string, string> = {
    active: 'Ativo',
    inactive: 'Inativo',
  };
  {
    return (
      <div className="flex items-center justify-center px-4 w-fit lg:w-44">
        <div className="hidden sm:flex items-center justify-center px-6">
          <div
            id={`status${requesters.id}`}
            data-tooltip-content={requesterTooltipMapping[requesters.status]}
            className="hidden sm:flex items-center justify-center w-4/12"
          >
            <>
              <Icon
                alt="activated"
                name="requesterV3"
                w={28}
                h={28}
                stroke
                fill
                color={requesterIcoColorMapping[requesters.status]}
              />
              <ReactTooltip anchorId={`status${requesters.id}`} />
            </>
          </div>
        </div>
      </div>
    );
  }
};

export default RequesterStatusCell;
