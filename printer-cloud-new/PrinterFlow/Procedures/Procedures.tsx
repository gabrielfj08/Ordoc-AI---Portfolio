import * as React from 'react';
import router from 'next/router';
import { Tab } from '@headlessui/react';
import { Button } from 'printer-ui';
import { ProceduresProps } from './types';
import ProceduresTabs from '../components/Procedures/Tabs';
import ProceduresDraftsTab from '../components/Procedures/Tabs/ProceduresDraftsTab';
import ProceduresRunningTab from '../components/Procedures/Tabs/ProceduresRunningTab';
import ProceduresArchivedTab from '../components/Procedures/Tabs/ProceduresArchivedTab';
import ProceduresFinishedTab from '../components/Procedures/Tabs/ProceduresFinishedTab';

const Procedures = ({ procedures, userId }: ProceduresProps) => {
  return (
    <div className="pt-4">
      <Button
        onClick={() => {
          router.push(`/printer-flow/procedures/new`);
        }}
        label="Processo"
        color="info"
        className="hidden sm:flex w-full"
      >
        <Button.Icon
          alt="plus"
          name="plus"
          color="white"
          stroke
          w={24}
          h={24}
        />
      </Button>
      <div className="sm:hidden flex flex-col pl-1">
        <Button
          onClick={() => {
            router.push(`/printer-flow/procedures/new`);
          }}
          label="Processo"
          color="info"
          size="sm"
        >
          <Button.Icon
            alt="plus"
            name="plus"
            color="white"
            stroke
            w={24}
            h={24}
          />
        </Button>
      </div>
      <div className="w-full my-6">
        <ProceduresTabs
          totalProceduresDrafts={procedures.draft}
          totalProceduresArchived={procedures.archived}
          totalProceduresRunning={procedures.running + procedures.started}
          totalProceduresFinished={procedures.finished}
        >
          <Tab.Panels>
            <ProceduresDraftsTab userId={userId} />
            <ProceduresRunningTab userId={userId} />
            <ProceduresArchivedTab userId={userId} />
            <ProceduresFinishedTab userId={userId} />
          </Tab.Panels>
        </ProceduresTabs>
      </div>
    </div>
  );
};

export default Procedures;
