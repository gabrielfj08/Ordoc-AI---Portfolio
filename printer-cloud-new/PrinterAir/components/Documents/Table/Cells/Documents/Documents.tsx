import * as React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Typography } from 'printer-ui';
import { DocumentCellProps } from './types';
import ExtensionsDocument from '../ExtensionsDocument';

const DocumentCell = ({ document }: DocumentCellProps) => {
  return (
    <div
      id={`originalFilename${document.id}`}
      data-tooltip-content={document.originalFilename}
      className="flex items-center space-x-4 max-w-[180px] xl:w-max-[700px] lg:max-w-[500px] md:max-w-[280px] sm:max-w-[150px] truncate"
    >
      <ExtensionsDocument src={document.originalFilename} />
      <Typography variant="footnote1" className="truncate">
        {document.originalFilename}
      </Typography>
      <ReactTooltip anchorId={`originalFilename${document.id}`} />
    </div>
  );
};

export default DocumentCell;
