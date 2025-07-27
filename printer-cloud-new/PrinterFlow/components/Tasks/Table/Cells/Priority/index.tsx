import * as React from 'react';
import { PriorityCellContainerProps } from './types';
import PriorityCell from './Priority';

const PriorityCellContainer = ({ task }: PriorityCellContainerProps) => {
  return <PriorityCell task={task} />;
};

export default PriorityCellContainer;
