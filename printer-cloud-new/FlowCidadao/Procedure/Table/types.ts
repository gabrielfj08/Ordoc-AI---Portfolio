import { IndexExternalProcedure } from '../../../services/flow-cidadao/types';
import { FilterExternalProceduresParams } from '../types';

export interface ProcedureTableProps {
  data: Array<IndexExternalProcedure>;
  color: any;
}
export interface CellProps {
  procedure: IndexExternalProcedure;
}

export interface ProcedureTableContainerProps {
  params: FilterExternalProceduresParams;
  setTotalObjects: React.Dispatch<React.SetStateAction<number>>;
}
