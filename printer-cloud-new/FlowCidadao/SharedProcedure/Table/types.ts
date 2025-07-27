import { IndexSharedProcedure } from '../../../services/flow-cidadao/types';
import { FilterExternalSharedProcedureParams } from '../types';

export interface SharedProcedureTableContainerProps {
  params: FilterExternalSharedProcedureParams;
  setTotalObjects: React.Dispatch<React.SetStateAction<number>>;
}

export interface SharedProcedureTableProps {
  data: Array<IndexSharedProcedure>;
  color?: string;
}

export interface CellProps {
  sharedProcedure: IndexSharedProcedure;
  isFormVisible?: boolean;
  setFormVisibility?: React.Dispatch<React.SetStateAction<boolean>>;
  color?: string;
}
