import * as React from 'react';
import Link from 'next/link';
import { Menu, Transition } from '@headlessui/react';
import { Icon, Typography } from 'printer-ui';
import { MenuButtonProps } from './types';

const MenuButton = ({ options }: MenuButtonProps) => {
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
                    color="darkGray"
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
              <Menu.Items className="absolute z-20 right-0 mr-6 w-56 rounded-md bg-white shadow-default">
                {options.map((option) => (
                  <Menu.Item key={option.label} as={React.Fragment}>
                    {({ active }) =>
                      option.type === 'link' ? (
                        <a
                          className={`w-full px-3.5 h-10 flex items-center space-x-2 first:rounded-t-md last:rounded-b-md ${
                            active ? 'bg-blue/5' : 'bg-white text-black'
                          }`}
                          href={option.href ? option.href : ''}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Icon
                            name={option.icon}
                            alt={option.icon}
                            color="darkGray"
                            stroke={option.stroke}
                            fill={option.fill}
                            w={26}
                            h={26}
                          />
                          <Typography variant="footnote1" color="darkerGray">
                            {option.label}
                          </Typography>
                        </a>
                      ) : (
                        <button
                          className={`w-full px-3.5 h-10 flex items-center space-x-2 first:rounded-t-md last:rounded-b-md ${
                            active ? 'bg-blue/5' : 'bg-white text-black'
                          }`}
                          onClick={option.onClick}
                          type="button"
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
                            color={option.disabled ? 'lightGray' : 'darkGray'}
                          >
                            {option.label}
                          </Typography>
                        </button>
                      )
                    }
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
