import * as React from 'react';
import { DeadlineCellContainerProps } from './types';
import DeadlineCell from './Deadline';

const DeadlineCellContainer = ({ procedure }: DeadlineCellContainerProps) => {
  return <DeadlineCell procedure={procedure} />;
};

export default DeadlineCellContainer;
