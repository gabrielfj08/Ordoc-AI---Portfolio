import * as React from 'react';
import router from 'next/router';
import {
  Search,
  PaginationV3 as Pagination,
  TypographyV3 as Typography,
} from 'printer-ui';
import { useSession } from '../../hooks';
import { ExternalTasksProps, Item } from './types';
import TaskExternalSortSelect, {
  sortMapping,
  sortOptions,
} from '../components/Tasks/SelectFilter';
import ExternalTasksTable from './Table';

const ExternalTasks = ({ params, setParams }: ExternalTasksProps) => {
  const { session, themeColor } = useSession();

  if (!session) return null;

  const [sortSelection, setSortSelection] = React.useState(
    router.query.status === 'running' ? sortOptions[2] : sortOptions[0]
  );
  const [totalObjects, setTotalObjects] = React.useState(0);

  return (
    <div className="w-full flex flex-col mb-24 sm:mb-6 sm:pr-10 sm:pl-20 px-4">
      <Typography
        variant="headline4"
        family="jakartaBold"
        color={themeColor}
        align="start"
        className="py-4"
      >
        Tarefas
      </Typography>
      <div className="w-full sm:flex sm:space-x-4 space-x-0 sm:space-y-0 space-y-4 mb-4">
        <div className="sm:w-10/12 w-full">
          <Search
            w="full"
            placeholder="Nome da tarefa"
            color={themeColor}
            label="Busque uma tarefa específica"
            value={params.q}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setParams({ ...params, q: e.target.value, page: 1 });
            }}
            onClick={() => setParams({ ...params, page: 1, q: '' })}
          />
        </div>
        <div className="sm:w-2/12 w-full">
          <TaskExternalSortSelect
            size="md"
            w="full"
            label="Status"
            sortSelection={sortSelection}
            setSortSelection={(item: Item) => {
              setSortSelection(item);
              setParams({ ...params, ...sortMapping[item.id], page: 1 });
            }}
            color={themeColor}
          />
        </div>
      </div>
      <div className="w-full sm:h-[295px] h-56 overflow-x-auto">
        <ExternalTasksTable params={params} setTotalObjects={setTotalObjects} />
      </div>
      <div className="items-center justify-center flex mt-4">
        <Pagination
          color={themeColor}
          page={Number(params.page)}
          setPage={(page) => setParams({ ...params, page: Number(page) })}
          totalObjects={totalObjects}
          objectsPerPage={params.perPage}
        />
      </div>
    </div>
  );
};

export default ExternalTasks;
