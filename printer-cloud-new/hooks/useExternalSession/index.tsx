import * as React from 'react';
import { useAuth, useExternalAuth } from '../';
import {
  ExternalSessionContextData,
  ExternalSessionProviderProps,
  ExternalSessionData,
} from './types';
import { ExternalRequesterService } from '../../services/flow-cidadao/ExternalRequester';

const ExternalSessionContext = React.createContext(
  {} as ExternalSessionContextData
);

export const ExternalSessionProvider = ({
  children,
}: ExternalSessionProviderProps) => {
  const { subdomain } = useAuth();
  const { externalToken } = useExternalAuth();

  const [externalSession, setExternalSession] =
    React.useState<ExternalSessionData>({} as ExternalSessionData);

  React.useEffect(() => {
    ExternalRequesterService.me(String(externalToken), subdomain).then(
      (response) => {
        setExternalSession((prevState) => ({
          ...prevState,
          user: response,
        }));
      }
    );
  }, [externalToken]);

  return (
    <ExternalSessionContext.Provider
      value={{ externalSession, setExternalSession }}
    >
      {children}
    </ExternalSessionContext.Provider>
  );
};

export const useExternalSession = () => {
  return React.useContext(ExternalSessionContext);
};
