import * as React from 'react';
import { Tab } from '@headlessui/react';
import { Typography, Icon, Item, Input } from 'printer-ui';
import { ProceduresDraftsTabProps } from './types';
import FilterButtonProcedure from '../../FilterProcedure';
import ProcedureFilter from '../../../../Procedures/Filter';
import ProcedureSortSelect, {
  sortMapping,
  sortOptions,
} from '../../../../Procedures/Select';
import Pagination from '../../../../../components/Pagination';
import ProceduresTable from '../../Table';

const ProceduresDraftsTab = ({
  params,
  setParams,
}: ProceduresDraftsTabProps) => {
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }

  const [sortSelection, setSortSelection] = React.useState(sortOptions[0]);
  const [totalObjects, setTotalObjects] = React.useState(0);

  return (
    <Tab.Panel
      className={classNames('rounded-lg flex p-1 h-full', 'focus:outline-none')}
    >
      <div className="space-y-4 pt-4 w-full h-fit">
        <div className="sm:items-center flex sm:space-x-4 sm:justify-start justify-between sm:px-0 px-2">
          <div className="w-8/12 pl-2 hidden sm:block">
            <Input
              type="search"
              float
              name="q"
              size="md"
              w="full"
              value={params.q}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setParams({ ...params, q: e.target.value, page: 1 });
              }}
            >
              <Icon
                name="search"
                alt="search"
                color="gray"
                fill
                stroke
                w={28}
                h={28}
              />
            </Input>
          </div>
          <div className="w-8/12 sm:hidden block">
            <Input
              type="search"
              float
              name="q"
              size="sm"
              w="full"
              value={params.q}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setParams({ ...params, q: e.target.value, page: 1 });
              }}
            >
              <Icon
                name="search"
                alt="search"
                color="gray"
                fill
                stroke
                w={24}
                h={24}
              />
            </Input>
          </div>
          <FilterButtonProcedure params={params} setParams={setParams}>
            <ProcedureFilter />
          </FilterButtonProcedure>
        </div>
        <div className="flex justify-between items-center px-2">
          <span className="flex items-center sm:space-x-2.5">
            <Typography
              variant="footnote1"
              color="gray"
              className="hidden sm:block"
            >
              Ordenar por
            </Typography>
            <div className="hidden sm:block">
              <ProcedureSortSelect
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
              <ProcedureSortSelect
                size="sm"
                w="44"
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
            totalPages={Math.ceil(totalObjects / params.perPage)}
            totalObjects={totalObjects}
            objectsPerPage={params.perPage}
          />
        </div>
        <ProceduresTable params={params} setTotalObjects={setTotalObjects} />
      </div>
    </Tab.Panel>
  );
};

export default ProceduresDraftsTab;
