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
import { UserGroupsProps } from './types';
import { UserGroup as userGroupType } from '../../../types/userGroup';
import UserGroupCell from './UserGroupCell';
import UserGroupStatusCell from './Cells/Status';
import UsersCell from './UsersCell';
import MenuCell from './Cells/Menu';
import UserPolicyCell from './Cells/UserPolicyCell';

const UserGroup = ({ userGroups }: UserGroupsProps) => {
  const columnHelper = createColumnHelper<userGroupType>();

  const columns: ColumnDef<userGroupType, any>[] = [
    columnHelper.accessor((row) => row, {
      id: 'Nome',
      header: () => (
        <div className="px-4">
          <Typography color="gray">Nome</Typography>
        </div>
      ),
      cell: (info) => <UserGroupCell userGroup={info.getValue()} />,
    }),
    columnHelper.accessor((row) => row, {
      id: 'Status',
      header: () => (
        <div className="px-4 hidden sm:block">
          <Typography color="gray">Status</Typography>
        </div>
      ),
      cell: (info) => <UserGroupStatusCell userGroup={info.getValue()} />,
    }),
    columnHelper.accessor((row) => row, {
      id: 'Nº Usuários',
      header: () => (
        <div className="px-4 hidden sm:block">
          <Typography color="gray">Nº Usuários</Typography>
        </div>
      ),
      cell: (info) => <UsersCell userGroup={info.getValue()} />,
    }),
    columnHelper.accessor((row) => row, {
      id: 'Nº Permissões',
      header: () => (
        <div className="px-4 hidden sm:block">
          <Typography color="gray">Nº Permissões</Typography>
        </div>
      ),
      cell: (info) => <UserPolicyCell userGroup={info.getValue()} />,
    }),
    columnHelper.accessor((row) => row, {
      id: 'Menu',
      header: () => <div className="w-12" />,
      cell: (info) => <MenuCell userGroup={info.getValue()} />,
    }),
  ];

  const table = useReactTable({
    data: userGroups,
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
                router.push(`/printer-cloud/user-groups/${row.original.id}`);
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

export default UserGroup;
