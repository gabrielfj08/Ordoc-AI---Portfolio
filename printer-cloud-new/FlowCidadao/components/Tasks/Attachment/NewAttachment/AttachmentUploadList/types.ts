import { ShowExternalTaskAPIResponse } from '../../../../../../services/flow-cidadao/types';

export interface AttachmentUploadListContainerProps {
  task: ShowExternalTaskAPIResponse;
  fileList: FileList;
  formik: any;
  fieldName: string;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
  value: Array<number>;
}

export interface AttachmentUploadListProps {
  taskId: number;
  taskDocumentIds: Array<number>;
  setTaskDocumentIds: React.Dispatch<React.SetStateAction<Array<number>>>;
  setTaskDocumentView: React.Dispatch<React.SetStateAction<Array<number>>>;
  taskDocumentView: Array<number>;
  formik: any;
  fieldName: string;
  value: Array<number>;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
}
