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
import { Policy } from '../../../types';
import UsersCell from './UsersCell';
import PoliciesCell from './PoliciesCell';
import GroupsCell from './GroupCell';
import CreatorCell from './StatusCell';
import MenuCell from './Cells/Menu';

const Policies = ({ policies }) => {
  const columnHelper = createColumnHelper<Policy>();

  const columns: ColumnDef<Policy, any>[] = [
    columnHelper.accessor((row) => row, {
      id: 'Nome',
      header: () => (
        <div className="px-4 w-full">
          <Typography color="gray">Nome</Typography>
        </div>
      ),
      cell: (info) => <PoliciesCell policy={info.getValue()} />,
    }),
    columnHelper.accessor((row) => row, {
      id: 'Criador',
      header: () => (
        <div className="px-4 w-full items-center justify-center hidden sm:flex">
          <Typography color="gray" className="hidden sm:block">
            Criador
          </Typography>
        </div>
      ),
      cell: (info) => <CreatorCell policy={info.getValue()} />,
    }),
    columnHelper.accessor((row) => row, {
      id: 'Nº Grupos',
      header: () => (
        <div className="px-4 w-full items-center justify-center hidden sm:flex">
          <Typography color="gray">Nº Grupos</Typography>
        </div>
      ),
      cell: (info) => <GroupsCell policy={info.getValue()} />,
    }),
    columnHelper.accessor((row) => row, {
      id: 'Nº Usuários',
      header: () => (
        <div className="px-4 w-full items-center justify-center hidden sm:flex">
          <Typography color="gray">Nº Usuários</Typography>
        </div>
      ),
      cell: (info) => <UsersCell policy={info.getValue()} />,
    }),
    columnHelper.accessor((row) => row, {
      id: 'Menu',
      header: () => <div className="w-12" />,
      cell: (info) => <MenuCell policy={info.getValue()} />,
    }),
  ];

  const table = useReactTable({
    data: policies,
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
                router.push(`/printer-cloud/policies/${row.original.id}`);
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

export default Policies;
