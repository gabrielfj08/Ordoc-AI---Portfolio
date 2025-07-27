import * as React from 'react';
import { DocumentCellContainerProps } from './types';
import DocumentCell from './Document';

const DocumentCellContainer = ({
  sharedDocument,
}: DocumentCellContainerProps) => {
  return <DocumentCell sharedDocument={sharedDocument} />;
};

export default DocumentCellContainer;
