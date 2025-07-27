import { BaseFieldValueOption } from '../../../../../services/printer-flow/types';

export interface FieldValueOptionsContainerProps {
  fieldId: number;
  type: fieldValueOptionActionType;
  setType: React.Dispatch<React.SetStateAction<fieldValueOptionActionType>>;
}

export interface FieldValueOptionsProps {
  type: fieldValueOptionActionType;
  setType: React.Dispatch<React.SetStateAction<fieldValueOptionActionType>>;
  fieldId: number;
  fieldValueOptions: Array<BaseFieldValueOption>;
  total: number;
}

export type fieldValueOptionActionType =
  | 'create'
  | 'edit'
  | 'openFieldValueOption'
  | 'openFieldDocumentTemplate'
  | 'show';
