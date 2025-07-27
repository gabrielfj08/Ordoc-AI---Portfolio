import { multipleSelectItem } from '../../../../types';
import {
  CreateSignatureAPIResponse,
  ShowProcedureAPIResponse,
} from '../../../../services/printer-flow/types';

export interface NewSignatureRequestersContainerModalProps {
  procedure: ShowProcedureAPIResponse;
}

export interface NewSignatureRequestersModalProps {
  procedure: ShowProcedureAPIResponse;
  procedureDocuments: Array<multipleSelectItem>;
  taskDocuments: Array<multipleSelectItem>;
  requesters: Array<multipleSelectItem>;
  onSubmit: (
    values: NewSignatureRequesterFormValues
  ) => Promise<CreateSignatureAPIResponse>;
}

export interface NewSignatureRequesterFormValues {
  requesterIds: Array<number>;
  procedureDocumentIds: Array<number>;
  taskDocumentIds: Array<number>;
  responsibleAssignee?: string;
}
