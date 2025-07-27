import { ShowProcedureTemplate } from '../../../../services/printer-flow/types';
import { FilterProcedureTemplateParams } from '../../../ProcedureTemplates/types';

export interface ShowProcedureTemplateSubjectProps {
  params: FilterProcedureTemplateParams;
  setParams: React.Dispatch<
    React.SetStateAction<FilterProcedureTemplateParams>
  >;
  procedureTemplate: ShowProcedureTemplate;
}

export interface ShowProcedureTemplateSubjectContainerProps {
  procedureTemplate: ShowProcedureTemplate;
}
