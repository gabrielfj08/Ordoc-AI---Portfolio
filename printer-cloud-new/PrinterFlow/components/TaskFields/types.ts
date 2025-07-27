import {
  IndexTaskField,
  ShowTaskTemplateAPIResponse,
} from '../../../services/printer-flow/types';

export interface TaskFieldsContainerProps {
  taskField: IndexTaskField;
  taskTemplate: ShowTaskTemplateAPIResponse;
}

export interface TaskFieldsProps {
  taskField: IndexTaskField;
  taskTemplate: ShowTaskTemplateAPIResponse;
  type: taskFieldActionType;
  setType: React.Dispatch<React.SetStateAction<taskFieldActionType>>;
}

export type taskFieldActionType = 'create' | 'show' | 'edit';
