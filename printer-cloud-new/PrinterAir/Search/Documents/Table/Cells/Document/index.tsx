import * as React from 'react';
import { DocumentCellContainerProps } from './types';
import DocumentCell from './Document';

const DocumentCellContainer = ({ document }: DocumentCellContainerProps) => {
  return <DocumentCell document={document} />;
};

export default DocumentCellContainer;
