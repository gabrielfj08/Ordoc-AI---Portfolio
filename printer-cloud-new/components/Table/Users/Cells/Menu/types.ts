import { menuOptions } from '../../../../../components/MenuButton/types';
import { IndexUser } from '../../../../../services/types';

export interface MenuCellContainerProps {
  user: IndexUser;
}

export interface UsersMenuButtonCellProps {
  options: Array<menuOptions>;
}
