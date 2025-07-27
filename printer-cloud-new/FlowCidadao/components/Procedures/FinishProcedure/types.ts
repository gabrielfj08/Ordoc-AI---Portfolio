import { RequestFinishProcedureAPIResponse } from '../../../../services/flow-cidadao/types';

export interface FinishProcedureModalContainerProps {
  procedureId: number;
}

export interface FinishProcedureModalProps {
  onSubmit: (
    values: RequestFinishProcedureForm
  ) => Promise<RequestFinishProcedureAPIResponse>;
}

export interface RequestFinishProcedureForm {
  description: string;
}
