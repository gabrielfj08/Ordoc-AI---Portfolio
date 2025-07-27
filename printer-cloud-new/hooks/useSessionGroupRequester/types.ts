import { IndexGroupRequester } from '../../services/printer-flow/types';

export interface SessionGroupRequesterData {
  groupRequester: IndexGroupRequester;
}

export interface SessionGroupRequesterContextData {
  sessionGroupRequester: IndexGroupRequester;
  setSessionGroupRequester: React.Dispatch<
    React.SetStateAction<IndexGroupRequester>
  >;
  clearSessionGroupRequester: () => void;
  unauthorized: boolean;
}

export interface SessionGroupRequesterProviderProps {
  children: React.ReactNode;
}
