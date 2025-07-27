import { ShowProcedureTemplate } from '../../../../../services/printer-flow/types';
import {
  BaseProcedureTemplateDocument,
  IndexProcedureTemplateDocumentsPayload,
  ShowProcedureTemplateDocument,
} from '../../../../../services/printer-flow/types/procedureTemplateDocument';

export interface ProcedureTemplateDocumentListContainerProps {
  params: IndexProcedureTemplateDocumentsPayload;
  procedureTemplateDocuments: BaseProcedureTemplateDocument;
  setTotalObjects: React.Dispatch<React.SetStateAction<number>>;
  procedureTemplate: ShowProcedureTemplate;
}

export interface ProcedureTemplateDocumentListProps {
  procedureTemplateDocuments: Array<ShowProcedureTemplateDocument>;
  procedureTemplate: ShowProcedureTemplate;
}
