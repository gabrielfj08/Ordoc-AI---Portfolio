import { IndexGroupRequester } from '../../../../services/printer-flow/types';

export interface SelectGroupRequestersOptionsContainerProps {
  query: string;
  open: boolean;
}

export interface SelectGroupRequestersOptionsProps {
  groupRequester: Array<IndexGroupRequester>;
}
