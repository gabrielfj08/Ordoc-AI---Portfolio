import { IndexProcedure } from '../../../../services/printer-flow/types';
import { FilterProceduresParams } from '../Tabs/types';

export interface ProceduresTableContainerProps {
  params: FilterProceduresParams;
  setTotalObjects: React.Dispatch<React.SetStateAction<number>>;
}

export interface ProceduresTableProps {
  data: Array<IndexProcedure>;
}
