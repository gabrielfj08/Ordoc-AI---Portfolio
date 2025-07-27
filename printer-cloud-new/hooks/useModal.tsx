import * as React from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface ModalContextData {
  openModal(ModalComponent: React.ReactNode): void;
  closeModal(): void;
}

interface ModalProviderProps {
  children: React.ReactNode;
}

const ModalContext = React.createContext({} as ModalContextData);

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [modalComponent, setModalComponent] =
    React.useState<React.ReactNode>(null);

  const openModal = (ModalComponent: React.ReactNode) => {
    setModalComponent(ModalComponent);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Transition appear show={isOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-20" onClose={closeModal}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-fit transform rounded-2xl text-left align-middle transition-all">
                  {modalComponent}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </ModalContext.Provider>
  );
};

const useModal = () => {
  return React.useContext(ModalContext);
};

export default useModal;
