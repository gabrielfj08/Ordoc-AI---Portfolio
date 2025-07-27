import * as React from 'react';
import { SharedByCellContainerProps } from './types';
import SharedByCell from './SharedBy';

const SharedByCellContainer = ({
  sharedDocument,
}: SharedByCellContainerProps) => {
  return <SharedByCell sharedDocument={sharedDocument} />;
};

export default SharedByCellContainer;
