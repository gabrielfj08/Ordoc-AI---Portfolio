import * as React from 'react';
import router from 'next/router';
import { Tab } from '@headlessui/react';
import { Button } from 'printer-ui';
import { SessionGroupRequesterProvider, useActionSheet } from '../../../hooks';
import { ShowProcedureProps } from './types';
import NewProcedureFields from '../../../PrinterFlow/Procedures/New/Fields';
import CreateProcedurePDFActionSheet from '../New/Info/ActionSheet';
import ProcedureButtons from './ProcedureButtons';
import ShowProcedureFields from './Fields';
import TasksTab from './Tabs/TasksTab';
import ShowProcedureInfo from './Info';
import ProcedureTabs from './Tabs';
import SignaturesTab from './Tabs/SignaturesTab';
import ProcedureRecordsTab from './Tabs/ProcedureRecordsTab';

const ShowProcedure = ({ procedure, subject }: ShowProcedureProps) => {
  const { openActionSheet } = useActionSheet();

  return (
    <SessionGroupRequesterProvider>
      <div className="pt-8">
        <div className="flex space-x-4 pl-4">
          <Button
            outlined
            color="info"
            className="pl-7 sm:pl-4"
            label={window.innerWidth < 640 ? '' : 'Gerar PDF'}
            onClick={() => {
              openActionSheet(
                <CreateProcedurePDFActionSheet
                  procedureId={Number(router.query.procedureId)}
                />
              );
            }}
          >
            <Button.Icon
              alt="PDFFile"
              name="pdfFileV2"
              color="info"
              w={25}
              h={25}
              fill
            />
          </Button>
          <ProcedureButtons procedure={procedure} />
        </div>
        <ShowProcedureInfo procedure={procedure} subject={subject} />
        {procedure.schema.length && !procedure.payload.length ? (
          <NewProcedureFields procedure={procedure} />
        ) : (
          <>
            <ShowProcedureFields procedure={procedure} />
            <ProcedureTabs>
              <Tab.Panels className="rounded-lg h-full w-full">
                <TasksTab procedure={procedure} />
                <SignaturesTab procedure={procedure} />
                <ProcedureRecordsTab justifiableId={procedure.id} />
              </Tab.Panels>
            </ProcedureTabs>
          </>
        )}
      </div>
    </SessionGroupRequesterProvider>
  );
};

export default ShowProcedure;
