import { menuOptions } from '../../../../components/MenuButton/types';
import {
  IndexTaskField,
  ShowTaskTemplateAPIResponse,
} from '../../../../services/printer-flow/types';

export interface TaskFieldsMenuButtonContainerProps {
  taskField: IndexTaskField;
  taskTemplate: ShowTaskTemplateAPIResponse;
  setType: React.Dispatch<React.SetStateAction<taskFieldType>>;
}

export interface TaskFieldsMenuButtonProps {
  options: Array<menuOptions>;
}

export type taskFieldType = 'create' | 'show' | 'edit';
