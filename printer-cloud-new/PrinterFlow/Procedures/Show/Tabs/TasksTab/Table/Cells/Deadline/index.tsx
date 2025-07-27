import * as React from 'react';
import { DeadlineCellContainerProps } from './types';
import DeadlineCell from './Deadline';

const DeadlineCellContainer = ({ task }: DeadlineCellContainerProps) => {
  return <DeadlineCell task={task} />;
};

export default DeadlineCellContainer;
