import * as React from 'react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { TableV3 as Table } from 'printer-ui';
import {
  AuthExternalProvider,
  ExternalSessionProvider,
  useModal,
} from '../../../../hooks';
import { TaskTableProps } from './types';
import TaskNameCell from './Cells/TaskName';
import CreatedByCell from './Cells/CreatedBy';
import StatusCell from './Cells/Status';
import CreatedAtCell from './Cells/CreatedAt';
import TaskDocumentCell from './Cells/TaskDocument';
import ShowExternalTaskModal from '../ShowTask';

const TaskTable = ({ data, color }: TaskTableProps) => {
  const { openModal } = useModal();
  const columnHelper = createColumnHelper<any>();

  const columns: ColumnDef<any, any>[] = [
    columnHelper.accessor((row) => row, {
      id: 'name',
      header: 'Tarefa',
      cell: (info) => <TaskNameCell task={info.getValue()} />,
    }),

    window.innerWidth < 640
      ? columnHelper.accessor((row) => row, {
          id: 'createdBy.name',
          header: '',
          cell: (info) => <CreatedByCell task={info.getValue()} />,
        })
      : columnHelper.accessor((row) => row, {
          id: 'createdBy.name',
          header: 'Criador',
          cell: (info) => <CreatedByCell task={info.getValue()} />,
        }),

    columnHelper.accessor((row) => row, {
      id: 'status',
      header: 'Status',
      cell: (info) => <StatusCell task={info.getValue()} />,
    }),

    columnHelper.accessor((row) => row, {
      id: 'createdAt',
      header: 'Data',
      cell: (info) => <CreatedAtCell task={info.getValue()} />,
    }),

    window.innerWidth < 640
      ? columnHelper.accessor((row) => row, {
          id: 'taskDocument',
          header: '',
          cell: (info) => <TaskDocumentCell task={info.getValue()} />,
        })
      : columnHelper.accessor((row) => row, {
          id: 'taskDocument',
          header: 'Anexo',
          cell: (info) => <TaskDocumentCell task={info.getValue()} />,
        }),
  ];

  const handleClick = (task) => {
    openModal(
      <AuthExternalProvider>
        <ExternalSessionProvider>
          <ShowExternalTaskModal
            taskId={task.id}
            justificationVisibility={false}
          />
        </ExternalSessionProvider>
      </AuthExternalProvider>
    );
  };

  return (
    <Table
      data={data}
      columns={columns}
      color={color}
      onClick={(task) => handleClick(task)}
    />
  );
};

export default TaskTable;
