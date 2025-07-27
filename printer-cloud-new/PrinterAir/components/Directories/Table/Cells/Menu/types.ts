import { IndexDirectory } from '../../../../../../services/printer-air/types';
import { menuOptions } from '../../../../../components/MenuButton/types';
export interface MenuCellContainerProps {
  directory: IndexDirectory;
}
export interface MenuCellProps {
  options: Array<menuOptions>;
}
