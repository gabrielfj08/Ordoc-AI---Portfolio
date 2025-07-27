import * as React from 'react';
import { DocumentsContainerProps } from './types';
import DocumentsTable from '../Documents/Table';

const DocumentsContainer = ({
  directoryId,
  setSelectedDocumentIds,
  organizationId,
}: DocumentsContainerProps) => {
  return (
    <>
      <DocumentsTable
        organizationId={organizationId}
        directoryId={directoryId}
        setSelectedDocumentIds={setSelectedDocumentIds}
      />
    </>
  );
};

export default DocumentsContainer;
