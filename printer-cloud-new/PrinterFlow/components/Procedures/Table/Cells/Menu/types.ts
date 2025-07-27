import { IndexProcedure } from '../../../../../../services/printer-flow/types';
import { menuOptions } from '../../../../../../components/MenuButton/types';

export interface MenuCellContainerProps {
  procedure: IndexProcedure;
}
export interface MenuCellProps {
  options: Array<menuOptions>;
}
