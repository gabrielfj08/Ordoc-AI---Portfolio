import * as React from 'react';
import { Tab } from '@headlessui/react';
import { Typography, Icon, Item, Input, Button } from 'printer-ui';
import { TasksTabProps } from './types';
import TaskSortSelect, {
  sortMapping,
  sortOptions,
} from '../../../../components/Tasks/Select';
import { useModal } from '../../../../../hooks';
import TaskProcedureFilterButton from './FilterTaskProcedure';
import Pagination from '../../../../../components/Pagination';
import NewTaskModal from '../../../../Tasks/Modals/New';
import TasksTable from './Table';
import TaskFilter from './Filter';

const TasksTab = ({ params, setParams, procedure }: TasksTabProps) => {
  const { openModal } = useModal();
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
        <div className="w-full sm:hidden flex px-1">
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
              w={28}
              h={28}
            />
          </Input>
        </div>
        <div className="items-center flex sm:justify-start justify-between sm:space-x-4 px-1">
          <Button
            label="Nova tarefa"
            color="info"
            className="hidden sm:flex"
            onClick={() => openModal(<NewTaskModal />)}
          >
            <Button.Icon
              alt="plus"
              name="plus"
              color="white"
              stroke
              w={20}
              h={20}
            />
          </Button>
          <div className="sm:hidden flex">
            <Button
              label="Nova tarefa"
              color="info"
              size="sm"
              onClick={() => openModal(<NewTaskModal />)}
            >
              <Button.Icon
                alt="plus"
                name="plus"
                color="white"
                stroke
                w={20}
                h={20}
              />
            </Button>
          </div>
          <div className="w-6/12 hidden sm:flex">
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
          <TaskProcedureFilterButton params={params} setParams={setParams}>
            <TaskFilter />
          </TaskProcedureFilterButton>
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
        <TasksTable
          params={params}
          setTotalObjects={setTotalObjects}
          procedure={procedure}
        />
      </div>
    </Tab.Panel>
  );
};

export default TasksTab;
