import { ShowProcedureAPIResponse } from '../../../../../../services/printer-flow/types';

export interface AttachmentUploadListContainerProps {
  fieldName: string;
  fileList?: FileList;
  procedure: ShowProcedureAPIResponse;
  formik: any;
  value: any;
}
export interface AttachmentUploadListProps {
  procedureId: number;
  procedureDocumentView: Array<string>;
  setProcedureDocumentView: React.Dispatch<React.SetStateAction<Array<string>>>;
}
