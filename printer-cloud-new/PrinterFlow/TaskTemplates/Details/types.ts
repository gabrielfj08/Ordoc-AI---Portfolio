import { ShowTaskTemplateAPIResponse } from '../../../services/printer-flow/types';

export interface TaskTemplateDetailsProps {
  taskTemplate: ShowTaskTemplateAPIResponse;
}

export interface TaskTemplateDetailsContainerProps {
  taskTemplateId: number;
}
