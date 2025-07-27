import * as React from 'react';
import { useRouter } from 'next/router';
import { getSubdomain } from '../utils';

interface AuthContextData {
  token: string;
  subdomain: string;
  startSession: (token: string) => void;
  clearSession: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = React.createContext({} as AuthContextData);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = React.useState<string | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    setToken(localStorage.getItem('printer-cloud-token') || '');
  }, [token]);

  const startSession = (token: string) => {
    setToken(token);
    localStorage.setItem('printer-cloud-token', token || '');
    router.push('/transition');
  };

  const clearSession = () => {
    localStorage.removeItem('printer-cloud-token');
    router.push('/');
  };

  if (token === null) return null;

  return (
    <AuthContext.Provider
      value={{ token, subdomain: getSubdomain(), startSession, clearSession }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return React.useContext(AuthContext);
};

export default useAuth;
