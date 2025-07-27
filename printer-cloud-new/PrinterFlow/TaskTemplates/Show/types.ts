import {
  BaseTaskTemplate,
  ShowTaskTemplateAPIResponse,
} from '../../../services/printer-flow/types';

export interface ShowTaskTemplateContainerProps {
  taskTemplateId: number;
  setTaskTemplate: React.Dispatch<React.SetStateAction<BaseTaskTemplate>>;
}

export interface ShowTaskTemplateProps {
  taskTemplate: ShowTaskTemplateAPIResponse;
}
