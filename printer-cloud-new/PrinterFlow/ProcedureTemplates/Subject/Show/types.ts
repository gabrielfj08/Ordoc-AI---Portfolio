import { BaseProcedureTemplateDocument } from '../../../../services/printer-flow/types';
import { ShowProcedureTemplate } from '../../../../services/printer-flow/types/procedureTemplate';

export interface ShowSubjectContainerProps {
  subjectId: number;
  procedureTemplateDocument: BaseProcedureTemplateDocument;
  setSubject: React.Dispatch<React.SetStateAction<ShowProcedureTemplate>>;
}

export interface ShowSubjectProps {
  procedureTemplate: ShowProcedureTemplate;
  procedureTemplateDocument: BaseProcedureTemplateDocument;
}
