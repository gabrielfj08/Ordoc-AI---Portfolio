import { ShowProcedureAPIResponse } from '../../../../services/printer-flow/types';

export interface UnarchiveProcedureContainerModalProps {
  procedureId: number;
  processNumber: string;
}

export interface UnarchiveProcedureModalProps {
  onSubmit: (
    values: UnarchiveProcedureFormValues
  ) => Promise<ShowProcedureAPIResponse>;
  processNumber: string;
}

export interface UnarchiveProcedureFormValues {
  note: string;
}
