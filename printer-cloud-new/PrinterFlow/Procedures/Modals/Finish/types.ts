import { ShowProcedureAPIResponse } from '../../../../services/printer-flow/types';

export interface FinishProcedureContainerModalProps {
  procedureId: number;
  processNumber: string;
}

export interface FinishProcedureModalProps {
  onSubmit: () => Promise<ShowProcedureAPIResponse>;
  processNumber: string;
}
