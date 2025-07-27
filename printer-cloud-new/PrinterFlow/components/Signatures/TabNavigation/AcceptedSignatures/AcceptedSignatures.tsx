import * as React from 'react';
import { Tab } from '@headlessui/react';
import { Typography, Icon, Item, Input } from 'printer-ui';
import { SignaturesTabProps } from '../types';
import { sortMapping, sortOptions } from '../../../../Signatures/Select';
import Pagination from '../../../../../components/Pagination';
import SignaturesSortSelect from '../../../../Signatures/Select';
import SignaturesTable from '../../Table';

const AcceptedSignaturesTab = ({ params, setParams }: SignaturesTabProps) => {
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }

  const [sortSelection, setSortSelection] = React.useState(sortOptions[0]);
  const [totalObjects, setTotalObjects] = React.useState(0);

  return (
    <Tab.Panel
      className={classNames('rounded-lg p-3 flex h-full', 'focus:outline-none')}
    >
      <div className="space-y-4 pt-4 w-full h-fit">
        <div className="flex justify-between items-center space-x-6">
          <span className="flex items-center sm:space-x-2.5">
            <Typography
              variant="footnote1"
              color="gray"
              className="hidden sm:block"
            >
              Ordenar por
            </Typography>
            <div className="hidden sm:block">
              <SignaturesSortSelect
                size="md"
                w="52"
                sortSelection={sortSelection}
                setSortSelection={(item: Item) => {
                  setSortSelection(item);
                  setParams({ ...params, ...sortMapping[item.id], page: 1 });
                }}
              />
            </div>
            <div className="sm:hidden">
              <SignaturesSortSelect
                size="sm"
                w="36"
                sortSelection={sortSelection}
                setSortSelection={(item: Item) => {
                  setSortSelection(item);
                  setParams({ ...params, ...sortMapping[item.id], page: 1 });
                }}
              />
            </div>
          </span>
          <Pagination
            page={params.page}
            setPage={(page) => setParams({ ...params, page: page })}
            totalPages={Math.ceil(totalObjects / Number(params.perPage))}
            totalObjects={totalObjects}
            objectsPerPage={params.perPage}
          />
        </div>
        <SignaturesTable params={params} setTotalObjects={setTotalObjects} />
      </div>
    </Tab.Panel>
  );
};

export default AcceptedSignaturesTab;
