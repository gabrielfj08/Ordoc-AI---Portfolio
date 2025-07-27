import * as React from 'react';
import { useActionSheet } from '../../../hooks';
import { DownloadJobProps } from './types';
import DownloadStatusIcon from './StatusIcon';
import { Icon, Typography } from 'printer-ui';

const DownloadJob = ({ status, zipfileName }: DownloadJobProps) => {
  const { closeActionSheet } = useActionSheet();

  React.useEffect(() => {
    if (status !== 'running') {
      setTimeout(closeActionSheet, 3000);
    }
  }, [status]);

  return (
    <div className="rounded-lg bg-lighterGray  justify-between my-4 px-4 flex items-center w-full h-16">
      <span className="flex items-center space-x-2 truncate mr-2">
        <Icon alt="zip" name="zipFileV2" stroke fill />
        <Typography variant="headline" className="truncate">
          {zipfileName}
        </Typography>
      </span>
      <DownloadStatusIcon status={status} />
    </div>
  );
};

export default DownloadJob;
