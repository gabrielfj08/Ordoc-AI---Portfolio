import { menuOptions } from '../../../../../../components/MenuButton/types';
import { IndexProcedureTemplate } from '../../../../../../services/printer-flow/types/procedureTemplate';

export interface MenuCellContainerProps {
  procedureTemplates: IndexProcedureTemplate;
}

export interface MenuCellProps {
  options: Array<menuOptions>;
}
