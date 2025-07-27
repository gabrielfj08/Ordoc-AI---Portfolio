import { menuOptions } from '../../../../../../components/MenuButton/types';
import { IndexProcedureTemplate } from '../../../../../../services/printer-flow/types/procedureTemplate';

export interface MenuButtonListProps {
  options: Array<menuOptions>;
}

export interface MenuButtonListContainerProps {
  procedureTemplate: IndexProcedureTemplate;
}
