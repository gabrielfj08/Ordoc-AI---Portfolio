import { ShowProcedureAPIResponse } from '../../../../../../services/printer-flow/types';

export interface AttachmentUploadListProps {
  procedureId: number;
  procedureDocumentUuids: Array<string>;
  procedureDocumentView: Array<string>;
  fieldName: string;
  formik: any;
  setProcedureDocumentUUids: React.Dispatch<
    React.SetStateAction<Array<string>>
  >;
  setProcedureDocumentView: React.Dispatch<React.SetStateAction<Array<string>>>;
}

export interface AttachmentUploadListContainerProps {
  fieldName: string;
  fileList: FileList;
  procedure: ShowProcedureAPIResponse;
  formik: any;
}
