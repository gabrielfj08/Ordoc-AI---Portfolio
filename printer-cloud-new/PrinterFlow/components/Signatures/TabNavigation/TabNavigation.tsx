import * as React from 'react';
import { Tab } from '@headlessui/react';
import { Typography } from 'printer-ui';
import { SignaturesTabsProps } from './types';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const TabButton = ({ title, totalSignatures }) => {
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
          <Typography
            variant={window.innerWidth < 640 ? 'footnote1' : 'button'}
            family={selected ? 'robotoBold' : 'roboto'}
            color="white"
            className="truncate"
          >
            ({totalSignatures})
          </Typography>
        </div>
      )}
    </Tab>
  );
};

const SignaturesTabs = ({
  children,
  totalAcceptedSignatures,
  totalPendingSignatures,
  totalRefusedSignatures,
}: SignaturesTabsProps) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  return (
    <div className="w-full h-fit min-h-[33.125rem] mb-8 rounded-lg shadow-default bg-lighterGray">
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <div className="flex rounded-lg">
          <TabButton
            title="Pendentes"
            totalSignatures={totalPendingSignatures}
          />
          <TabButton
            title="Assinadas"
            totalSignatures={totalAcceptedSignatures}
          />
          <TabButton
            title="Recusadas"
            totalSignatures={totalRefusedSignatures}
          />
        </div>
        <Tab.List className="rounded-lg h-full w-full">{children}</Tab.List>
      </Tab.Group>
    </div>
  );
};

export default SignaturesTabs;
