import { menuOptions } from '../../../../../../components/MenuButton/types';
import { IndexGroupRequester } from '../../../../../../services/printer-flow/types';

export interface GroupsMenuButtonCellContainerProps {
  group: IndexGroupRequester;
}
export interface GroupsMenuButtonCellProps {
  options: Array<menuOptions>;
}
