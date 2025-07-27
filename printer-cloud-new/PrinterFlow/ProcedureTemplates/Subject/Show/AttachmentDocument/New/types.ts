import {
  BaseProcedureTemplateDocument,
  BaseProcedureTemplate,
} from '../../../../../../services/printer-flow/types';

export interface NewSubjectDocumentContainerProps {
  procedureTemplateDocument: BaseProcedureTemplateDocument;
  procedureTemplate: BaseProcedureTemplate;
}

export interface NewSubjectDocumentModalProps {
  onSubmit: (values: NewSubjectDocumentFormValues) => void;
}

export interface NewSubjectDocumentFormValues {
  fileList: FileList | null;
}
