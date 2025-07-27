import {
  IndexSharedProcedure,
  AcceptSharedProcedureAPIResponse,
} from '../../../../../services/flow-cidadao/types';

export interface ActionsCellProps {
  sharedProcedure: IndexSharedProcedure;
  color?: string;
  onSubmit: () => Promise<AcceptSharedProcedureAPIResponse>;
}
