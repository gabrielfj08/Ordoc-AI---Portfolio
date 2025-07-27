import { IndexGroupRequester } from '../../../../../../services/printer-flow/types';

export interface groupStatusCellContainerProps {
  group: IndexGroupRequester;
}

export interface groupStatusCellProps {
  group: IndexGroupRequester;
  groupStatus: groupStatus;
}

export type groupStatus = 'active' | 'inactive';
