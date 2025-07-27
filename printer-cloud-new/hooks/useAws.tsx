import * as React from 'react';

interface AwsCredentials {
  accessKeyId: string;
  secretAccessKey: string;
}

interface AwsContextData {
  credentials: AwsCredentials;
  setCredentials: (credentials: AwsCredentials) => void;
}

interface AwsProviderProps {
  children: React.ReactNode;
}

const AwsContext = React.createContext({} as AwsContextData);

export const AwsProvider = ({ children }: AwsProviderProps) => {
  const [credentials, setCredentials] = React.useState<AwsCredentials>({
    accessKeyId: '',
    secretAccessKey: '',
  });

  return (
    <AwsContext.Provider
      value={{
        credentials,
        setCredentials,
      }}
    >
      {children}
    </AwsContext.Provider>
  );
};

const useAws = () => {
  return React.useContext(AwsContext);
};

export default useAws;
