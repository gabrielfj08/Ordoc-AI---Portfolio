import {
  ShowTaskTemplateAPIResponse,
  IndexTaskField,
} from '../../../../services/printer-flow/types';

export interface ShowTaskFieldContainerProps {
  taskField: IndexTaskField;
  taskTemplate: ShowTaskTemplateAPIResponse;
  type: taskFieldActionType;
  setType: React.Dispatch<React.SetStateAction<taskFieldActionType>>;
}

export interface ShowTaskFieldProps {
  taskField: IndexTaskField;
  taskTemplate: ShowTaskTemplateAPIResponse;
  type: taskFieldActionType;
  setType: React.Dispatch<React.SetStateAction<taskFieldActionType>>;
}

export type taskFieldActionType = 'create' | 'show' | 'edit';
