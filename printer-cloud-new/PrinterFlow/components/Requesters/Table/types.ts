import { IndexRequesters } from '../../../../services/printer-flow/types/requester';
import { FilterRequesterParams } from '../../../Requesters/types';

export interface RequestersTableContainerProps {
  params: FilterRequesterParams;
  setTotalObjects: React.Dispatch<React.SetStateAction<number>>;
}
export interface RequestersTableProps {
  data: Array<IndexRequesters>;
}
