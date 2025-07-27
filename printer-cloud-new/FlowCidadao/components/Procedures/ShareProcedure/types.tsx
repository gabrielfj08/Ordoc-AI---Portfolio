import {
  IndexExternalProcedure,
  IndexSharedProcedure,
  CreateSharedProcedureAPIResponse,
} from '../../../../services/flow-cidadao/types';

export interface ShareProcedureModalContainerProps {
  procedure: IndexExternalProcedure;
}

export interface ShareProcedureModalProps {
  sharedProcedures: Array<IndexSharedProcedure>;
  procedure: IndexExternalProcedure;
  onSubmit: (
    values: ShareProcedureFormValues
  ) => Promise<CreateSharedProcedureAPIResponse>;
}

export interface ShareProcedureFormValues {
  cpfCnpj: string;
  procedureId: number;
}
