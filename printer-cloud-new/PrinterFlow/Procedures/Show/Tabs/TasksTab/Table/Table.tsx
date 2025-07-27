import * as React from 'react';
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Typography } from 'printer-ui';
import { useModal } from '../../../../../../hooks';
import { TasksTableProps } from './types';
import PriorityCell from './Cells/Priority';
import TaskCell from './Cells/Task';
import StatusCell from './Cells/Status';
import GroupAssigneeCell from './Cells/GroupAssignee';
import AssigneeCell from './Cells/Assignee';
import DeadlineCell from './Cells/Deadline';
import AttachmentCell from './Cells/Attachment';
import ShowTaskModal from '../../../../../../PrinterFlow/Tasks/Modals/Show';

const TasksTable = ({ data, procedure }: TasksTableProps) => {
  const { openModal } = useModal();
  const columnHelper = createColumnHelper<any>();

  const columns: ColumnDef<any, any>[] = [
    columnHelper.accessor((table) => table, {
      id: 'Priority',
      header: () => <div className="hidden sm:flex w-12" />,
      cell: (info) => <PriorityCell task={info.getValue()} />,
    }),
    columnHelper.accessor((row) => row, {
      id: 'Task',
      header: () => (
        <div className="sm:w-72 w-48 pl-3 sm:pl-0 truncate space-y-2">
          <Typography color="gray" variant="footnote1" family="robotoLight">
            Tarefa
          </Typography>
          <Typography
            color="gray"
            variant="footnote1"
            family="robotoLight"
            className="sm:hidden"
          >
            Status
          </Typography>
        </div>
      ),
      cell: (info) => <TaskCell task={info.getValue()} />,
    }),

    columnHelper.accessor((row) => row, {
      id: 'Status',
      header: () => (
        <div className="hidden sm:flex w-fit sm:w-28 px-1 truncate justify-center">
          <Typography
            color="gray"
            variant="footnote1"
            family="robotoLight"
            className="hidden sm:block text-center"
          >
            Status
          </Typography>
        </div>
      ),
      cell: (info) => <StatusCell task={info.getValue()} />,
    }),

    columnHelper.accessor((row) => row, {
      id: 'GroupAssignee',
      header: () => (
        <div className="hidden sm:flex w-fit sm:w-48 px-4 truncate justify-center">
          <Typography
            color="gray"
            variant="footnote1"
            family="robotoLight"
            className="hidden sm:block text-center truncate"
          >
            Atribuição
          </Typography>
        </div>
      ),
      cell: (info) => <GroupAssigneeCell task={info.getValue()} />,
    }),

    columnHelper.accessor((row) => row, {
      id: 'Assignee',
      header: () => (
        <div className="hidden sm:flex w-fit sm:w-48 px-4 truncate justify-center">
          <Typography
            color="gray"
            variant="footnote1"
            family="robotoLight"
            className="hidden sm:block text-center truncate"
          >
            Responsável
          </Typography>
        </div>
      ),
      cell: (info) => <AssigneeCell task={info.getValue()} />,
    }),

    columnHelper.accessor((row) => row, {
      id: 'Deadline',
      header: () => (
        <div className="flex w-fit sm:w-32 px-3 truncate">
          <Typography color="gray" variant="footnote1" family="robotoLight">
            Prazo
          </Typography>
        </div>
      ),
      cell: (info) => <DeadlineCell task={info.getValue()} />,
    }),

    columnHelper.accessor((table) => table, {
      id: 'Attachment',
      header: () => <div className="hidden sm:flex w-12" />,
      cell: (info) => <AttachmentCell task={info.getValue()} />,
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
                  openModal(
                    <ShowTaskModal
                      taskId={row.original.id}
                      procedure={procedure}
                    />
                  );
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
