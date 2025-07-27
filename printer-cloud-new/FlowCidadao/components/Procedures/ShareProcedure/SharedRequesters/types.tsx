import {
  IndexSharedProcedure,
  DestroySharedProcedureAPIResponse,
} from '../../../../../services/flow-cidadao/types';

export interface SharedRequestersContainerProps {
  sharedProcedures: Array<IndexSharedProcedure>;
}

export interface SharedRequestersProps {
  sharedProcedures: Array<IndexSharedProcedure>;
  handleClick: (value: number) => Promise<DestroySharedProcedureAPIResponse>;
}

export interface SharedStatusTagProps {
  status: string;
  color: string;
}
