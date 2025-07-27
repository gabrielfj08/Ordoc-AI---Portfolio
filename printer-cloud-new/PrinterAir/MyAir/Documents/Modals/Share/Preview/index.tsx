import * as React from 'react';
import { DocumentPreviewModalContainerProps } from './types';
import DocumentPreviewModal from './Preview';

const DocumentPreviewModalContainer = ({
  sharedDocument,
}: DocumentPreviewModalContainerProps) => {
  return <DocumentPreviewModal sharedDocument={sharedDocument} />;
};

export default DocumentPreviewModalContainer;
