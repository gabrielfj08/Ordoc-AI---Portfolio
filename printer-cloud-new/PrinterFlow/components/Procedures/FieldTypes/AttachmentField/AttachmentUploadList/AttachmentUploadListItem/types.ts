import { ShowProcedureDocumentAPIResponse } from '../../../../../../../services/printer-flow/types';

export interface AttachmentUploadListItemContainerProps {
  procedureId: number;
  procedureDocumentUuid: string;
  formik: any;
  fieldName: string;
  procedureDocumentUuids: Array<string>;
  setFailedDocumentUuid: React.Dispatch<React.SetStateAction<Array<string>>>;
  setRemoveItemUuid: React.Dispatch<React.SetStateAction<Array<string>>>;
}

export interface AttachmentUploadListItemProps {
  item: ShowProcedureDocumentAPIResponse;
  onClose: () => void;
  itemVisibility: boolean;
}
