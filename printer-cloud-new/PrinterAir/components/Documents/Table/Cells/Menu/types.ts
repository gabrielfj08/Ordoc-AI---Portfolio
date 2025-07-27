import { menuOptions } from '../../../../MenuButton/types';
import { IndexDocument } from '../../../../../../services/printer-air/types/document';

export interface MenuCellProps {
  options: Array<menuOptions>;
}

export interface MenuCellContainerProps {
  document: IndexDocument;
}
