import * as React from 'react';
import { SharedAtCellContainerProps } from './types';
import SharedAtCell from './SharedAt';

const SharedAtCellContainer = ({
  sharedDirectory,
}: SharedAtCellContainerProps) => {
  return <SharedAtCell sharedDirectory={sharedDirectory} />;
};

export default SharedAtCellContainer;
