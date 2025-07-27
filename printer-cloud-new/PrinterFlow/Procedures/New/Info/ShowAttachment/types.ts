import { IndexProcedureTemplateDocuments } from '../../../../../services/printer-flow/types';

export interface ShowAttachmentContainerProps {
  procedureTemplateId: number;
}

export interface ShowAttachmentInfoProps {
  procedureTemplateId: number;
  procedureTemplateDocuments: IndexProcedureTemplateDocuments;
}
