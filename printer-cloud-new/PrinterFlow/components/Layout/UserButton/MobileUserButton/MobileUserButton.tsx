import * as React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import router from 'next/router';
import { Avatar } from 'printer-ui';
import { useSessionGroupRequester } from '../../../../../hooks';
import { MobileUserButtonProps } from './types';
import FlowProfile from '../Profile';

const MobileUserButton = ({ user }: MobileUserButtonProps) => {
  const [isDrawerVisible, setIsDrawerVisible] = React.useState<boolean>(false);
  const { sessionGroupRequester, setSessionGroupRequester } =
    useSessionGroupRequester();

  return (
    <>
      <button className="h-full" onClick={() => setIsDrawerVisible(true)}>
        <Avatar
          size="md"
          placeholder={`${user?.name}`.charAt(0)}
          color="white"
          textColor={
            router.pathname.match('/printer-air')
              ? 'red'
              : router.pathname.match('/printer-flow')
              ? 'yellow'
              : 'blue'
          }
          stroke
          src={user.avatarUrl}
        />
      </button>
      <Transition appear show={isDrawerVisible} as={React.Fragment}>
        <Dialog
          as="div"
          className="sm:hidden relative z-20"
          onClose={() => setIsDrawerVisible(false)}
        >
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
            <div className="flex min-h-full justify-end text-center">
              <Transition.Child
                as={React.Fragment}
                enter="transition ease-in-out duration-700 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-700 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="w-fit h-full max-w-[80%] md:max-w-[50%] lg:max-w-[25%] transform fixed bg-white text-left shadow-xl transition-all">
                  <FlowProfile
                    currentGroup={sessionGroupRequester}
                    setCurrentGroup={setSessionGroupRequester}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default MobileUserButton;
