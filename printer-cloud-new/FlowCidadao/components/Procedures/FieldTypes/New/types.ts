import { ShowExternalProcedureAPIResponse } from '../../../../../services/flow-cidadao/types';

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

export interface NewProcedureFieldTypesProps {
  activeStep?: number;
  type: fieldTypes;
  fieldName: string;
  label: string;
  options?: Array<string>;
  value: any;
  formik?: any;
  procedure: ShowExternalProcedureAPIResponse;
  index: number;
  disabled?: boolean;
  color?: string;
  setDisableSubmitButton: React.Dispatch<React.SetStateAction<boolean>>;
}
