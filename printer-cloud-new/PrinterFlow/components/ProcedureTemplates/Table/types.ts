import { IndexProcedureTemplate } from '../../../../services/printer-flow/types/procedureTemplate';
import { FilterProcedureTemplateParams } from '../../../ProcedureTemplates/types';

export interface ProcedureTemplatesTableContainerProps {
  params: FilterProcedureTemplateParams;
  setTotalObjects: React.Dispatch<React.SetStateAction<number>>;
}

export interface ProcedureTemplatesTableProps {
  data: Array<IndexProcedureTemplate>;
}
