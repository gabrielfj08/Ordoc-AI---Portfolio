import * as React from 'react';
import { Transition } from '@headlessui/react';
import {
  ActionSheetContextData,
  ActionSheetProviderProps,
} from './useActionSheet/types';

const ActionSheetContext = React.createContext({} as ActionSheetContextData);

export const ActionSheetV3Provider = ({
  children,
}: ActionSheetProviderProps) => {
  const [isShowing, setIsShowing] = React.useState<boolean>(false);
  const [actionSheetComponent, setActionSheetComponent] =
    React.useState<React.ReactNode>(null);

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
      <Transition show={isShowing}>
        <div className="fixed -bottom-0 h-fit w-full z-50">
          <Transition.Child
            enter="transition ease-in-out duration-1000 transform"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
          >
            {actionSheetComponent}
          </Transition.Child>
        </div>
      </Transition>
    </ActionSheetContext.Provider>
  );
};

export const useV3ActionSheet = () => {
  return React.useContext(ActionSheetContext);
};
