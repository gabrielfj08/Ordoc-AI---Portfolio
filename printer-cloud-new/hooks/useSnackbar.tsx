import * as React from 'react';
import { Snackbar, snackbarColor } from 'printer-ui';

interface SnackbarContextData {
  showSnackbar(message: string, color: snackbarColor): void;
}

interface SnackbarProviderProps {
  children: React.ReactNode;
}

const SnackbarContext = React.createContext({} as SnackbarContextData);

export const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
  const [isSnackbarVisible, setSnackbarVisibility] =
    React.useState<boolean>(false);
  const [color, setColor] = React.useState<snackbarColor>('success');
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  const showSnackbar = (message: string, color: snackbarColor) => {
    setSnackbarVisibility(true);
    setColor(color);
    setSnackbarMessage(message);
  };

  React.useEffect(() => {
    setTimeout(() => {
      setSnackbarVisibility(false);
    }, 5000);
  }, [showSnackbar]);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {isSnackbarVisible && (
        <Snackbar
          className="z-30 fixed sm:-mt-20 -mt-10 -ml-4 sm:ml-0 mr-4"
          color={color}
          label={snackbarMessage}
          onClick={() => {
            setSnackbarVisibility(false);
          }}
        />
      )}
    </SnackbarContext.Provider>
  );
};

const useSnackbar = () => {
  return React.useContext(SnackbarContext);
};

export default useSnackbar;
