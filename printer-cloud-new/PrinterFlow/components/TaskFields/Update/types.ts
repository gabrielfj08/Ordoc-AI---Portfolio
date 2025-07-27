import {
  ShowTaskTemplateAPIResponse,
  IndexTaskField,
  UpdateTaskFieldAPIResponse,
} from '../../../../services/printer-flow/types';
import { fieldTypeParams } from '../../../../services/printer-flow/types/taskField';

export interface UpdateTaskFieldContainerProps {
  taskField: IndexTaskField;
  taskTemplate: ShowTaskTemplateAPIResponse;
  type: taskFieldActionType;
  setType: React.Dispatch<React.SetStateAction<taskFieldActionType>>;
}

export interface UpdateTaskFieldProps {
  onSubmit: (
    values: UpdateTaskFieldFormValues
  ) => Promise<UpdateTaskFieldAPIResponse>;
  taskField: IndexTaskField;
  taskTemplate: ShowTaskTemplateAPIResponse;
  type: taskFieldActionType;
  setType: React.Dispatch<React.SetStateAction<taskFieldActionType>>;
}

export interface UpdateTaskFieldFormValues {
  label: string;
  fieldType: fieldTypeParams;
  options: Array<string>;
  values?: any;
}

export type taskFieldActionType = 'create' | 'show' | 'edit';
