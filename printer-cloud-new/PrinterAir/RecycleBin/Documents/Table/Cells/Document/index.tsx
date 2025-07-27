import * as React from 'react';
import { DocumentCellContainerProps } from './types';
import DocumentCell from './Document';

const DocumentCellContainer = ({ document }: DocumentCellContainerProps) => {
  const documentName = document.originalFilename.substring(
    0,
    document.originalFilename.length - 9
  );

  return <DocumentCell documentName={documentName} document={document} />;
};

export default DocumentCellContainer;
