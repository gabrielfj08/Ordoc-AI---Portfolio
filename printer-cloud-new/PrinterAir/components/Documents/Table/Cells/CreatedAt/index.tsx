import * as React from 'react';
import CreatedAtCell from './CreatedAt';
import { DocumentCreatedAtCellContainerProps } from './types';

const CreatedAtCellContainer = ({
  document,
}: DocumentCreatedAtCellContainerProps) => {
  return (
    <CreatedAtCell
      document={document}
    />
  );
};

export default CreatedAtCellContainer;
