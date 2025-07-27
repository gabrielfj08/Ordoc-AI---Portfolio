import * as React from 'react';
import { Typography } from 'printer-ui';
import { DocumentCellProps } from './types';
import ExtensionsDocument from '../../../../../components/Documents/Table/Cells/ExtensionsDocument';

const DocumentCell = ({ document }: DocumentCellProps) => {
  return (
    <div className="flex items-center space-x-4 max-w-[180px] min-w-full xl:w-max-[500px] lg:max-w-[400px] md:max-w-[200px] sm:max-w-[150px] truncate">
      <ExtensionsDocument src={document.originalFilename} />
      <Typography variant="footnote1" className="truncate">
        {document.originalFilename}
      </Typography>
    </div>
  );
};

export default DocumentCell;
