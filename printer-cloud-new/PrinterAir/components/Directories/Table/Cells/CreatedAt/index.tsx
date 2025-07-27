import * as React from 'react';
import CreatedAtCell from './CreatedAt';
import { CreatedAtCellContainerProps } from './types';

const DirectoryCreatedAtCellContainer = ({
  directory,
}: CreatedAtCellContainerProps) => {
  return (
    <CreatedAtCell
      directory={directory}
    />
  );
};

export default DirectoryCreatedAtCellContainer;
