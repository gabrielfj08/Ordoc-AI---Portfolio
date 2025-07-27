import * as React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Typography } from 'printer-ui';
import { DocumentCellProps } from './types';
import ExtensionsDocument from '../../../../Documents/Table/Cells/ExtensionsDocument';

const DocumentCell = ({ recentDocument }: DocumentCellProps) => {
  return (
    <div
      id={`originalFilename${recentDocument.documentId}`}
      data-tooltip-content={recentDocument.document.originalFilename}
      className="flex items-center space-x-4 max-w-[180px] xl:w-max-[700px] lg:max-w-[500px] md:max-w-[280px] sm:max-w-[150px] truncate"
    >
      <ExtensionsDocument src={recentDocument.document.originalFilename} />
      <Typography variant="footnote1" className="truncate">
        {recentDocument.document.originalFilename}
      </Typography>
      <ReactTooltip anchorId={`originalFilename${recentDocument.documentId}`} />
    </div>
  );
};

export default DocumentCell;
