import { SetStateAction } from 'react';
import { IndexRequesters } from '../../../../../../services/printer-flow/types';

export interface RequesterSelectOptionsContainerProps {
  setError: React.Dispatch<SetStateAction<boolean>>;
  open: boolean;
  query: string;
}

export interface SelectRequesterOptionsProps {
  requesters: Array<IndexRequesters>;
  isError: boolean;
}
