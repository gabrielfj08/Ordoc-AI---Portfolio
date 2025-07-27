import * as React from 'react';
import { SharedAtCellContainerProps } from './types';
import SharedAtCell from './SharedAt';

const SharedAtCellContainer = ({
  sharedDocument,
}: SharedAtCellContainerProps) => {
  return <SharedAtCell sharedDocument={sharedDocument} />;
};

export default SharedAtCellContainer;
