import { ShowRequester } from '../../../services/printer-flow/types';
export interface ShowProps {
  requester: ShowRequester;
}
export interface ShowContainerProps {
  setRequester: React.Dispatch<React.SetStateAction<ShowRequester>>;
}
