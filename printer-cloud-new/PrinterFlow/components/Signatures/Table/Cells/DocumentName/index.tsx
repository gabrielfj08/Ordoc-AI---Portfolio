import * as React from 'react';
import { CellsContainerProps } from '../../types';
import DocumentNameCell from './DocumentName';

const DocumentNameCellContainer = ({ signature }: CellsContainerProps) => {
  return (
    <div className="truncate">
      <DocumentNameCell signature={signature} />
    </div>
  );
};

export default DocumentNameCellContainer;
