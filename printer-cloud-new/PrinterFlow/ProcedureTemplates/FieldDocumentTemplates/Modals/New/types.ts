export interface NewFieldDocumentTemplateModalProps {
  onSubmit: (values: NewFieldDocumentTemplateFormValues) => void;
}

export interface NewFieldDocumentTemplateFormValues {
  name: string;
  fileList: FileList | null;
}
