import { menuOptions } from '../../../../../../components/MenuButton/types';
import { IndexTaskTemplate } from '../../../../../../services/printer-flow/types';

export interface TaskTemplateMenuCellContainerProps {
  taskTemplate: IndexTaskTemplate;
}

export interface TaskTemplateMenuCellProps {
  options: Array<menuOptions>;
}
