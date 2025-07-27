import * as React from 'react';
import { Icon } from 'printer-ui';
import { ShareDocumentJobStatus } from '../../../../constants';
import { ShareStatusIconProps } from './types';

const ShareStatusIcon = ({ status }: ShareStatusIconProps) => {
  switch (status) {
    case ShareDocumentJobStatus.created:
      return <Icon name="air" alt="air" color="darkGray" stroke />;
    case ShareDocumentJobStatus.failed:
      return <Icon name="failed" alt="failed" color="error" fill />;
    case ShareDocumentJobStatus.finished:
      return <Icon name="finished" alt="finished" color="success" fill />;
    case ShareDocumentJobStatus.running:
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
