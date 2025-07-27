import * as React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Typography } from 'printer-ui';
import { RequesterCellProps } from '../../types';

const RequesterCell = ({ signature }: RequesterCellProps) => {
  return (
    <div
      id={`requesterName${signature.id}`}
      data-tooltip-content={signature.createdBy.name}
      className="flex truncate"
    >
      <Typography variant="footnote1" className="truncate">
        {signature.createdBy.name}
      </Typography>
      <ReactTooltip anchorId={`requesterName${signature.id}`} />
    </div>
  );
};

export default RequesterCell;
