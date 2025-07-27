import {
  ShowTaskTemplateAPIResponse,
  CreateTaskFieldAPIResponse,
} from '../../../../services/printer-flow/types';
import { fieldTypeParams } from '../../../../services/printer-flow/types/taskField';

export interface NewTaskFieldContainerProps {
  taskTemplate: ShowTaskTemplateAPIResponse;
  setHidden: React.Dispatch<React.SetStateAction<string>>;
}

export interface NewTaskFieldProps {
  onSubmit: (
    values: NewTaskFieldFormValues
  ) => Promise<CreateTaskFieldAPIResponse>;
  setHidden: React.Dispatch<React.SetStateAction<string>>;
}

export interface NewTaskFieldFormValues {
  label: string;
  fieldType: fieldTypeParams & '';
  options: [];
}

export type taskFieldActionType = 'create' | 'show' | 'edit';
