import * as React from 'react';
import { Icon, Typography } from 'printer-ui';
import { s3KeyToFilename } from '../../../utils';
import DocumentUploadJobStatusIcon from './StatusIcon';
import { DocumentUploadJobProps } from './types';

const DocumentUploadJob = ({ documentUploadJob }: DocumentUploadJobProps) => {
  return (
    <div className="flex items-center gap-3 rounded-md bg-lighterGray h-16 px-5 py-5">
      <Icon
        name="imageV2"
        color="black"
        className="flex-none"
        alt="status"
        fill
      />
      <Typography className="truncate flex-grow">
        {s3KeyToFilename(documentUploadJob.s3Key)}
      </Typography>
      <div className="justify-self-end">
        <DocumentUploadJobStatusIcon status={documentUploadJob.status} />
      </div>
    </div>
  );
};

export default DocumentUploadJob;
