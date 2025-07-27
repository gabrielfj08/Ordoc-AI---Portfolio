import { taskTemplateStatus } from '../../services/printer-flow/types/taskTemplate';

export interface TaskTemplatesProps {
  params: FilterTaskTemplateParams;
  setParams: React.Dispatch<React.SetStateAction<FilterTaskTemplateParams>>;
}

export interface FilterTaskTemplateParams {
  order: string;
  direction: string;
  q: string;
  page: number;
  perPage: number;
  status: taskTemplateStatus;
}
