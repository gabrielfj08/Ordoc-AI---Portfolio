import * as React from 'react';
import { TaskProcedureFilterButtonContainerProps } from './types';
import TaskProcedureFilterButton from './TaskProcedureFilter';

const TaskProcedureFilterButtonContainer = ({
  children,
  params,
  setParams,
}: TaskProcedureFilterButtonContainerProps) => {
  return (
    <TaskProcedureFilterButton params={params} setParams={setParams}>
      {children}
    </TaskProcedureFilterButton>
  );
};

export default TaskProcedureFilterButtonContainer;
