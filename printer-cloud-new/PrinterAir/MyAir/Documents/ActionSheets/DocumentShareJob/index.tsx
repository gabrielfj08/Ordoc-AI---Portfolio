import * as React from 'react';
import { DocumentShareJobContainerProps } from './types';
import DocumentShareJob from './DocumentShareJob';

const DocumentShareJobContainer = ({
  batchOperationJob,
}: DocumentShareJobContainerProps) => {
  if (!batchOperationJob) return null;

  return <DocumentShareJob shareDocumentId={batchOperationJob.id} />;
};

export default DocumentShareJobContainer;
