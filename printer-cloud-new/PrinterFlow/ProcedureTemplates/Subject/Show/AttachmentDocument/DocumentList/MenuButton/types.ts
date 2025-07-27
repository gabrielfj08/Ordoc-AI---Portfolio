import { BaseProcedureTemplateDocument } from '../../../../../../../services/printer-flow/types/procedureTemplateDocument';
import { menuOptions } from '../../../../../../../components/MenuButton/types';

export interface MenuButtonListProps {
  options: Array<menuOptions>;
}

export interface SubjectMenuButtonListContainerProps {
  procedureTemplateDocument: BaseProcedureTemplateDocument;
}
