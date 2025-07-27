import {
  IndexSharedProcedure,
  RefuseSharedProcedureAPIResponse,
} from '../../../../services/flow-cidadao/types';

export interface RefuseSharedProcedureModalProps {
  onSubmit: (
    values: RefuseSharedProcedureFormValues
  ) => Promise<RefuseSharedProcedureAPIResponse>;
}

export interface RefuseSharedProcedureModalContainerProps {
  sharedProcedure: IndexSharedProcedure;
}

export interface RefuseSharedProcedureFormValues {
  note: string;
}
