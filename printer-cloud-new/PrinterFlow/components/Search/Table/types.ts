import { IndexProcedure } from '../../../../services/printer-flow/types';
import { FilterSearchParams } from '../types';

export interface SearchTableContainerProps {
  params: FilterSearchParams;
  setTotalObjects: React.Dispatch<React.SetStateAction<number>>;
}

export interface SearchTableProps {
  data: Array<IndexProcedure>;
}
