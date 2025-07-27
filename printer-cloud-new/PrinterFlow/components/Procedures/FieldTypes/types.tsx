import { ShowProcedureAPIResponse } from '../../../../services/printer-flow/types';

export type fieldTypes =
  | 'cpf'
  | 'cnpj'
  | 'radio'
  | 'checkbox'
  | 'email'
  | 'phone'
  | 'attachment'
  | 'date'
  | 'time'
  | 'select_field'
  | 'numeric'
  | 'short_text'
  | 'long_text';

export interface FieldTypesProps {
  type: fieldTypes;
  fieldName: string;
  label: string;
  options?: Array<string>;
  value: any;
  formik?: any;
  procedure: ShowProcedureAPIResponse;
  index: number;
  disabled?: boolean;
}
