import * as React from 'react';
import { Typography } from 'printer-ui';
import { SharedDocumentsModalProps } from './types';
import ExtensionsDocument from '../../../../../components/Documents/Table/Cells/ExtensionsDocument/ExtensionsDocument';

const SharedDocumentsModal = ({ document }: SharedDocumentsModalProps) => {
  return (
    <div className="flex items-center gap-3 rounded-md bg-lighterGray h-16 px-5">
      <ExtensionsDocument src={document.originalFilename} />
      <Typography
        variant="footnote1"
        family="roboto"
        className="truncate flex-grow"
      >
        {document.originalFilename}
      </Typography>
    </div>
  );
};

export default SharedDocumentsModal;
