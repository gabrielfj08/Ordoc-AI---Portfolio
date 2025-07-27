import {
  fieldTypeParams,
  ShowProcedureAPIResponse,
  UpdateProcedureAPIResponse,
} from '../../../../services/printer-flow/types';

export interface ProcedureFieldsProps {
  procedure: ShowProcedureAPIResponse;
  fields: Array<ProcedureFields>;
  onSubmit: (
    values: CreateProcedureFieldsFormValues
  ) => Promise<UpdateProcedureAPIResponse>;
}

export interface ProcedureFieldsContainerProps {
  procedure: ShowProcedureAPIResponse;
}
export interface ProcedureFields {
  label: string;
  fieldType: fieldTypeParams;
  options?: Array<string>;
}

export interface FieldsEmptyProps {
  procedure: ShowProcedureAPIResponse;
}

export interface CreateProcedurePayload {
  label: string;
  fieldType: fieldTypeParams;
  options?: Array<string>;
  value: any;
}
export interface CreateProcedureFieldsFormValues {
  payload: Array<CreateProcedurePayload>;
}
