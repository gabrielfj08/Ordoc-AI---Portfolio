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
import { UsersProps } from './types';
import { User as userType } from '../../../types';
import UserCell from './UserCell';
import StatusCell from './StatusCell';
import UserGroupCell from './UserGroupCell';
import MenuCell from './Cells/Menu';

const Users = ({ users }: UsersProps) => {
  const columnHelper = createColumnHelper<userType>();

  const columns: ColumnDef<userType, any>[] = [
    columnHelper.accessor((row) => row, {
      id: 'Nome',
      header: () => (
        <div className="px-4 w-full">
          <Typography color="gray">Nome</Typography>
        </div>
      ),
      cell: (info) => <UserCell user={info.getValue()} />,
    }),
    columnHelper.accessor((row) => row, {
      id: 'Status',
      header: () => (
        <div className="px-4 w-full items-center justify-center hidden sm:flex">
          <Typography color="gray">Status</Typography>
        </div>
      ),
      cell: (info) => <StatusCell user={info.getValue()} />,
    }),
    columnHelper.accessor((row) => row, {
      id: 'Nº de grupos',
      header: () => (
        <div className="px-4 w-full items-center justify-center hidden sm:flex">
          <Typography color="gray">Nº de grupos</Typography>
        </div>
      ),
      cell: (info) => <UserGroupCell user={info.getValue()} />,
    }),
    columnHelper.accessor((row) => row, {
      id: 'Menu',
      header: () => <div className="w-12" />,
      cell: (info) => <MenuCell user={info.getValue()} />,
    }),
  ];

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
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
              onClick={() => {
                router.push(`/printer-cloud/users/${row.original.id}`);
              }}
            >
              {row.getVisibleCells().map((cell) => {
                return (
                  <td key={cell.id} className="w-fit">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Users;
