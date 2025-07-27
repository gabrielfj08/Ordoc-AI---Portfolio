import { FilterTasksParams } from '../types';

export interface TaskProcedureFilterButtonContainerProps {
  children: React.ReactNode;
  params: FilterTasksParams;
  setParams: React.Dispatch<React.SetStateAction<FilterTasksParams>>;
}

export interface TaskProcedureFilterButtonProps {
  children: React.ReactNode;
  params: FilterTasksParams;
  setParams: React.Dispatch<React.SetStateAction<FilterTasksParams>>;
}
