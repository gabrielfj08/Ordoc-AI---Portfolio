import * as React from 'react';
import { Menu, Transition } from '@headlessui/react';
import { SelectedItemsMenuButtonProps } from './types';
import { Icon, Typography } from 'printer-ui';

const SelectedItemsMenuButton = ({ options }: SelectedItemsMenuButtonProps) => {
  return (
    <Menu as="div" className="relative">
      {({ open }) => (
        <>
          <Menu.Button className="border-2 border-darkGray w-full sm:w-48 h-9 rounded-lg flex justify-center space-x-2 items-center px-4">
            <p className="text-[15px] text-darkGray font-roboto-400">
              Itens Selecionados
            </p>
            <Icon
              alt={open ? 'up' : 'down'}
              name={open ? 'up' : 'down'}
              stroke
              color="darkGray"
              w={20}
              h={20}
            />
          </Menu.Button>
          <Transition
            as={React.Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute z-0 top-0 mt-9 w-full sm:w-48 rounded-md bg-white shadow-default">
              {options.map((option) => (
                <Menu.Item key={option.label} as={React.Fragment}>
                  {({ active }) => (
                    <button
                      className={`w-full px-3.5 h-10 flex items-center space-x-2 first:rounded-t-md last:rounded-b-md ${
                        active ? 'bg-blue/5' : 'bg-white text-black'
                      }`}
                      onClick={option.onClick}
                      disabled={option.disabled}
                    >
                      <Icon
                        name={option.icon}
                        alt={option.icon}
                        color={option.disabled ? 'lightGray' : 'darkGray'}
                        stroke={option.stroke}
                        fill={option.fill}
                        w={26}
                        h={26}
                      />
                      <Typography
                        variant="footnote1"
                        color={option.disabled ? 'lightGray' : 'darkerGray'}
                      >
                        {option.label}
                      </Typography>
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default SelectedItemsMenuButton;
