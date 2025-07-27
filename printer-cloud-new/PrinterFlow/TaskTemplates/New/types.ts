import { CreateTaskTemplateAPIResponse } from '../../../services/printer-flow/types';

export interface NewTaskTemplateProps {
  onSubmit: (
    values: NewTaskTemplateFormValues
  ) => Promise<CreateTaskTemplateAPIResponse>;
}

export interface NewTaskTemplateFormValues {
  name: string;
  description: string;
}
