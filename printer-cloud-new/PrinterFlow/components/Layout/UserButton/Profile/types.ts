import { IndexGroupRequester } from '../../../../../services/printer-flow/types';
import {
  ShowUserAPIResponse,
  IndexAppsAPIResponse,
} from '../../../../../services/types';

export interface FlowProfileContainerProps {
  currentGroup: IndexGroupRequester;
  setCurrentGroup: React.Dispatch<React.SetStateAction<IndexGroupRequester>>;
}

export interface FlowProfileProps {
  user: ShowUserAPIResponse;
  apps: IndexAppsAPIResponse;
  currentGroup: IndexGroupRequester;
  setCurrentGroup: React.Dispatch<React.SetStateAction<IndexGroupRequester>>;
}
