import { menuOptions } from '../../../../../components/MenuButton/types';
import { IndexPolicy } from '../../../../../services/types';

export interface PolicyMenuCellContainerProps {
  policy: IndexPolicy;
}

export interface PolicyMenuCellProps {
  options: Array<menuOptions>;
}
