import * as React from 'react';
import { Icon } from 'printer-ui';
import { DocumentUploadJobStatus } from '../../../../../PrinterAir/constants';
import { DocumentUploadJobStatusIconProps } from './types';

const DocumentUploadJobStatusIcon = ({
  status,
}: DocumentUploadJobStatusIconProps) => {
  switch (status) {
    case DocumentUploadJobStatus.created:
      return <Icon name="air" alt="air" color="darkGray" stroke />;
    case DocumentUploadJobStatus.running:
      return (
        <Icon
          name="air"
          alt="air"
          color="darkGray"
          className="animate-spin"
          stroke
        />
      );
    case DocumentUploadJobStatus.finished:
      return <Icon name="finished" alt="finished" color="success" fill />;
    case DocumentUploadJobStatus.failed:
      return <Icon name="failed" alt="failed" color="error" fill />;
    default:
      return null;
  }
};

export default DocumentUploadJobStatusIcon;
