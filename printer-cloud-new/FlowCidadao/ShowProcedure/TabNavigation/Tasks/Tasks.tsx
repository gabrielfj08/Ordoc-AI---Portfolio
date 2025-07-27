import * as React from 'react';
import { PaginationV3 as Pagination } from 'printer-ui';
import TasksTable from '../../../../FlowCidadao/components/Tasks/Table';
import { TasksTableContainerProps } from './types';

const TasksTableContainer = ({
  color,
  params,
  setParams,
}: TasksTableContainerProps) => {
  const [totalObjects, setTotalObjects] = React.useState<number>(0);

  return (
    <div className="space-y-3">
      <div className="h-[289px] overflow-x-auto">
        <TasksTable params={params} setTotalObjects={setTotalObjects} />
      </div>
      <div className="w-full flex justify-center p-3">
        <Pagination
          color={color}
          page={Number(params.page)}
          setPage={(page) => setParams({ ...params, page: page })}
          totalObjects={totalObjects}
          objectsPerPage={params.perPage}
        />
      </div>
    </div>
  );
};

export default TasksTableContainer;
