import {
  BaseField,
  fieldTypeParams,
} from '../../../../services/printer-flow/types';

export interface NewFieldContainerProps {
  procedureTemplateId: number;
  setHidden: React.Dispatch<React.SetStateAction<string>>;
}

export interface NewFieldProps {
  onSubmit: (values: NewFieldFormValues) => Promise<BaseField>;
  procedureTemplateId: number;
  setHidden: React.Dispatch<React.SetStateAction<string>>;
}

export interface NewFieldFormValues {
  label: string;
  fieldType: fieldTypeParams & '';
}

export type fieldActionType =
  | 'create'
  | 'edit'
  | 'openFieldValueOption'
  | 'openFieldDocumentTemplate'
  | 'show';
