import { IndexGroupRequester } from '../../../../../../services/printer-flow/types';

export interface SelectGroupContainerProps {
  userId: number;
  currentGroup: IndexGroupRequester;
  setCurrentGroup: React.Dispatch<React.SetStateAction<IndexGroupRequester>>;
}

export interface SelectGroupProps {
  groupRequesters: Array<IndexGroupRequester>;
  currentGroup: IndexGroupRequester;
  setCurrentGroup: React.Dispatch<React.SetStateAction<IndexGroupRequester>>;
}

export interface GroupRequesterValue {
  id: number;
  value: string;
}
