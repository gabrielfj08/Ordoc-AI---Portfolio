import { ShowExternalTaskDocumentAPIResponse } from '../../../../../../../services/flow-cidadao/types';

export interface NewTaskAttachmentItemContainerProps {
  fieldName: string;
  formik: any;
  taskDocumentId: number;
  taskDocumentIds: Array<number>;
  setFailedDocumentId: React.Dispatch<React.SetStateAction<Array<number>>>;
  setRemoveItemId: React.Dispatch<React.SetStateAction<Array<number>>>;
  taskId: number;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface NewTaskAttachmentItemProps {
  onClose: () => void;
  item: ShowExternalTaskDocumentAPIResponse;
  itemVisibility: boolean;
}
