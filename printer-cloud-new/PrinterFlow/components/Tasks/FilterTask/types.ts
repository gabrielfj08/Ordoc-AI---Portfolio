import { FilterTasksParams } from '../Tabs/types';

export interface FilterButtonTaskProps {
  children: React.ReactNode;
  params: FilterTasksParams;
  setParams: React.Dispatch<React.SetStateAction<FilterTasksParams>>;
}

export interface FilterButtonTaskContainerProps {
  children: React.ReactNode;
  params: FilterTasksParams;
  setParams: React.Dispatch<React.SetStateAction<FilterTasksParams>>;
}
