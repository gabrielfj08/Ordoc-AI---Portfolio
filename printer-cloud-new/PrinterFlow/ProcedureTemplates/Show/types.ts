import { BaseProcedureTemplateDocument } from '../../../services/printer-flow/types/procedureTemplateDocument';
import { ShowProcedureTemplate } from '../../../services/printer-flow/types';

export interface ShowProcedureTemplateContainerProps {
  procedureTemplateId: number;
  procedureTemplateDocument: BaseProcedureTemplateDocument;
  setProcedureTemplate: React.Dispatch<
    React.SetStateAction<ShowProcedureTemplate>
  >;
}

export interface ShowProcedureTemplateProps {
  procedureTemplate: ShowProcedureTemplate;
  procedureTemplateDocument: BaseProcedureTemplateDocument;
}
