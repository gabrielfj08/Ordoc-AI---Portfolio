export interface NewProcedureShowDocumentTemplateContainerProps {
  color?: string;
  procedureTemplateId: number;
  fieldName: string;
}

export interface ShowDocumentTemplateProps {
  color?: string;
  link: string | null;
  name: string | null;
}

export interface AttachmentData {
  link: string | null;
  name: string | null;
}
