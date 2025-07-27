import * as React from 'react';
import { Tab } from '@headlessui/react';
import { List, Typography } from 'printer-ui';
import Pagination from '../../../../../components/Pagination';
import { ProcedureRecordsTabProps } from './types';
import RecordIcon from './RecordIcon';

const ProcedureRecordsTab = ({
  totalObjects,
  records,
  params,
  setParams,
}: ProcedureRecordsTabProps) => {
  const procedureStatusMapping: Record<string, string> = {
    archive: 'arquivado',
    unarchive: 'desarquivado',
    finish: 'finalizado',
    create: 'criado',
  };

  return (
    <Tab.Panel className="p-2">
      <div className="pb-3 flex justify-end">
        <Pagination
          page={params.page}
          setPage={(page) => setParams({ ...params, page: page })}
          totalObjects={totalObjects}
          objectsPerPage={params.perPage}
          totalPages={Math.ceil(totalObjects / Number(params.perPage))}
        />
      </div>
      <List className="relative w-full">
        {records.map((record) => {
          return (
            <List.Item
              key={record.id}
              className="flex sm:w-full items-center space-x-2 h-fit bg-white"
            >
              <RecordIcon action={record.action} />
              <div>
                {record.action === 'archive' ||
                record.action === 'unarchive' ? (
                  <>
                    <Typography variant="footnote1">
                      Processo {procedureStatusMapping[record.action]} por {''}
                      {record.createdBy?.name} em {''}
                      {new Date(
                        Date.parse(record.updatedAt)
                      ).toLocaleDateString('pt-br')}
                      {''} às{' '}
                      {new Date(
                        Date.parse(record.updatedAt)
                      ).toLocaleTimeString('pt-br')}
                      .
                    </Typography>
                    <div className="sm:max-h-20 sm:overflow-y-auto py-1">
                      <Typography variant="footnote1" className="italic mt-1">
                        {record.note}.
                      </Typography>
                    </div>
                  </>
                ) : (
                  <Typography variant="footnote1">{record.note}</Typography>
                )}
              </div>
            </List.Item>
          );
        })}
      </List>
    </Tab.Panel>
  );
};

export default ProcedureRecordsTab;
