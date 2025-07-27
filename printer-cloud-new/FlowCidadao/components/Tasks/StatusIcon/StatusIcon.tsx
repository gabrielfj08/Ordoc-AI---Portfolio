import * as React from 'react';
import { Icon } from 'printer-ui';
import { AttachmentUploadStatus } from '../../../../PrinterFlow/constants/AttachmentUploadStatus';

const UploadExternalDocumentStatusIcon = ({ status }) => {
  switch (status) {
    case AttachmentUploadStatus.created:
      return <Icon name="loadingCircle" alt="loadingCircle" stroke />;
    case AttachmentUploadStatus.running:
      return (
        <Icon
          name="loadingCircle"
          alt="loadingCircle"
          className="animate-spin"
          stroke
        />
      );
    case AttachmentUploadStatus.finished:
      return <Icon name="finished" alt="finished" color="success" fill />;
    case AttachmentUploadStatus.failed:
      return <Icon name="failed" alt="failed" color="error" fill />;
    default:
      return null;
  }
};

export default UploadExternalDocumentStatusIcon;
