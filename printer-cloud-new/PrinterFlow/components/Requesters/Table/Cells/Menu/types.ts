import { menuOptions } from '../../../../../../components/MenuButton/types';
import { IndexRequesters } from '../../../../../../services/printer-flow/types';

export interface MenuCellContainerProps {
  requester: IndexRequesters;
}

export interface MenuCellProps {
  options: Array<menuOptions>;
}
