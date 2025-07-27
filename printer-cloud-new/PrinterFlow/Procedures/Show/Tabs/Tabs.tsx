import * as React from 'react';
import { Tab } from '@headlessui/react';
import { Typography } from 'printer-ui';
import { TabProps } from './types';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const TabButton = ({ title }) => {
  return (
    <Tab
      className={({ selected }) =>
        classNames(
          'w-4/12 focus:outline-none rounded-t-lg',
          selected ? ' bg-yellow border-b-8 border-white/70' : ' bg-yellow'
        )
      }
    >
      {({ selected }) => (
        <div className="flex w-full items-center justify-center p-2 space-x-0.5 sm:space-x-2">
          <Typography
            variant={window.innerWidth < 640 ? 'footnote1' : 'button'}
            family={selected ? 'robotoBold' : 'roboto'}
            color="white"
            className="truncate"
          >
            {title}
          </Typography>
        </div>
      )}
    </Tab>
  );
};

const ProcedureTabs = ({ children }: TabProps) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  return (
    <div className="h-fit min-h-[25rem] mb-8 sm:mr-10 mr-4 ml-4 rounded-lg shadow-default bg-lighterGray">
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <div className="flex">
          <TabButton title="Tarefas" />
          <TabButton title="Assinaturas" />
          <TabButton title="Movimentações" />
        </div>
        <Tab.List className="rounded-lg h-full">{children}</Tab.List>
      </Tab.Group>
    </div>
  );
};

export default ProcedureTabs;
