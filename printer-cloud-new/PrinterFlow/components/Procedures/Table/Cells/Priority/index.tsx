import * as React from 'react';
import { PriorityCellContainerProps } from './types';
import PriorityCell from './Priority';

const PriorityCellContainer = ({ procedure }: PriorityCellContainerProps) => {
  return <PriorityCell procedure={procedure} />;
};

export default PriorityCellContainer;
