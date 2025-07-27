import * as React from 'react';
import { Icon, Typography } from 'printer-ui';
import { s3KeyToFilename } from '../../../utils';
import DocumentVersionUploadJobStatusIcon from './StatusIcon';
import { DocumentVersionUploadJobProps } from './types';

const DocumentVersionUploadJob = ({ documentVersionUploadJob }: DocumentVersionUploadJobProps) => {
  return (
    <div className="flex items-center gap-3 rounded-md bg-lighterGray h-16 px-5">
      <Icon
        name="imageV2"
        color="black"
        className="flex-none"
        alt="status"
        fill
      />
      <Typography className="truncate flex-grow">
        {s3KeyToFilename(documentVersionUploadJob.s3Key)}
      </Typography>
      <div className="justify-self-end">
        <DocumentVersionUploadJobStatusIcon status={documentVersionUploadJob.status} />
      </div>
    </div>
  );
};

export default DocumentVersionUploadJob;
