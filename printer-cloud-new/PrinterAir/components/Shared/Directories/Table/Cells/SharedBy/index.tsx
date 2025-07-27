import * as React from 'react';
import { SharedByCellContainerProps } from './types';
import SharedByCell from './SharedBy';

const SharedByCellContainer = ({
  sharedDirectory,
}: SharedByCellContainerProps) => {
  return <SharedByCell sharedDirectory={sharedDirectory} />;
};

export default SharedByCellContainer;
