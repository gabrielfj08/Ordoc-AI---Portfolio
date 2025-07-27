import * as React from 'react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { TableV3 as Table } from 'printer-ui';
import {
  AuthExternalProvider,
  ExternalSessionProvider,
  useModal,
} from '../../../hooks';
import { ExternalTasksTableProps } from './types';
import ShowExternalTaskModal from '../../components/Tasks/ShowTask';
import ExternalCreatedAtCell from './Cells/CreatedAt';
import ExternalCreatedByCell from './Cells/CreatedBy';
import ExternalTaskNameCell from './Cells/TaskName';
import ExternalStatusCell from './Cells/Status';
import MenuTaskCell from './Cells/Menu';

const ExternalTasksTable = ({ data, color }: ExternalTasksTableProps) => {
  const { openModal } = useModal();
  const columnHelper = createColumnHelper<any>();

  const columns: ColumnDef<any, any>[] = [
    columnHelper.accessor((row) => row, {
      id: 'name',
      header: 'Tarefa',
      cell: (info) => <ExternalTaskNameCell task={info.getValue()} />,
    }),

    columnHelper.accessor((row) => row, {
      id: 'createdBy.name',
      header: 'Criador',
      cell: (info) => <ExternalCreatedByCell task={info.getValue()} />,
    }),

    window.innerWidth < 640
      ? columnHelper.accessor((row) => row, {
          id: 'createdAt.mobile',
          header: '',
          cell: (info) => <ExternalCreatedAtCell task={info.getValue()} />,
        })
      : columnHelper.accessor((row) => row, {
          id: 'createdAt',
          header: 'Data',
          cell: (info) => <ExternalCreatedAtCell task={info.getValue()} />,
        }),

    columnHelper.accessor((row) => row, {
      id: 'status',
      header: 'Status',
      cell: (info) => <ExternalStatusCell task={info.getValue()} />,
    }),

    columnHelper.accessor((row) => row, {
      id: 'Menu',
      header: '',
      cell: (info) => <MenuTaskCell task={info.getValue()} />,
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

export default ExternalTasksTable;
