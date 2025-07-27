export interface UploadProcedureShowDocumentTemplateContainerProps {
  color?: string;
  procedureTemplateId: number;
  fieldName: string;
}

export interface UploadProcedureShowDocumentTemplateProps {
  color?: string;
  link: string | null;
  name: string | null;
}

export interface AttachmentData {
  link: string | null;
  name: string | null;
}
