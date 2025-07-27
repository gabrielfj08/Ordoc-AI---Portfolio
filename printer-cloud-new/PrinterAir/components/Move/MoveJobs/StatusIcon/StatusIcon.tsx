import * as React from 'react';
import { Icon } from 'printer-ui';
import { MoveJobStatus } from '../../../../constants';
import { MoveStatusIconProps } from './types';

const MoveStatusIcon = ({ status }: MoveStatusIconProps) => {
  switch (status) {
    case MoveJobStatus.created:
      return <Icon name="air" alt="air" color="darkGray" stroke />;
    case MoveJobStatus.failed:
      return <Icon name="failed" alt="failed" color="error" fill />;
    case MoveJobStatus.finished:
      return <Icon name="finished" alt="finished" color="success" fill />;
    case MoveJobStatus.running:
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

export default MoveStatusIcon;
