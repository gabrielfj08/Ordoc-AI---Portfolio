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
import { RequestersTableProps } from './types';
import MenuCellContainer from './Cells/Menu';
import RequestersCellContainer from './Cells/Requesters';
import RequestersStatusCellContainer from './Cells/Status';
import RequestersDataContainer from './Cells/RequestersData';
import RequestersTypeCellContainer from './Cells/ResquestersType';

const RequestersTable = ({ data }: RequestersTableProps) => {
  const columnHelper = createColumnHelper<any>();

  const columns: ColumnDef<any, any>[] = [
    columnHelper.accessor((table) => table, {
      id: 'Name',
      header: () => (
        <div className="px-3 w-32 sm:w-auto truncate">
          <Typography
            color="gray"
            variant="footnote1"
            family="robotoLight"
            className="truncate"
          >
            Nome/Razão social
          </Typography>
          <Typography
            color="gray"
            variant="footnote1"
            family="robotoLight"
            className="sm:hidden"
          >
            CPF/CNPJ
          </Typography>
        </div>
      ),
      cell: (info) => <RequestersCellContainer requesters={info.getValue()} />,
    }),
    columnHelper.accessor((row) => row, {
      id: 'RequesterType',
      header: () => (
        <div className="w-fit sm:w-44 px-4">
          <Typography
            color="gray"
            variant="footnote1"
            family="robotoLight"
            className="hidden sm:block text-center"
          >
            Tipo
          </Typography>
        </div>
      ),
      cell: (info) => (
        <RequestersTypeCellContainer requesters={info.getValue()} />
      ),
    }),
    columnHelper.accessor((row) => row, {
      id: 'Status',
      header: () => (
        <div className="hidden sm:block w-fit sm:w-44 sm:px-4">
          <Typography
            color="gray"
            variant="footnote1"
            family="robotoLight"
            className="text-center"
          >
            Status
          </Typography>
        </div>
      ),
      cell: (info) => (
        <RequestersStatusCellContainer requesters={info.getValue()} />
      ),
    }),
    columnHelper.accessor((row) => row, {
      id: 'CPF/CNPJ',
      header: () => (
        <div className="w-fit sm:w-52 sm:px-4">
          <Typography
            variant="footnote1"
            family="robotoLight"
            color="gray"
            className="hidden sm:block text-center"
          >
            CPF/CNPJ
          </Typography>
        </div>
      ),
      cell: (info) => <RequestersDataContainer requesters={info.getValue()} />,
    }),
    columnHelper.accessor((row) => row, {
      id: 'Menu',
      header: () => <div className="w-12" />,
      cell: (info) => <MenuCellContainer requester={info.getValue()} />,
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
                onClick={() =>
                  router.push(`/printer-flow/requesters/${row.original.id}`)
                }
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

export default RequestersTable;
