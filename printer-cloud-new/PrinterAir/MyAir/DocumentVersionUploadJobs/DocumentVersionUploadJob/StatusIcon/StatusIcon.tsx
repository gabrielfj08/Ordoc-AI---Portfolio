import * as React from 'react';
import { Icon } from 'printer-ui';
import { DocumentVersionUploadJobStatus } from '../../../../../PrinterAir/constants';
import { DocumentVersionUploadJobStatusIconProps } from './types';

const DocumentVersionUploadJobStatusIcon = ({
  status,
}: DocumentVersionUploadJobStatusIconProps) => {
  switch (status) {
    case DocumentVersionUploadJobStatus.created:
      return <Icon name="air" alt="air" color="darkGray" stroke />;
    case DocumentVersionUploadJobStatus.running:
      return (
        <Icon
          name="air"
          alt="air"
          color="darkGray"
          className="animate-spin"
          stroke
        />
      );
    case DocumentVersionUploadJobStatus.finished:
      return <Icon name="finished" alt="finished" color="success" fill />;
    case DocumentVersionUploadJobStatus.failed:
      return <Icon name="failed" alt="failed" color="error" fill />;
    default:
      return null;
  }
};

export default DocumentVersionUploadJobStatusIcon;
