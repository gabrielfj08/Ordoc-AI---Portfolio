import * as React from 'react';
import { Tab } from '@headlessui/react';
import { Icon, Typography } from 'printer-ui';

export interface TabProps {
  children?: React.ReactNode;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const TabButton = ({ title, icon }) => {
  return (
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
          className="flex w-full items-center justify-center mr-2 sm:mr-6 p-2"
          color="blue"
        >
          {selected ? (
            <Icon
              className="sm:mr-2"
              alt={icon}
              name={icon}
              color="blue"
              w={26}
              h={26}
              stroke
            />
          ) : (
            <Icon
              className="sm:mr-2"
              alt={icon}
              name={icon}
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
                ? 'bg-white text-black invisible w-0 sm:visible sm:w-fit'
                : 'bg-blue text-white invisible w-0 sm:visible sm:w-fit'
            }
          >
            {title}
          </Typography>
        </button>
      )}
    </Tab>
  );
};

const PoliciesTab = ({ children }: TabProps) => {
  return (
    <div className="sm:w-[640px] w-full h-[33.125rem] mb-8 rounded-lg shadow-default">
      <Tab.Group>
        <div className="flex">
          <TabButton title="Usuários" icon="user" />
          <TabButton title="Grupos" icon="group" />
        </div>
        <Tab.List className="rounded-lg h-full w-full">{children}</Tab.List>
      </Tab.Group>
    </div>
  );
};

export default PoliciesTab;
