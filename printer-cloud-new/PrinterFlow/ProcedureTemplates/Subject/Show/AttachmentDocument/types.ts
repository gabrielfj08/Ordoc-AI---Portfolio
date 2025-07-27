import {
  BaseProcedureTemplateDocument,
  IndexProcedureTemplateDocumentsPayload,
} from '../../../../../services/printer-flow/types';
import { ShowProcedureTemplate } from '../../../../../services/printer-flow/types/procedureTemplate';

export interface ShowSubjectDocumentContainerProps {
  procedureTemplate: ShowProcedureTemplate;
  procedureTemplateDocument: BaseProcedureTemplateDocument;
}

export interface ShowSubjectDocumentProps {
  params: IndexProcedureTemplateDocumentsPayload;
  setParams: React.Dispatch<
    React.SetStateAction<IndexProcedureTemplateDocumentsPayload>
  >;
  procedureTemplate: ShowProcedureTemplate;
  procedureTemplateDocument: BaseProcedureTemplateDocument;
}
