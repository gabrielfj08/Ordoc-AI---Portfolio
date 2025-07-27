import {
  BaseProcedureTemplateDocument,
  BaseProcedureTemplate,
} from '../../../../../services/printer-flow/types';

export interface NewProcedureTemplateDocumentModalContainerProps {
  procedureTemplateDocument: BaseProcedureTemplateDocument;
  procedureTemplate: BaseProcedureTemplate;
}

export interface NewProcedureTemplateDocumentModalProps {
  onSubmit: (values: NewProcedureTemplateDocumentFormValues) => void;
}

export interface NewProcedureTemplateDocumentFormValues {
  fileList: FileList | null;
}
