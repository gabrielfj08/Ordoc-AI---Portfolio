import * as React from 'react';
import { SourceCellContainerProps } from './types';
import SourceCell from './Source';

const SourceCellContainer = ({ procedure }: SourceCellContainerProps) => {
  return <SourceCell procedure={procedure} />;
};

export default SourceCellContainer;
