import * as React from 'react';
import router from 'next/router';
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Typography } from 'printer-ui';
import { TaskTemplatesTableProps } from './types';
import TaskTemplateNameCell from './Cells/Name';
import TaskTemplateDescriptionCell from './Cells/Description';
import TaskTemplateStatusCell from './Cells/Status';
import TaskTemplateMenuCell from './Cells/Menu';

const TaskTemplatesTable = ({ data }: TaskTemplatesTableProps) => {
  const columnHelper = createColumnHelper<any>();

  const columns: ColumnDef<any, any>[] = [
    columnHelper.accessor((table) => table, {
      id: 'name',
      header: () => (
        <div className="px-3 sm:w-56 w-auto truncate">
          <Typography
            color="gray"
            variant="footnote1"
            family="robotoLight"
            className="truncate"
          >
            Nome do tipo de tarefa
          </Typography>
        </div>
      ),
      cell: (info) => <TaskTemplateNameCell taskTemplate={info.getValue()} />,
    }),
    columnHelper.accessor((row) => row, {
      id: 'description',
      header: () => (
        <div className="hidden sm:block w-80 px-4 items-center justify-start">
          <Typography color="gray" variant="footnote1" family="robotoLight">
            Descrição
          </Typography>
        </div>
      ),
      cell: (info) => (
        <TaskTemplateDescriptionCell taskTemplate={info.getValue()} />
      ),
    }),
    columnHelper.accessor((row) => row, {
      id: 'status',
      header: () => (
        <div className="hidden sm:flex w-full sm:w-24 items-center justify-center">
          <Typography color="gray" variant="footnote1" family="robotoLight">
            Status
          </Typography>
        </div>
      ),
      cell: (info) => <TaskTemplateStatusCell taskTemplate={info.getValue()} />,
    }),
    columnHelper.accessor((row) => row, {
      id: 'Menu',
      header: () => <div className="w-12" />,
      cell: (info) => <TaskTemplateMenuCell taskTemplate={info.getValue()} />,
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
  });

  return (
    <div className="p-2">
      <div className="h-2" />
      <table className="w-full border border-lighterGray">
        <thead className="border border-lighterGray">
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
        <tbody className="divide-y divide-lighterGray">
          {table.getRowModel().rows.map((row) => {
            return (
              <tr
                key={row.id}
                className="h-20 hover:bg-blue/5 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(
                    `/printer-flow/task-templates/${row.original.id}`
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

export default TaskTemplatesTable;
