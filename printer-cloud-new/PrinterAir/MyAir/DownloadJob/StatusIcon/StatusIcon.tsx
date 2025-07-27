import * as React from 'react';
import { Icon } from 'printer-ui';
import { DownloadJobStatus } from '../../../constants';
import { DownloadStatusIconProps } from './types';

const DownloadStatusIcon = ({ status }: DownloadStatusIconProps) => {
  switch (status) {
    case DownloadJobStatus.created:
      return <Icon name="air" alt="air" color="darkGray" stroke />;
    case DownloadJobStatus.failed:
      return <Icon name="failed" alt="failed" color="error" fill />;
    case DownloadJobStatus.finished:
      return <Icon name="finished" alt="finished" color="success" fill />;
    case DownloadJobStatus.running:
      return (
        <Icon
          className="animate-spin"
          name="air"
          alt="air"
          color="darkGray"
          stroke
        />
      );
    default:
      return null;
  }
};

export default DownloadStatusIcon;
