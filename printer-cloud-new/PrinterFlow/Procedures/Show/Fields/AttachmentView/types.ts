import {
  IndexProcedureDocument,
  ShowProcedureDocumentAPIResponse,
} from '../../../../../services/printer-flow/types';

export interface AttachmentListContainerProps {
  attachmentUuids: Array<string>;
  fieldName: string;
  procedureId: number;
}

export interface AttachmentListProps {
  attachments: Array<IndexProcedureDocument>;
  fieldName: string;
  procedureId: number;
}

export interface AttachmentListItemContainerProps {
  procedureId: number;
  procedureDocumentUuid: string;
}

export interface AttachmentListItemProps {
  item: ShowProcedureDocumentAPIResponse;
}
