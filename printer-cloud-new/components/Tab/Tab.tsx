import * as React from 'react';
import { Tab } from '@headlessui/react';
import { Icon, Typography } from 'printer-ui';
export interface TabProps {
  children?: React.ReactNode;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const Tabs = ({ children }: TabProps) => {
  return (
    <div className="sm:w-[640px] w-full h-[33.125rem] mb-8 rounded-lg shadow-default">
      <Tab.Group>
        <Tab
          className={({ selected }) =>
            classNames(
              'w-1/2 rounded-t-lg',
              'focus:outline-none',
              selected ? 'bg-white text-black' : 'bg-blue text-white w-full'
            )
          }
        >
          {({ selected }) => (
            <button
              className="flex w-full items-center justify-center mr-6 p-2"
              color="blue"
            >
              {selected ? (
                <Icon
                  className="mr-2"
                  alt="user"
                  name="user"
                  color="blue"
                  w={26}
                  h={26}
                  stroke
                />
              ) : (
                <Icon
                  className="mr-2"
                  alt="user"
                  name="user"
                  color="white"
                  w={26}
                  h={26}
                  stroke
                />
              )}
              <Typography
                variant="button"
                className={
                  selected ? 'bg-white text-black' : 'bg-blue text-white'
                }
              >
                Usuários
              </Typography>
            </button>
          )}
        </Tab>
        <Tab
          className={({ selected }) =>
            classNames(
              'w-1/2 rounded-t-lg',
              'focus:outline-none',
              selected ? 'bg-white text-black ' : 'bg-blue text-white w-full'
            )
          }
        >
          {({ selected }) => (
            <button
              className="flex w-full items-center justify-center mr-6 p-2"
              color="blue"
            >
              {selected ? (
                <Icon
                  className="mr-2"
                  alt="done"
                  name="done"
                  color="blue"
                  w={26}
                  h={26}
                  stroke
                />
              ) : (
                <Icon
                  className="mr-2"
                  alt="done"
                  name="done"
                  color="white"
                  w={26}
                  h={26}
                  stroke
                />
              )}
              <Typography
                variant="button"
                className={
                  selected
                    ? 'bg-white text-black truncate'
                    : 'bg-blue text-white truncate'
                }
              >
                Permissões
              </Typography>
            </button>
          )}
        </Tab>
        <Tab.List className="flex rounded-lg h-full w-full">
          {children}
        </Tab.List>
      </Tab.Group>
    </div>
  );
};

export default Tabs;
