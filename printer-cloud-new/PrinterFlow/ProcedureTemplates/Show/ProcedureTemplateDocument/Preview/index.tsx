import * as React from 'react';
import { DocumentPreviewModalContainerProps } from './types';
import DocumentPreviewModal from './Preview';

const DocumentPreviewModalContainer = ({
  procedureTemplateDocument,
}: DocumentPreviewModalContainerProps) => {
  return (
    <DocumentPreviewModal
      procedureTemplateDocument={procedureTemplateDocument}
    />
  );
};

export default DocumentPreviewModalContainer;
