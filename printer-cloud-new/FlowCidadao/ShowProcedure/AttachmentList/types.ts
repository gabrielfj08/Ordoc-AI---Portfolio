import { IndexProcedureDocument } from '../../../services/flow-cidadao/types/procedureDocument';

export interface AttachmentListProps {
  procedureDocuments: Array<IndexProcedureDocument>;
}

export interface AttachmentListContainerProps {
  procedureId: number;
  value: Array<string>;
}
