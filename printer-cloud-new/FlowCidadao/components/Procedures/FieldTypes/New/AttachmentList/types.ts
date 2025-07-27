import { CreateExternalProcedureAPIResponse } from './../../../../../../services/flow-cidadao/types';
export interface NewProcedureAttachmentUploadListProps {
  color?: string;
  disabled?: boolean;
  fieldName: string;
  formik: any;
  procedureDocumentUuids: Array<string>;
  procedureDocumentView: Array<string>;
  procedureId: number;
  setProcedureDocumentUUids: React.Dispatch<
    React.SetStateAction<Array<string>>
  >;
  setProcedureDocumentView: React.Dispatch<React.SetStateAction<Array<string>>>;
  setAttachmentLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface NewProcedureAttachmentUploadListContainerProps {
  disabled?: boolean;
  color?: string;
  fieldName: string;
  fileList: FileList;
  formik: any;
  procedure: CreateExternalProcedureAPIResponse;
  value: Array<string>;
  setAttachmentLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
