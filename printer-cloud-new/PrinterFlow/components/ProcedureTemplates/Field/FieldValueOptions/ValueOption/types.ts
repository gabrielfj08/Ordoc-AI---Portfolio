import { BaseFieldValueOption } from '../../../../../../services/printer-flow/types';

export interface ValueOptionContainerProps {
  fieldValueOption: BaseFieldValueOption;
  type: fieldValueOptionActionType;
  setType: React.Dispatch<React.SetStateAction<fieldValueOptionActionType>>;
  total: number;
}

export interface ValueOptionProps {
  onSubmit: (values: ValueOptionFormValues) => Promise<BaseFieldValueOption>;
  fieldValueOption: BaseFieldValueOption;
  type: fieldValueOptionActionType;
  total: number;
}

export interface ValueOptionFormValues {
  value: string;
}

export type fieldValueOptionActionType =
  | 'create'
  | 'edit'
  | 'openFieldValueOption'
  | 'openFieldDocumentTemplate'
  | 'show';
