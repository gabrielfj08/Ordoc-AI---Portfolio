import { IndexExternalTasksParams } from '../../services/flow-cidadao/types';

export interface ExternalTasksProps {
  params: IndexExternalTasksParams;
  setParams: React.Dispatch<React.SetStateAction<IndexExternalTasksParams>>;
}

export interface Item {
  id: string;
  value: string;
  label: string;
}
