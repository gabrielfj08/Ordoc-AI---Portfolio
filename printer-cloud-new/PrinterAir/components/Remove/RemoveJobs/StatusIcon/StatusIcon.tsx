import * as React from 'react';
import { Icon } from 'printer-ui';
import { RemoveJobStatus } from '../../../../constants';
import { RemoveStatusIconProps } from './types';

const RemoveStatusIcon = ({ status }: RemoveStatusIconProps) => {
  switch (status) {
    case RemoveJobStatus.created:
      return <Icon name="air" alt="air" color="darkGray" stroke />;
    case RemoveJobStatus.failed:
      return <Icon name="failed" alt="failed" color="error" fill />;
    case RemoveJobStatus.finished:
      return <Icon name="finished" alt="finished" color="success" fill />;
    case RemoveJobStatus.running:
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

export default RemoveStatusIcon;
