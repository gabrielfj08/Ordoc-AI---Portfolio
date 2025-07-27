import * as React from 'react';
import { DocumentVersionUploadJobStatusIconContainerProps } from './types';
import DocumentVersionUploadJobStatusIcon from './StatusIcon';

const DocumentVersionUploadJobStatusIconContainer = ({ status }: DocumentVersionUploadJobStatusIconContainerProps) => {
  return (
    <DocumentVersionUploadJobStatusIcon status={status} />
  );
};

export default DocumentVersionUploadJobStatusIconContainer;
