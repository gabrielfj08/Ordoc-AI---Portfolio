import * as React from 'react';
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Typography } from 'printer-ui';
import { useModal } from '../../../../hooks';
import { TasksTableProps } from './types';
import MenuCell from './Cells/Menu';
import TaskCell from './Cells/Task';
import PriorityCell from './Cells/Priority';
import DeadlineCell from './Cells/Deadline';
import ProcedureCell from './Cells/Procedure';
import StatusRefusedTaskCell from './Cells/Status';
import ShowTaskModal from '../../../Tasks/Modals/Show';
import ResponsibleRefusedTaskCell from './Cells/ResponsibleRefused';

const TasksTable = ({ data, filter }: TasksTableProps) => {
  const { openModal } = useModal();
  const columnHelper = createColumnHelper<any>();

  const columns: ColumnDef<any, any>[] = [
    columnHelper.accessor((table) => table, {
      id: 'PriorityTask',
      header: () => (
        <div className="hidden sm:flex px-3 w-full">
          <Typography color="gray" variant="footnote1" family="robotoLight">
            Prioridade
          </Typography>
        </div>
      ),
      cell: (info) => <PriorityCell task={info.getValue()} />,
    }),

    columnHelper.accessor((row) => row, {
      id: 'TaskName',
      header: () => (
        <div className="px-2 w-full sm:flex">
          <Typography color="gray" variant="footnote1" family="robotoLight">
            Tarefa
          </Typography>
          <Typography
            color="gray"
            variant="footnote1"
            family="robotoLight"
            className="sm:hidden block"
          >
            Código do processo
          </Typography>
        </div>
      ),
      cell: (info) => <TaskCell task={info.getValue()} />,
    }),

    columnHelper.accessor((row) => row, {
      id: 'ProcedureCode',
      header: () => (
        <div className="lg:w-[250px] md:w-[150px] w-44 items-center justify-center hidden sm:flex">
          <Typography
            color="gray"
            variant="footnote1"
            family="robotoLight"
            className="hidden sm:flex text-center"
          >
            Processo
          </Typography>
        </div>
      ),
      cell: (info) => <ProcedureCell task={info.getValue()} />,
    }),

    columnHelper.accessor((row) => row, {
      id: 'DeadlineTask',
      header: () => (
        <div className="px-4 w-full items-center justify-center hidden sm:flex">
          <Typography
            color="gray"
            variant="footnote1"
            family="robotoLight"
            className="hidden sm:block"
          >
            Prazo
          </Typography>
        </div>
      ),
      cell: (info) => <DeadlineCell task={info.getValue()} />,
    }),

    columnHelper.accessor((row) => row, {
      id: 'ResponsibleRefused',
      header: () => (
        <div
          key="Responsible"
          className="px-4 w-40 items-center justify-center hidden sm:flex "
        >
          <Typography color="gray" variant="footnote1" family="robotoLight">
            Responsável
          </Typography>
        </div>
      ),
      cell: (info) => <ResponsibleRefusedTaskCell task={info.getValue()} />,
    }),

    columnHelper.accessor((row) => row, {
      id: 'Status',
      header: () => (
        <div className="px-2 w-fit sm:w-20 items-center justify-center hidden sm:flex">
          <Typography color="gray" variant="footnote1" family="robotoLight">
            Status
          </Typography>
        </div>
      ),
      cell: (info) => <StatusRefusedTaskCell task={info.getValue()} />,
    }),

    columnHelper.accessor((row) => row, {
      id: 'Menu',
      header: () => <div className="w-12" />,
      cell: (info) => <MenuCell task={info.getValue()} />,
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      columnVisibility: {
        ResponsibleRefused: filter === 'refused' ? true : false,
        Status: filter === 'doneByMe' ? true : false,
      },
    },
  });

  return (
    <div className="p-2">
      <div className="h-2" />
      <table className="w-full border bg-white border-lightGray">
        <thead className="border border-lightGray">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center h-20">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-lightGray">
          {table.getRowModel().rows.map((row) => {
            return (
              <tr
                key={row.id}
                className="h-20 hover:bg-blue/5 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  openModal(<ShowTaskModal taskId={row.original.id} />);
                }}
              >
                {row.getCenterVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TasksTable;
