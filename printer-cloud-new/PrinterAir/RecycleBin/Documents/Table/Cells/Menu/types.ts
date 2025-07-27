import { IndexDocument } from '../../../../../../services/printer-air/types';
import { menuOptions } from '../../../../../components/MenuButton/types';

export interface MenuCellProps {
  options: Array<menuOptions>;
}

export interface MenuCellContainerProps {
  document: IndexDocument;
}
