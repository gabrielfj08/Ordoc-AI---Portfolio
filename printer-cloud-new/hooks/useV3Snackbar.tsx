import * as React from 'react';
import { SnackbarV3 as Snackbar } from 'printer-ui';
import { Transition } from '@headlessui/react';

type snackbarColor = 'error' | 'success' | 'info';

interface SnackbarV3ContextData {
  showV3Snackbar(message: string, type: snackbarColor, title?: string): void;
}

interface SnackbarV3ProviderProps {
  children: React.ReactNode;
}

const SnackbarV3Context = React.createContext({} as SnackbarV3ContextData);

export const SnackbarV3Provider = ({ children }: SnackbarV3ProviderProps) => {
  const [isSnackbarVisible, setSnackbarVisibility] =
    React.useState<boolean>(false);
  const [color, setColor] = React.useState<snackbarColor>('success');
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarTitle, setSnackbarTitle] = React.useState('');

  const showV3Snackbar = (
    message: string,
    color: snackbarColor,
    title: string
  ) => {
    setSnackbarVisibility(true);
    setColor(color);
    setSnackbarTitle(title);
    setSnackbarMessage(message);
  };

  React.useEffect(() => {
    setTimeout(() => {
      setSnackbarVisibility(false);
    }, 5000);
  }, [showV3Snackbar]);

  return (
    <SnackbarV3Context.Provider value={{ showV3Snackbar }}>
      {children}
      <Transition show={isSnackbarVisible}>
        <div className="fixed -bottom-0 h-fit w-full z-50">
          <Transition.Child
            enter="transition ease-in-out duration-1000 transform"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
          >
            <Snackbar
              className="mb-1.5 sm:mb-6 mx-6"
              type={color}
              message={snackbarMessage}
              title={snackbarTitle}
              onClick={() => {
                setSnackbarVisibility(false);
              }}
            />
          </Transition.Child>
        </div>
      </Transition>
    </SnackbarV3Context.Provider>
  );
};

const useV3Snackbar = () => {
  return React.useContext(SnackbarV3Context);
};

export default useV3Snackbar;
