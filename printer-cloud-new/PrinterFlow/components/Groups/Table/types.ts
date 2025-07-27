import { IndexGroupRequester } from '../../../../services/printer-flow/types';
import { FilterGroupsParams } from '../../../Groups/types';

export interface GroupRequestersTableProps {
  data: Array<IndexGroupRequester>;
}

export interface GroupRequestersTableContainerProps {
  params: FilterGroupsParams;
  setTotalObjects: React.Dispatch<React.SetStateAction<number>>;
}
