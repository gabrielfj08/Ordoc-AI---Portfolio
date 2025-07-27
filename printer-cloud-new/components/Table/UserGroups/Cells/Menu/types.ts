import { menuOptions } from '../../../../../components/MenuButton/types';
import { IndexUserGroup } from '../../../../../services/types';

export interface UserGroupMenuCellContainerProps {
  userGroup: IndexUserGroup;
}

export interface UsersMenuButtonCellProps {
  options: Array<menuOptions>;
}
