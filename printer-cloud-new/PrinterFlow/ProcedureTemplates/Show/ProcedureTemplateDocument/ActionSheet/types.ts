import {
  BaseProcedureTemplate,
  BaseProcedureTemplateDocument,
} from '../../../../../services/printer-flow/types';

export interface ProcedureTemplateActionSheetContainerProps {
  fileList: FileList;
  procedureTemplateDocument: BaseProcedureTemplateDocument;
  procedureTemplate: BaseProcedureTemplate;
}

export interface ProcedureTemplateActionSheetProps {
  documentUploadIds: Array<number>;
}
