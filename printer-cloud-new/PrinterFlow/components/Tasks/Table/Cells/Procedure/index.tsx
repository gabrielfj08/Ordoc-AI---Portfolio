import * as React from 'react';
import { ProcedureCellContainerProps } from './types';
import ProcessNumberCell from './Procedure';

const ProcedureCellContainer = ({ task }: ProcedureCellContainerProps) => {
  return <ProcessNumberCell task={task} />;
};

export default ProcedureCellContainer;
