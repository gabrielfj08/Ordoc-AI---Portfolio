import { ShowProcedureDocumentAPIResponse } from '../../../../../../../services/flow-cidadao/types';

export interface NewProcedureAttachmentUploadListItemContainerProps {
  color?: string;
  disabled?: boolean;
  fieldName: string;
  formik: any;
  procedureDocumentUuid: string;
  procedureDocumentUuids: Array<string>;
  procedureId: number;
  setFailedDocumentUuid: React.Dispatch<React.SetStateAction<Array<string>>>;
  setRemoveItemUuid: React.Dispatch<React.SetStateAction<Array<string>>>;
  setAttachmentLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface NewProcedureAttachmentUploadListItemProps {
  color?: string;
  item: ShowProcedureDocumentAPIResponse;
  itemVisibility: boolean;
  onClose: () => void;
}
