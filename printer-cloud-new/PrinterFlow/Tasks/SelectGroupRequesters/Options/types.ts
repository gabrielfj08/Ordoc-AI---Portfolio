import { SetStateAction } from 'react';
import { IndexGroupRequester } from '../../../../services/printer-flow/types';

export interface SelectTaskGroupRequesterOptionsContainerProps {
  setError: React.Dispatch<SetStateAction<boolean>>;
  open: boolean;
  query: string;
}

export interface SelectGroupRequestersOptionsProps {
  groupRequesters: Array<IndexGroupRequester>;
  isError: boolean;
}
