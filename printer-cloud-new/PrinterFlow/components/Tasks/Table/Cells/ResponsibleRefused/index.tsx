import * as React from 'react';
import { ResponsibleRefusedTaskCellContainerProps } from './types';
import ResponsibleRefusedTaskCell from './ResponsibleRefused';

const ResponsibleRefusedTaskCellContainer = ({
  task,
}: ResponsibleRefusedTaskCellContainerProps) => {
  return <ResponsibleRefusedTaskCell task={task} />;
};
export default ResponsibleRefusedTaskCellContainer;
