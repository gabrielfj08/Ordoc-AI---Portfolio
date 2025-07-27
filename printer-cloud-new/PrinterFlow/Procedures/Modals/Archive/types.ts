import { ShowProcedureAPIResponse } from '../../../../services/printer-flow/types';

export interface ArchiveProcedureContainerModalProps {
  procedureId: number;
  processNumber: string;
}

export interface ArchiveProcedureModalProps {
  onSubmit: (
    values: ArchiveProcedureFormValues
  ) => Promise<ShowProcedureAPIResponse>;
  processNumber: string;
}

export interface ArchiveProcedureFormValues {
  note: string;
}
