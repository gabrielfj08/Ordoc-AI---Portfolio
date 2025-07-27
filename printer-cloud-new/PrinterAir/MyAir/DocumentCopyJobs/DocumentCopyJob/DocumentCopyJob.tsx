import * as React from 'react';
import { Icon, Typography } from 'printer-ui';
import { useActionSheet } from '../../../../hooks';
import DocumentCopyJobStatusIcon from './StatusIcon';
import { DocumentCopyJobProps } from './types';

const DocumentCopyJob = ({ document, documentCopy }: DocumentCopyJobProps) => {
  const { closeActionSheet } = useActionSheet();

  React.useEffect(() => {
    if (documentCopy.status !== 'running') {
      setTimeout(closeActionSheet, 3000);
    }
  }, [documentCopy.status]);

  return (
    <div className="flex items-center gap-3 rounded-md bg-lighterGray h-16 px-5">
      <Icon
        name="pdfFileV2"
        color="black"
        className="flex-none"
        alt="status"
        fill
      />
      <Typography className="truncate flex-grow">
        {document.originalFilename}
      </Typography>
      <div className="justify-self-end">
        <DocumentCopyJobStatusIcon status={documentCopy.status} />
      </div>
    </div>
  );
};

export default DocumentCopyJob;
