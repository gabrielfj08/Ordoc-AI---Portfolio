import { MeExternalRequesterAPIResponse } from '../../services/flow-cidadao/types';

export interface ExternalSessionData {
  user: MeExternalRequesterAPIResponse;
}

export interface ExternalSessionContextData {
  externalSession: ExternalSessionData;
  setExternalSession: (sessionData: ExternalSessionData) => void;
}

export interface ExternalSessionProviderProps {
  children: React.ReactNode;
}
