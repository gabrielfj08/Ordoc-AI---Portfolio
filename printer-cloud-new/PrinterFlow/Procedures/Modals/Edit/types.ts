import {
  procedurePriority,
  procedureSource,
  ShowProcedureAPIResponse,
  ProcedurePayloadItems,
  UpdateProcedurePayload,
} from '../../../../services/printer-flow/types';

export interface EditProcedureModalProps {
  onSubmit: (
    values: EditProcedureInfoFormValues
  ) => Promise<UpdateProcedurePayload>;
  procedure: ShowProcedureAPIResponse;
}

export interface EditProcedureInfoFormValues {
  responsibleGroupId: number;
  requesterId: number;
  priority: procedurePriority;
  source: procedureSource;
  private: boolean;
  deadline: any | Date;
  payload: Array<ProcedurePayloadItems>;
}
