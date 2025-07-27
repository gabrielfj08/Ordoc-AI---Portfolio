import * as React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Typography } from 'printer-ui';
import { DocumentCellProps } from './types';
import ExtensionsDocument from '../../../../../Documents/Table/Cells/ExtensionsDocument';

const DocumentCell = ({ sharedDocument }: DocumentCellProps) => {
  return (
    <div
      id={`originalFilename${sharedDocument.document.id}`}
      data-tooltip-content={sharedDocument.document.originalFilename}
      className="flex items-center pl-5 space-x-4 max-w-[180px] min-w-full xl:w-max-[700px] lg:max-w-[500px] md:max-w-[280px] sm:max-w-[150px] truncate"
    >
      <ExtensionsDocument src={sharedDocument.document.originalFilename} />
      <Typography variant="footnote1" className="truncate">
        {sharedDocument.document.originalFilename}
      </Typography>
      <ReactTooltip
        anchorId={`originalFilename${sharedDocument.document.id}`}
      />
    </div>
  );
};

export default DocumentCell;
