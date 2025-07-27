import * as React from 'react';
import { DocumentCellContainerProps } from './types';
import DocumentCell from './Document';

const DocumentCellContainer = ({
  recentDocument,
}: DocumentCellContainerProps) => {
  return <DocumentCell recentDocument={recentDocument} />;
};

export default DocumentCellContainer;
