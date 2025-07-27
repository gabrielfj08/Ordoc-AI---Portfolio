import * as React from 'react';
import { Icon, Typography } from 'printer-ui';
import { DirectoryUploadJobProps } from './types';
import DirectoryUploadStatusIcon from './StatusIcon/StatusIcon';

const DirectoryUploadJob = ({
  directoryName,
  status,
}: DirectoryUploadJobProps) => {
  return (
    <div className="rounded-lg bg-lighterGray  justify-between my-4 px-4 flex items-center w-full h-16">
      <span className="flex  items-center space-x-2">
        <Icon alt="zip" name="zipFileV2" stroke fill />
        <Typography variant="headline">{directoryName}</Typography>
      </span>
      <DirectoryUploadStatusIcon status={status} />
    </div>
  );
};

export default DirectoryUploadJob;
