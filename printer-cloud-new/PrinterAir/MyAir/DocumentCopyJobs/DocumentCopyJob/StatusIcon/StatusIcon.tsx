import * as React from 'react';
import { Icon } from 'printer-ui';
import { DocumentCopyJobStatus } from '../../../../../PrinterAir/constants';
import { DocumentCopyJobStatusIconProps } from './types';

const DocumentCopyJobStatusIcon = ({
  status,
}: DocumentCopyJobStatusIconProps) => {
  switch (status) {
    case DocumentCopyJobStatus.created:
      return <Icon name="air" alt="air" color="darkGray" stroke />;
    case DocumentCopyJobStatus.running:
      return (
        <Icon
          name="air"
          alt="air"
          color="darkGray"
          className="animate-spin"
          stroke
        />
      );
    case DocumentCopyJobStatus.finished:
      return <Icon name="finished" alt="finished" color="success" fill />;
    case DocumentCopyJobStatus.failed:
      return <Icon name="failed" alt="failed" color="error" fill />;
    default:
      return null;
  }
};

export default DocumentCopyJobStatusIcon;
