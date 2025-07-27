import * as React from 'react';
import router from 'next/router';
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Typography } from 'printer-ui';
import { ProceduresTableProps } from './types';
import MenuCell from './Cells/Menu';
import PriorityCell from './Cells/Priority';
import ProcessNumberCell from './Cells/ProcessNumber';
import ProcedureTemplateCell from './Cells/ProcedureTemplate';
import DeadlineCell from './Cells/Deadline';
import SourceCell from './Cells/Source';
import VisibilityCell from './Cells/Visibility';

const ProceduresTable = ({ data }: ProceduresTableProps) => {
  const columnHelper = createColumnHelper<any>();

  const columns: ColumnDef<any, any>[] = [
    columnHelper.accessor((table) => table, {
      id: 'Priority',
      header: () => (
        <div className="hidden sm:flex px-3 w-32 sm:w-auto">
          <Typography
            color="gray"
            variant="footnote1"
            family="robotoLight"
            className="hidden sm:flex text-center"
          >
            Prioridade
          </Typography>
        </div>
      ),
      cell: (info) => <PriorityCell procedure={info.getValue()} />,
    }),
    columnHelper.accessor((row) => row, {
      id: 'ProcessNumber',
      header: () => (
        <div className="px-3 w-32 sm:w-auto truncate">
          <Typography
            color="gray"
            variant="footnote1"
            family="robotoLight"
            className="sm:hidden"
          >
            Tipo de processo
          </Typography>
          <Typography color="gray" variant="footnote1" family="robotoLight">
            Código do processo
          </Typography>
        </div>
      ),
      cell: (info) => <ProcessNumberCell procedure={info.getValue()} />,
    }),
    columnHelper.accessor((row) => row, {
      id: 'ProcedureTemplate',
      header: () => (
        <div className="hidden sm:flex w-fit sm:w-80 px-4 truncate justify-center">
          <Typography
            color="gray"
            variant="footnote1"
            family="robotoLight"
            className="hidden sm:block text-center truncate"
          >
            Tipo de processo
          </Typography>
        </div>
      ),
      cell: (info) => <ProcedureTemplateCell procedure={info.getValue()} />,
    }),
    columnHelper.accessor((row) => row, {
      id: 'Deadline',
      header: () => (
        <div className="hidden sm:flex w-fit sm:w-44 px-4 truncate">
          <Typography
            color="gray"
            variant="footnote1"
            family="robotoLight"
            className="hidden sm:block text-center"
          >
            Prazo
          </Typography>
        </div>
      ),
      cell: (info) => <DeadlineCell procedure={info.getValue()} />,
    }),
    columnHelper.accessor((row) => row, {
      id: 'Source',
      header: () => (
        <div className="hidden sm:flex w-fit sm:w-32 px-3 truncate">
          <Typography
            color="gray"
            variant="footnote1"
            family="robotoLight"
            className="hidden sm:block text-center"
          >
            Origem
          </Typography>
        </div>
      ),
      cell: (info) => <SourceCell procedure={info.getValue()} />,
    }),
    columnHelper.accessor((row) => row, {
      id: 'Visibility',
      header: () => (
        <div className="hidden sm:flex w-fit sm:w-32 px-1 truncate">
          <Typography
            color="gray"
            variant="footnote1"
            family="robotoLight"
            className="hidden sm:block text-center"
          >
            Visibilidade
          </Typography>
        </div>
      ),
      cell: (info) => <VisibilityCell procedure={info.getValue()} />,
    }),
    columnHelper.accessor((row) => row, {
      id: 'Menu',
      header: () => <div className="w-12" />,
      cell: (info) => <MenuCell procedure={info.getValue()} />,
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
                  router.push(
                    `/printer-flow/group-requesters/${row.original.responsibleGroupId}/procedures/${row.original.id}`
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

export default ProceduresTable;
