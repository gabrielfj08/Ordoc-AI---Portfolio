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
import { SearchTableProps } from './types';
import ProcessNumberCell from './Cells/ProcessNumber';
import ProcedureTemplateCell from './Cells/ProcedureTemplate';
import DeadlineCell from './Cells/Deadline';
import SourceCell from './Cells/Source';
import VisibilityCell from './Cells/Visibility';
import StatusCell from './Cells/Status';

const SearchTable = ({ data }: SearchTableProps) => {
  const columnHelper = createColumnHelper<any>();

  const columns: ColumnDef<any, any>[] = [
    columnHelper.accessor((table) => table, {
      id: 'ProcessNumber',
      header: () => (
        <>
          <div className="px-3 w-auto">
            <Typography
              variant="footnote1"
              family="robotoLight"
              color="gray"
              className="sm:hidden flex text-start"
            >
              Código do processo
            </Typography>
            <Typography
              variant="footnote1"
              family="robotoLight"
              color="gray"
              className="sm:hidden flex text-start py-1"
            >
              Tipo do processo
            </Typography>
          </div>
          <div className="flex px-4 min-w-45">
            <Typography
              variant="footnote1"
              family="robotoLight"
              color="gray"
              className="hidden sm:flex text-start"
            >
              Código do processo
            </Typography>
          </div>
        </>
      ),
      cell: (info) => <ProcessNumberCell procedure={info.getValue()} />,
    }),
    columnHelper.accessor((row) => row, {
      id: 'ProcedureTemplate',
      header: () => (
        <div className="hidden sm:flex w-fit sm:w-auto truncate justify-start">
          <Typography
            variant="footnote1"
            family="robotoLight"
            color="gray"
            className="hidden sm:block text-center truncate"
          >
            Tipo de processo
          </Typography>
        </div>
      ),
      cell: (info) => <ProcedureTemplateCell procedure={info.getValue()} />,
    }),
    columnHelper.accessor((row) => row, {
      id: 'Status',
      header: () => (
        <div className="hidden sm:flex w-fit px-5 sm:w-44 truncate">
          <Typography
            variant="footnote1"
            family="robotoLight"
            color="gray"
            className="hidden sm:block text-center"
          >
            Status
          </Typography>
        </div>
      ),
      cell: (info) => <StatusCell procedure={info.getValue()} />,
    }),
    columnHelper.accessor((row) => row, {
      id: 'Deadline',
      header: () => (
        <div className="hidden lg:flex w-fit px-6 s:w-44 justify-center truncate">
          <Typography
            variant="footnote1"
            family="robotoLight"
            color="gray"
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
        <div className="hidden 2xl:flex w-fit px-16 sm:w-32  truncate">
          <Typography
            variant="footnote1"
            family="robotoLight"
            color="gray"
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
        <div className="hidden xl:flex w-fit  sm:w-32 truncate px-12">
          <Typography
            variant="footnote1"
            family="robotoLight"
            color="gray"
            className="hidden sm:block text-center"
          >
            Visibilidade
          </Typography>
        </div>
      ),
      cell: (info) => <VisibilityCell procedure={info.getValue()} />,
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
                onClick={() => {
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

export default SearchTable;
