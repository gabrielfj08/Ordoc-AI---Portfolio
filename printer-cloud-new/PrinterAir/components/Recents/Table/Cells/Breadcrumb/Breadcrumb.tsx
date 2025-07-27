import * as React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Typography } from 'printer-ui';
import { BreadcrumbCellProps } from './types';
import getFileBasePath from '../../../../../../utils/getFileBasePath';

const BreadCrumbCell = ({ recentDocument }: BreadcrumbCellProps) => {
  return (
    <div
      id={`tooltip${recentDocument.document.id}`}
      data-tooltip-content={getFileBasePath(recentDocument.document.path)}
      className="hidden sm:flex items-center max-w-[180px] truncate"
    >
      <Typography variant="footnote1" className="truncate">
        {getFileBasePath(recentDocument.document.path)}
      </Typography>
      <ReactTooltip anchorId={`tooltip${recentDocument.document.id}`} />
    </div>
  );
};

export default BreadCrumbCell;
