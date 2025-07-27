import * as React from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Icon, TypographyV3 as Typography } from 'printer-ui';
import { useSession } from '../../../hooks';
import { MenuButtonProps } from './types';

const MenuButton = ({ options }: MenuButtonProps) => {
  const { themeColor } = useSession();

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Menu as="div" className="relative flex items-center">
        {({ open }) => (
          <>
            <div>
              <Menu.Button
                className={`${
                  open && 'bg-blue/20'
                } w-9 h-9 rounded-full flex justify-center items-center`}
              >
                <div>
                  <Icon
                    name="dotMenu"
                    alt="menu"
                    w={25}
                    h={25}
                    stroke
                    color={themeColor}
                    className="rotate-90"
                  />
                </div>
              </Menu.Button>
            </div>
            <Transition
              as={React.Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mr-6 w-56 rounded-md bg-white shadow-default z-30">
                {options.map((option) => (
                  <Menu.Item key={option.label} as={React.Fragment}>
                    {({ active }) => (
                      <button
                        className={`w-full px-3.5 h-12 flex items-center justify-between space-x-2 first:rounded-t-md last:rounded-b-md ${
                          active ? 'bg-blue/5' : `bg-white text-darkGray`
                        }`}
                        onClick={option.onClick}
                        disabled={option.disabled}
                        type="button"
                      >
                        <Typography
                          family="jakarta"
                          variant="bodyMd"
                          color={option.disabled ? 'lightGray' : themeColor}
                        >
                          {option.label}
                        </Typography>
                        <Icon
                          name={option.icon}
                          alt={option.icon}
                          color={
                            option.disabled
                              ? 'lightGray'
                              : option.color || themeColor
                          }
                          stroke={option.stroke}
                          fill={option.fill}
                          w={30}
                          h={30}
                        />
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  );
};

export default MenuButton;
