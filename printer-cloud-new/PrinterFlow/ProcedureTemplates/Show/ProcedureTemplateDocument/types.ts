import { ShowProcedureTemplate } from '../../../../services/printer-flow/types';
import {
  BaseProcedureTemplateDocument,
  IndexProcedureTemplateDocumentsPayload,
} from '../../../../services/printer-flow/types/procedureTemplateDocument';

export interface ShowProcedureTemplateDocumentContainerProps {
  procedureTemplateDocument: BaseProcedureTemplateDocument;
  procedureTemplate: ShowProcedureTemplate;
}

export interface ShowProcedureTemplateDocumentProps {
  params: IndexProcedureTemplateDocumentsPayload;
  setParams: React.Dispatch<
    React.SetStateAction<IndexProcedureTemplateDocumentsPayload>
  >;
  procedureTemplate: ShowProcedureTemplate;
  procedureTemplateDocument: BaseProcedureTemplateDocument;
}
