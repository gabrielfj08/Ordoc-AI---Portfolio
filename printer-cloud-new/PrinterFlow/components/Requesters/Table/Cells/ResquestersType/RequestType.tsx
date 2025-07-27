import * as React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Icon } from 'printer-ui';
import { RequesterType } from '../../../../../constants';
import { RequestersTypeCellProps } from './types';
import { getRequesterType } from '../../../../../../utils/getRequesterType';

const RequestersTypeCell = ({ requesters }: RequestersTypeCellProps) => {
  if (getRequesterType(requesters.type) === RequesterType.internal) {
    return (
      <div
        id={`requester${requesters.id}`}
        className="hidden sm:flex items-center text-center justify-center px-4 w-fit sm:w-44"
        data-tooltip-content={'Interno'}
      >
        <Icon alt="internal" name="internal" fill stroke w={35} h={35} />
        <ReactTooltip anchorId={`requester${requesters.id}`} />
      </div>
    );
  }

  if (getRequesterType(requesters.type) === RequesterType.external) {
    return (
      <div
        id={`requester${requesters.id}`}
        className="hidden sm:flex items-center justify-center px-4 w-fit sm:w-44"
        data-tooltip-content={'Externo'}
      >
        <Icon
          alt="external"
          name="external"
          fill
          color="orange"
          stroke
          w={35}
          h={35}
        />
        <ReactTooltip anchorId={`requester${requesters.id}`} />
      </div>
    );
  }

  return null;
};

export default RequestersTypeCell;
