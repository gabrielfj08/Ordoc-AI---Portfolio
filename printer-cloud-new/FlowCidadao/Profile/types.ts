import { ShowExternalRequesterAPIResponse } from '../../services/flow-cidadao/types';

export interface ExternalRequesterProfileProps {
  externalRequester: ShowExternalRequesterAPIResponse;
  type: externalRequesterProfileType;
  setType: React.Dispatch<React.SetStateAction<externalRequesterProfileType>>;
}

export type externalRequesterProfileType = 'show' | 'edit';
