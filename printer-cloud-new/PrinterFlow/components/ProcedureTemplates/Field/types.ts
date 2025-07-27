import {
  BaseField,
  ShowProcedureTemplate,
  fieldTypeParams,
} from '../../../../services/printer-flow/types';

export interface FieldContainerProps {
  field: BaseField;
  procedureTemplate: ShowProcedureTemplate;
}

export interface FieldProps {
  onSubmit: (values: FieldFormValues) => Promise<BaseField>;
  field: BaseField;
  type: fieldActionType;
  setType: React.Dispatch<React.SetStateAction<fieldActionType>>;
  procedureTemplate: ShowProcedureTemplate;
}

export interface FieldFormValues {
  label: string;
  fieldType: fieldTypeParams;
}

export type fieldActionType =
  | 'create'
  | 'edit'
  | 'openFieldValueOption'
  | 'openFieldDocumentTemplate'
  | 'show';
