import {
  ShowTaskTemplateAPIResponse,
  UpdateTaskTemplateAPIResponse,
} from '../../../services/printer-flow/types';

export interface EditTaskTemplateContainerProps {
  taskTemplateId: number;
}

export interface EditTaskTemplateProps {
  taskTemplate: ShowTaskTemplateAPIResponse;
  onSubmit: (
    values: EditTaskTemplateFormValues
  ) => Promise<UpdateTaskTemplateAPIResponse>;
}

export interface EditTaskTemplateFormValues {
  name: string;
  description: string;
}
