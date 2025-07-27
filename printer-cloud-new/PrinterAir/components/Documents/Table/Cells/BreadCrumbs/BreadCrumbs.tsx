import * as React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Typography } from 'printer-ui';
import { BreadCrumbsCellProps } from './types';
import getFileBasePath from '../../../../../../utils/getFileBasePath';

const BreadCrumbsCell = ({ document }: BreadCrumbsCellProps) => {
  return (
    <div
      id={`tooltip${document.id}`}
      data-tooltip-content={getFileBasePath(document.path)}
      className="hidden sm:flex items-center max-w-[180px] truncate"
    >
      <Typography variant="footnote1" className="truncate">
        {getFileBasePath(document.path)}
      </Typography>
      <ReactTooltip anchorId={`tooltip${document.id}`} />
    </div>
  );
};

export default BreadCrumbsCell;
