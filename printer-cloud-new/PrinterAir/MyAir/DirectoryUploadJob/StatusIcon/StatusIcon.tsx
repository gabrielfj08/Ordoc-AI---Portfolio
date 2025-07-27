import * as React from 'react';
import { Icon } from 'printer-ui';
import { DirectoryUploadJobStatus } from '../../../constants';
import { DirectoryUploadStatusIconProps } from './types';

const DirectoryUploadStatusIcon = ({
  status,
}: DirectoryUploadStatusIconProps) => {
  switch (status) {
    case DirectoryUploadJobStatus.created:
      return <Icon name="air" alt="air" color="darkGray" stroke />;
    case DirectoryUploadJobStatus.running:
      return (
        <Icon
          name="air"
          alt="air"
          color="darkGray"
          className="animate-spin"
          stroke
        />
      );
    case DirectoryUploadJobStatus.finished:
      return <Icon name="finished" alt="finished" color="success" fill />;
    case DirectoryUploadJobStatus.failed:
      return <Icon name="failed" alt="failed" color="error" fill />;
    default:
      return null;
  }
};

export default DirectoryUploadStatusIcon;
