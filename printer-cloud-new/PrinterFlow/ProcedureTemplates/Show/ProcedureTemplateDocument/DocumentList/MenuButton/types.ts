import { BaseProcedureTemplateDocument } from '../../../../../../services/printer-flow/types/procedureTemplateDocument';
import { menuOptions } from '../../../../../../components/MenuButton/types';

export interface ProcedureTemplateMenuButtonListContainerProps {
  procedureTemplateDocument: BaseProcedureTemplateDocument;
}

export interface ProcedureTemplateMenuButtonListProps {
  options: Array<menuOptions>;
}
