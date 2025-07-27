import { IndexRecentDocument } from '../../../../../../services/printer-air/types';
import { menuOptions } from '../../../../MenuButton/types';
export interface MenuCellContainerProps {
  recentDocument: IndexRecentDocument;
}
export interface MenuCellProps {
  options: Array<menuOptions>;
}
