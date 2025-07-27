import { IndexFieldDocumentTemplate } from '../../../../../services/printer-flow/types';

export interface FieldDocumentTemplateSelectOptionsContainerProps {
  query: string;
  open: boolean;
}

export interface SelectFieldDocumentTemplateOptionsProps {
  fieldDocumentTemplates: Array<IndexFieldDocumentTemplate>;
}
