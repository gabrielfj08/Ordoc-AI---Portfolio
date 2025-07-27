import * as React from 'react';
import { Icon } from 'printer-ui';
import { RestoreJobStatus } from '../../../constants';
import { RestoreStatusIconProps } from './types';

const RestoreStatusIcon = ({ status }: RestoreStatusIconProps) => {
  switch (status) {
    case RestoreJobStatus.created:
      return <Icon name="air" alt="air" color="darkGray" stroke />;
    case RestoreJobStatus.failed:
      return <Icon name="failed" alt="failed" color="error" fill />;
    case RestoreJobStatus.finished:
      return <Icon name="finished" alt="finished" color="success" fill />;
    case RestoreJobStatus.running:
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

export default RestoreStatusIcon;
