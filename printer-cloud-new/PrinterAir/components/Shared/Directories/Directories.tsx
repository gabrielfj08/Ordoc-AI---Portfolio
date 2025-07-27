import * as React from 'react';
import router from 'next/router';
import {
  createColumnHelper,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Typography } from 'printer-ui';
import { SharedDirectoriesTableProps } from './types';
import DirectoryCell from './Table/Cells/Directory';
import SharedByCell from './Table/Cells/SharedBy';
import SharedAtCell from './Table/Cells/SharedAt';

const SharedDirectoriesTable = ({ data }: SharedDirectoriesTableProps) => {
  const [rowSelection, setRowSelection] = React.useState({});

  const columnHelper = createColumnHelper<any>();

  const columns: ColumnDef<any, any>[] = [
    columnHelper.accessor((row) => row, {
      id: 'Directory',
      header: () => (
        <Typography
          color="gray"
          variant="footnote1"
          family="robotoLight"
          className="w-fit pl-5"
        >
          Pasta
        </Typography>
      ),
      cell: (info) => <DirectoryCell sharedDirectory={info.getValue()} />,
    }),

    columnHelper.accessor((row) => row, {
      id: 'SharedBy',
      header: () => (
        <div className="w-full">
          <Typography
            color="gray"
            variant="footnote1"
            family="robotoLight"
            className="hidden sm:block text-center"
          >
            Compartilhado por
          </Typography>
        </div>
      ),
      cell: (info) => <SharedByCell sharedDirectory={info.getValue()} />,
    }),

    columnHelper.accessor((row) => row, {
      id: 'SharedAt',
      header: () => (
        <div className="w-full">
          <Typography
            color="gray"
            variant="footnote1"
            family="robotoLight"
            className="hidden sm:block text-center"
          >
            Data de compartilhamento
          </Typography>
        </div>
      ),
      cell: (info) => <SharedAtCell sharedDirectory={info.getValue()} />,
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
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
                    `/printer-air/shared/organizations/${row.original.organizationId}/sharedDirectories?parentSharedId=${row.original.id}`
                  );
                }}
              >
                {row.getVisibleCells().map((cell) => {
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

export default SharedDirectoriesTable;
