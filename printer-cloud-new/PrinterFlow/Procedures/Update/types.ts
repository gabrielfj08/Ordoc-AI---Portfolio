import {
  fieldTypeParams,
  ShowProcedureAPIResponse,
  UpdateProcedureAPIResponse,
} from '../../../services/printer-flow/types';

export interface UpdateProcedureFieldsContainerProps {
  procedure: ShowProcedureAPIResponse;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface UpdateProcedureFieldsProps {
  procedure: ShowProcedureAPIResponse;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (
    values: UpdateProcedureFieldsFormValues
  ) => Promise<UpdateProcedureAPIResponse>;
}

export interface UpdateProcedurePayload {
  label: string;
  fieldType: fieldTypeParams;
  options?: Array<string>;
  value: any;
}
export interface UpdateProcedureFieldsFormValues {
  payload: Array<UpdateProcedurePayload>;
}
