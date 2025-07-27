import * as React from 'react';
import { DocumentCopyJobStatusIconContainerProps } from './types';
import DocumentCopyJobStatusIcon from './StatusIcon';

const DocumentCopyJobStatusIconContainer = ({
  status,
}: DocumentCopyJobStatusIconContainerProps) => {
  return <DocumentCopyJobStatusIcon status={status} />;
};

export default DocumentCopyJobStatusIconContainer;
