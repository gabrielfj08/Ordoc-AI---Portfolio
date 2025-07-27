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
import { GroupRequestersTableProps } from './types';
import GroupCodeCell from './Cells/GroupCode';
import GroupCell from './Cells/Group';
import StatusCell from './Cells/Status';
import UsersCountCell from './Cells/UsersCount';
import GroupsMenuButtonCell from './Cells/MenuButton';

const GroupRequestersTable = ({ data }: GroupRequestersTableProps) => {
  const columnHelper = createColumnHelper<any>();

  const columns: ColumnDef<any, any>[] = [
    columnHelper.accessor((table) => table, {
      id: 'GroupCode',
      header: () => (
        <div className="w-full px-4">
          <Typography
            color="gray"
            variant="footnote1"
            family="robotoLight"
            className="w-fit"
          >
            Código
          </Typography>
        </div>
      ),
      cell: (info) => <GroupCodeCell group={info.getValue()} />,
    }),
    columnHelper.accessor((row) => row, {
      id: 'Group',
      header: () => (
        <div className="px-3 w-32">
          <Typography
            color="gray"
            variant="footnote1"
            family="robotoLight"
            className="truncate"
          >
            Nome do grupo
          </Typography>
        </div>
      ),
      cell: (info) => <GroupCell group={info.getValue()} />,
    }),
    columnHelper.accessor((row) => row, {
      id: 'Status',
      header: () => (
        <div className="hidden sm:block w-fit lg:w-44 px-4">
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
      cell: (info) => <StatusCell group={info.getValue()} />,
    }),
    columnHelper.accessor((row) => row, {
      id: 'UsersCount',
      header: () => (
        <div className="w-44 px-4 hidden md:flex justify-center">
          <Typography
            color="gray"
            variant="footnote1"
            family="robotoLight"
            className="text-center"
          >
            Número de usuários
          </Typography>
        </div>
      ),
      cell: (info) => <UsersCountCell group={info.getValue()} />,
    }),
    columnHelper.accessor((row) => row, {
      id: 'Menu',
      header: () => <div className="w-12" />,
      cell: (info) => <GroupsMenuButtonCell group={info.getValue()} />,
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
                  router.push(`/printer-flow/groups/${row.original.id}`)
                }
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id} className="w-fit">
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

export default GroupRequestersTable;
