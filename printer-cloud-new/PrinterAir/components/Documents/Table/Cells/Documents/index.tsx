import * as React from 'react';
import DocumentCell from './Documents';
import { DocumentCellContainerProps } from './types';

const DocumentCellContainer = ({ document }: DocumentCellContainerProps) => {
  return <DocumentCell document={document} />;
};

export default DocumentCellContainer;
