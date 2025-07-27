import * as React from 'react';
import { Transition } from '@headlessui/react';
import {
  ActionSheetContextData,
  ActionSheetProviderProps,
} from './types';

const ActionSheetContext = React.createContext({} as ActionSheetContextData);

export const ActionSheetProvider = ({ children }: ActionSheetProviderProps) => {
  const [isShowing, setIsShowing] = React.useState<boolean>(false);
  const [actionSheetComponent, setActionSheetComponent] = React.useState<React.ReactNode>(null);

  const openActionSheet = (ActionSheetComponent: React.ReactNode) => {
    setActionSheetComponent(ActionSheetComponent);
    setIsShowing(true);
  };

  const closeActionSheet = () => {
    setIsShowing(false);
  };

  return (
    <ActionSheetContext.Provider value={{ openActionSheet, closeActionSheet }}>
      {children}
      <Transition show={isShowing} as={React.Fragment}>
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-[604px] z-20">
          <Transition.Child
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="-translate-y-full"
            leaveTo="translate-y-full"
          >
            {actionSheetComponent}
          </Transition.Child>
        </div>
      </Transition>
    </ActionSheetContext.Provider>
  );
};

export const useActionSheet = () => {
  return React.useContext(ActionSheetContext);
}
