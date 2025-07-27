import {
  BaseFieldDocumentTemplate,
  BaseField,
} from '../../../../../services/printer-flow/types';
export interface FieldDocumentTemplatesContainerProps {
  type: fieldValueOptionActionType;
  setType: React.Dispatch<React.SetStateAction<fieldValueOptionActionType>>;
  fieldDocumentTemplate: BaseFieldDocumentTemplate;
  fieldId: number;
  procedureTemplateId: number;
}

export interface FieldDocumentTemplatesProps {
  type: fieldValueOptionActionType;
  setType: React.Dispatch<React.SetStateAction<fieldValueOptionActionType>>;
  fieldId: number;
  procedureTemplateId: number;
  fieldDocumentTemplate: BaseFieldDocumentTemplate;
  onSubmit: (values: FieldDocumentTemplateFormValues) => Promise<BaseField>;
}

export interface FieldDocumentTemplateFormValues {
  fieldDocumentTemplateId: number;
}

export type fieldValueOptionActionType =
  | 'create'
  | 'edit'
  | 'openFieldValueOption'
  | 'openFieldDocumentTemplate'
  | 'show';
