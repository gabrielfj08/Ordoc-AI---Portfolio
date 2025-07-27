import * as React from 'react';
import { getSubdomain } from '../../utils';
import reducer from './reducer';

interface AuthExternalContextData {
  externalToken: string | undefined;
  subdomain: string;
  startExternalSession: (externalToken: string) => void;
  clearExternalSession: () => void;
}

interface AuthExternalProviderProps {
  children: React.ReactNode;
}

const AuthExternalContext = React.createContext({} as AuthExternalContextData);

export const AuthExternalProvider = ({
  children,
}: AuthExternalProviderProps) => {
  const [externalToken, dispatchExternalToken] = React.useReducer<
    typeof reducer
  >(reducer, null);

  React.useEffect(() => {
    dispatchExternalToken({ type: 'charge_session' });
  }, [externalToken]);

  const startExternalSession = (externalToken: string) => {
    dispatchExternalToken({
      type: 'start_session',
      externalToken: externalToken,
    });
  };

  const clearExternalSession = () => {
    dispatchExternalToken({ type: 'clear_session' });
  };

  if (externalToken === null) return null;

  return (
    <AuthExternalContext.Provider
      value={{
        externalToken,
        subdomain: getSubdomain(),
        startExternalSession,
        clearExternalSession,
      }}
    >
      {children}
    </AuthExternalContext.Provider>
  );
};

const useExternalAuth = () => {
  return React.useContext(AuthExternalContext);
};

export default useExternalAuth;
