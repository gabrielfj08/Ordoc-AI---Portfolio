import { ShowProcedureTemplate } from '../../../../../../services/printer-flow/types';
import {
  BaseProcedureTemplateDocument,
  IndexProcedureTemplateDocumentsPayload,
  ShowProcedureTemplateDocument,
} from '../../../../../../services/printer-flow/types/procedureTemplateDocument';

export interface SubjectDocumentListContainerProps {
  params: IndexProcedureTemplateDocumentsPayload;
  procedureTemplateDocuments: BaseProcedureTemplateDocument;
  setTotalObjects: React.Dispatch<React.SetStateAction<number>>;
  procedureTemplate: ShowProcedureTemplate;
}

export interface SubjectDocumentListProps {
  procedureTemplateDocuments: Array<ShowProcedureTemplateDocument>;
  procedureTemplate: ShowProcedureTemplate;
}
