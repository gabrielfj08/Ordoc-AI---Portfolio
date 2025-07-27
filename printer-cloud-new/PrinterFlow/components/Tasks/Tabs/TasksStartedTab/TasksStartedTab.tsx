import * as React from 'react';
import { Tab } from '@headlessui/react';
import { Typography, Icon, Item, Input } from 'printer-ui';
import { TasksStartedTabProps } from './types';
import { sortMapping, sortOptions } from '../../../../Tasks/Select';
import Pagination from '../../../../../components/Pagination';
import TaskSortSelect from '../../../../Tasks/Select';
import TaskFilter from '../../../../Tasks/Filter';
import FilterButtonTask from '../../FilterTask';
import TasksTable from '../../Table';

const TasksStartedTab = ({ params, setParams }: TasksStartedTabProps) => {
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }

  const [sortSelection, setSortSelection] = React.useState(sortOptions[0]);
  const [totalObjects, setTotalObjects] = React.useState(0);

  return (
    <Tab.Panel
      className={classNames('rounded-lg p-1 flex h-full', 'focus:outline-none')}
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
          <FilterButtonTask params={params} setParams={setParams}>
            <TaskFilter />
          </FilterButtonTask>
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
              <TaskSortSelect
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
              <TaskSortSelect
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
        <TasksTable params={params} setTotalObjects={setTotalObjects} />
      </div>
    </Tab.Panel>
  );
};

export default TasksStartedTab;
