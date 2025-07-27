import * as React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Typography } from 'printer-ui';
import { DocumentCellProps } from './types';
import ExtensionsDocument from './ExtensionsDocument';

const DocumentCell = ({ document, documentName }: DocumentCellProps) => {
  return (
    <div
      id={`originalFilename${document.id}`}
      data-tooltip-content={documentName}
      className="flex items-center space-x-4 max-w-[180px] min-w-full xl:w-max-[500px] lg:max-w-[400px] md:max-w-[200px] sm:max-w-[150px] truncate"
    >
      <ExtensionsDocument src={documentName} />
      <Typography variant="footnote1" className="truncate">
        {documentName}
      </Typography>
      <ReactTooltip anchorId={`originalFilename${document.id}`} />
    </div>
  );
};

export default DocumentCell;
