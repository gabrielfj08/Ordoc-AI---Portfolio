import { CreateShareableLinkAPIResponse } from '../../../../services/printer-air/types';
export interface ShareableLinksModalContainerProps {
  documentId: number;
}
export interface ShareableLinksModalProps {
  onSubmit: (
    values: CreateShareableLinkFormValues
  ) => Promise<CreateShareableLinkAPIResponse>;
  documentId: number;
}
export interface CreateShareableLinkFormValues {
  expiresIn: number | null;
}
