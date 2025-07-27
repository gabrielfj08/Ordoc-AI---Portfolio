import * as React from 'react';
import { Icon } from 'printer-ui';
import { ShareDirectoryJobStatus } from '../../../../../constants';
import { ShareStatusIconProps } from './types';

const ShareStatusIcon = ({ status }: ShareStatusIconProps) => {
  switch (status) {
    case ShareDirectoryJobStatus.created:
      return <Icon name="air" alt="air" color="darkGray" stroke />;
    case ShareDirectoryJobStatus.failed:
      return <Icon name="failed" alt="failed" color="error" fill />;
    case ShareDirectoryJobStatus.finished:
      return <Icon name="finished" alt="finished" color="success" fill />;
    case ShareDirectoryJobStatus.running:
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

export default ShareStatusIcon;
