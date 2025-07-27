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
import { DirectoriesTableProps } from './types';
import DirectoryCell from './Cells/Directory';
import CreatedAtCell from './Cells/CreatedAt';
import StatusCell from './Cells/Status';
import MenuCell from './Cells/Menu';
import IndeterminateCheckbox from '../../../components/IndeterminateCheckbox/IndeterminateCheckbox';
import { Typography } from 'printer-ui';

const DirectoriesTable = ({
  data,
  setSelectedDirectoryIds,
}: DirectoriesTableProps) => {
  const [rowSelection, setRowSelection] = React.useState({});

  React.useEffect(() => {
    {
      setSelectedDirectoryIds &&
        setSelectedDirectoryIds(
          Object.keys(rowSelection).map((row: any) => data[row].id)
        );
    }
  }, [rowSelection]);

  const columnHelper = createColumnHelper<any>();

  const columns: ColumnDef<any, any>[] = [
    columnHelper.accessor((table) => table, {
      id: 'Checkbox',
      header: ({ table }) => (
        <div className="px-4 sm:px-7 flex justify-center w-fit">
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        </div>
      ),
      cell: (info) => (
        <div className="px-4 sm:px-7 flex justify-center w-fit">
          <IndeterminateCheckbox
            value={info.getValue().id}
            name="selected"
            {...{
              checked: info.row.getIsSelected(),
              indeterminate: info.row.getIsSomeSelected(),
              onChange: info.row.getToggleSelectedHandler(),
            }}
          />
        </div>
      ),
    }),
    columnHelper.accessor((row) => row, {
      id: 'Directory',
      header: () => (
        <Typography
          color="gray"
          variant="footnote1"
          family="robotoLight"
          className="w-fit"
        >
          Pasta
        </Typography>
      ),
      cell: (info) => <DirectoryCell directory={info.getValue()} />,
    }),
    columnHelper.accessor((row) => row, {
      id: 'CreatedAt',
      header: () => (
        <div className="w-full">
          <Typography
            color="gray"
            variant="footnote1"
            family="robotoLight"
            className="hidden sm:block"
          >
            Criado
          </Typography>
        </div>
      ),
      cell: (info) => <CreatedAtCell directory={info.getValue()} />,
    }),
    columnHelper.accessor((row) => row, {
      id: 'Status',
      header: () => (
        <div className="w-full">
          <Typography
            color="gray"
            variant="footnote1"
            family="robotoLight"
            className="hidden sm:flex justify-center"
          >
            Status
          </Typography>
        </div>
      ),
      cell: (info) => <StatusCell directory={info.getValue()} />,
    }),
    columnHelper.accessor((row) => row, {
      id: 'Menu',
      header: () => <div className="w-12"></div>,
      cell: (info) => <MenuCell directory={info.getValue()} />,
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

  const handleRowClick = (row: any) => {
    router.push(
      `/printer-air/my-air/organizations/${row.original.organizationId}/directories/${row.original.id}?directoriesPage=1&directoriesOrder=name&directoriesDirection=asc&documentsPage=1&documentsOrder=original_filename&documentsDirection=asc`
    );
  };

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
                  handleRowClick(row);
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

export default DirectoriesTable;
