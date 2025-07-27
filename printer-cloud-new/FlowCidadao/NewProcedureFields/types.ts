import {
  ExternalProcedurePayloadItems,
  ShowExternalProcedureAPIResponse,
  UpdateExternalProcedureAPIResponse,
  UpdateExternalProcedurePayload,
} from '../../services/flow-cidadao/types';

export interface NewProcedureFieldsProps {
  procedure: ShowExternalProcedureAPIResponse;
  handleSubmit: (
    values: UpdateExternalProcedurePayload
  ) => Promise<UpdateExternalProcedureAPIResponse>;
}

export interface UpdateProcedureFormValues {
  payload: Array<ExternalProcedurePayloadItems>;
}

export interface ShowProcedureFormValues {
  payload: Array<ExternalProcedurePayloadItems>;
}
