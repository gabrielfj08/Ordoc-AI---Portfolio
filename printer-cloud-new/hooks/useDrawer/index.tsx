import * as React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  DrawerContextData,
  DrawerProviderProps,
  enterFromMapping,
  leaveToMapping,
  drawerSide,
  justifyMapping,
  enterToMapping,
  leaveFromMapping,
} from './types';

const DrawerContext = React.createContext({} as DrawerContextData);

export const DrawerProvider = ({ children }: DrawerProviderProps) => {
  const [isShowing, setIsShowing] = React.useState<boolean>(false);
  const [drawerSide, setDrawerSide] = React.useState<drawerSide>('right');
  const [drawerComponent, setDrawerComponent] =
    React.useState<React.ReactNode>(null);

  const openDrawer = (DrawerComponent: React.ReactNode, side: drawerSide) => {
    setDrawerComponent(DrawerComponent);
    setIsShowing(true);
    setDrawerSide(side);
  };

  const closeDrawer = () => {
    setIsShowing(false);
  };

  return (
    <DrawerContext.Provider value={{ openDrawer, closeDrawer }}>
      {children}
      <Transition appear show={isShowing} as={React.Fragment}>
        <Dialog as="div" className="relative z-20" onClose={closeDrawer}>
          <Transition.Child
            as={React.Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div
              className={`flex min-h-full ${justifyMapping[drawerSide]} text-center`}
            >
              <Transition.Child
                as={React.Fragment}
                enter="transition ease-in-out duration-700 transform"
                enterFrom={enterFromMapping[drawerSide]}
                enterTo={enterToMapping[drawerSide]}
                leave="transition ease-in-out duration-700 transform"
                leaveFrom={leaveFromMapping[drawerSide]}
                leaveTo={leaveToMapping[drawerSide]}
              >
                <Dialog.Panel
                  className={`${
                    drawerSide !== 'bottom'
                      ? 'w-fit h-full max-w-[80%] md:max-w-[50%] lg:max-w-[25%]'
                      : 'h-fit w-full'
                  } transform fixed bg-white text-left shadow-xl transition-all`}
                >
                  {drawerComponent}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </DrawerContext.Provider>
  );
};

const useDrawer = () => {
  return React.useContext(DrawerContext);
};

export default useDrawer;
