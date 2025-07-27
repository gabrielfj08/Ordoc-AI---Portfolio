import { menuOptions } from '../../../../../../components/MenuButton/types';
import { IndexTask } from '../../../../../../services/printer-flow/types';

export interface MenuCellContainerProps {
  task: IndexTask;
}
export interface MenuCellProps {
  options: Array<menuOptions>;
}
