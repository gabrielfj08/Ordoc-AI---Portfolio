import * as React from 'react';
import DocumentStatusCell from './Status';
import { DocumentStatusCellContainerProps } from './types';

const DocumentStatusCellContainer = ({
  document,
}: DocumentStatusCellContainerProps) => {
  return <DocumentStatusCell document={document} />;
};

export default DocumentStatusCellContainer;
