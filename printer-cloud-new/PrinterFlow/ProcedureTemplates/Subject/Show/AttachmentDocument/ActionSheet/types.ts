import {
  BaseProcedureTemplate,
  BaseProcedureTemplateDocument,
} from '../../../../../../services/printer-flow/types';

export interface UploadDocumentActionSheetProps {
  attachmentUploadIds: Array<number>;
}

export interface SubjectUploadDocumentContainerProps {
  fileList: FileList;
  procedureTemplateDocument: BaseProcedureTemplateDocument;
  procedureTemplate: BaseProcedureTemplate;
}
