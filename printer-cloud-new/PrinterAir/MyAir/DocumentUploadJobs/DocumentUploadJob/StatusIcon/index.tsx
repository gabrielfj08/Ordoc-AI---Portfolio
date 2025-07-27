import * as React from 'react';
import { DocumentUploadJobStatusIconContainerProps } from './types';
import DocumentUploadJobStatusIcon from './StatusIcon';

const DocumentUploadJobStatusIconContainer = ({ status }: DocumentUploadJobStatusIconContainerProps) => {
  return (
    <DocumentUploadJobStatusIcon status={status} />
  );
};

export default DocumentUploadJobStatusIconContainer;
