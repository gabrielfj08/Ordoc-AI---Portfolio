import { ShowProcedureDocumentAPIResponse } from '../../../../services/flow-cidadao/types';

export interface AttachmentListItemContainerProps {
  procedureId: number;
  procedureDocumentUuid: string;
}

export interface AttachmentListItemProps {
  item: ShowProcedureDocumentAPIResponse;
}
