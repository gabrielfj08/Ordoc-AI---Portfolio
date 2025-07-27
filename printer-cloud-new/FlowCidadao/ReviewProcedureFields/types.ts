import {
  ExternalProcedurePayloadItems,
  RunExternalProcedureAPIResponse,
  ShowExternalProcedureAPIResponse,
  UpdateExternalProcedureAPIResponse,
  UpdateExternalProcedurePayload,
} from '../../services/flow-cidadao/types';

export interface ReviewProcedureFieldsProps {
  procedure: ShowExternalProcedureAPIResponse;
  handleSubmit: (
    values: UpdateExternalProcedurePayload
  ) => Promise<UpdateExternalProcedureAPIResponse>;
  handleRunProcedure: () => void;
}

export interface UpdateProcedureFormValues {
  payload: Array<ExternalProcedurePayloadItems>;
}

export interface ShowProcedureFormValues {
  payload: Array<ExternalProcedurePayloadItems>;
}
