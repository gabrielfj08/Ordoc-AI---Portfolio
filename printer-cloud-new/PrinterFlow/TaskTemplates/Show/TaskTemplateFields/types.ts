import {
  ShowTaskTemplateAPIResponse,
  IndexTaskField,
} from '../../../../services/printer-flow/types';

export interface TaskTemplateFieldsContainerProps {
  taskTemplate: ShowTaskTemplateAPIResponse;
}

export interface TaskTemplateFieldsProps {
  taskFields: Array<IndexTaskField>;
  taskTemplate: ShowTaskTemplateAPIResponse;
  totalDocs: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export interface TaskTemplateFieldsErrorProps {
  taskTemplate: ShowTaskTemplateAPIResponse;
}

export interface TaskTemplateFieldsEmptyProps {
  taskTemplate: ShowTaskTemplateAPIResponse;
}
